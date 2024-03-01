// these variables will be filled when generating the file - the template format is 'variable_name'
const staticryptInitiator = 
((function(){
  const exports = {};
  const cryptoEngine = ((function(){
  const exports = {};
  const { subtle } = crypto;

const IV_BITS = 16 * 8;
const HEX_BITS = 4;
const ENCRYPTION_ALGO = "AES-CBC";

/**
 * Translates between utf8 encoded hexadecimal strings
 * and Uint8Array bytes.
 */
const HexEncoder = {
    /**
     * hex string -> bytes
     * @param {string} hexString
     * @returns {Uint8Array}
     */
    parse: function (hexString) {
        if (hexString.length % 2 !== 0) throw "Invalid hexString";
        const arrayBuffer = new Uint8Array(hexString.length / 2);

        for (let i = 0; i < hexString.length; i += 2) {
            const byteValue = parseInt(hexString.substring(i, i + 2), 16);
            if (isNaN(byteValue)) {
                throw "Invalid hexString";
            }
            arrayBuffer[i / 2] = byteValue;
        }
        return arrayBuffer;
    },

    /**
     * bytes -> hex string
     * @param {Uint8Array} bytes
     * @returns {string}
     */
    stringify: function (bytes) {
        const hexBytes = [];

        for (let i = 0; i < bytes.length; ++i) {
            let byteString = bytes[i].toString(16);
            if (byteString.length < 2) {
                byteString = "0" + byteString;
            }
            hexBytes.push(byteString);
        }
        return hexBytes.join("");
    },
};

/**
 * Translates between utf8 strings and Uint8Array bytes.
 */
const UTF8Encoder = {
    parse: function (str) {
        return new TextEncoder().encode(str);
    },

    stringify: function (bytes) {
        return new TextDecoder().decode(bytes);
    },
};

/**
 * Salt and encrypt a msg with a password.
 */
async function encrypt(msg, hashedPassword) {
    // Must be 16 bytes, unpredictable, and preferably cryptographically random. However, it need not be secret.
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#parameters
    const iv = crypto.getRandomValues(new Uint8Array(IV_BITS / 8));

    const key = await subtle.importKey("raw", HexEncoder.parse(hashedPassword), ENCRYPTION_ALGO, false, ["encrypt"]);

    const encrypted = await subtle.encrypt(
        {
            name: ENCRYPTION_ALGO,
            iv: iv,
        },
        key,
        UTF8Encoder.parse(msg)
    );

    // iv will be 32 hex characters, we prepend it to the ciphertext for use in decryption
    return HexEncoder.stringify(iv) + HexEncoder.stringify(new Uint8Array(encrypted));
}
exports.encrypt = encrypt;

/**
 * Decrypt a salted msg using a password.
 *
 * @param {string} encryptedMsg
 * @param {string} hashedPassword
 * @returns {Promise<string>}
 */
async function decrypt(encryptedMsg, hashedPassword) {
    const ivLength = IV_BITS / HEX_BITS;
    const iv = HexEncoder.parse(encryptedMsg.substring(0, ivLength));
    const encrypted = encryptedMsg.substring(ivLength);

    const key = await subtle.importKey("raw", HexEncoder.parse(hashedPassword), ENCRYPTION_ALGO, false, ["decrypt"]);

    const outBuffer = await subtle.decrypt(
        {
            name: ENCRYPTION_ALGO,
            iv: iv,
        },
        key,
        HexEncoder.parse(encrypted)
    );

    return UTF8Encoder.stringify(new Uint8Array(outBuffer));
}
exports.decrypt = decrypt;

/**
 * Salt and hash the password so it can be stored in localStorage without opening a password reuse vulnerability.
 *
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>}
 */
async function hashPassword(password, salt) {
    // we hash the password in multiple steps, each adding more iterations. This is because we used to allow less
    // iterations, so for backward compatibility reasons, we need to support going from that to more iterations.
    let hashedPassword = await hashLegacyRound(password, salt);

    hashedPassword = await hashSecondRound(hashedPassword, salt);

    return hashThirdRound(hashedPassword, salt);
}
exports.hashPassword = hashPassword;

/**
 * This hashes the password with 1k iterations. This is a low number, we need this function to support backwards
 * compatibility.
 *
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>}
 */
function hashLegacyRound(password, salt) {
    return pbkdf2(password, salt, 1000, "SHA-1");
}
exports.hashLegacyRound = hashLegacyRound;

/**
 * Add a second round of iterations. This is because we used to use 1k, so for backwards compatibility with
 * remember-me/autodecrypt links, we need to support going from that to more iterations.
 *
 * @param hashedPassword
 * @param salt
 * @returns {Promise<string>}
 */
function hashSecondRound(hashedPassword, salt) {
    return pbkdf2(hashedPassword, salt, 14000, "SHA-256");
}
exports.hashSecondRound = hashSecondRound;

/**
 * Add a third round of iterations to bring total number to 600k. This is because we used to use 1k, then 15k, so for
 * backwards compatibility with remember-me/autodecrypt links, we need to support going from that to more iterations.
 *
 * @param hashedPassword
 * @param salt
 * @returns {Promise<string>}
 */
function hashThirdRound(hashedPassword, salt) {
    return pbkdf2(hashedPassword, salt, 585000, "SHA-256");
}
exports.hashThirdRound = hashThirdRound;

/**
 * Salt and hash the password so it can be stored in localStorage without opening a password reuse vulnerability.
 *
 * @param {string} password
 * @param {string} salt
 * @param {int} iterations
 * @param {string} hashAlgorithm
 * @returns {Promise<string>}
 */
async function pbkdf2(password, salt, iterations, hashAlgorithm) {
    const key = await subtle.importKey("raw", UTF8Encoder.parse(password), "PBKDF2", false, ["deriveBits"]);

    const keyBytes = await subtle.deriveBits(
        {
            name: "PBKDF2",
            hash: hashAlgorithm,
            iterations,
            salt: UTF8Encoder.parse(salt),
        },
        key,
        256
    );

    return HexEncoder.stringify(new Uint8Array(keyBytes));
}

function generateRandomSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(128 / 8));

    return HexEncoder.stringify(new Uint8Array(bytes));
}
exports.generateRandomSalt = generateRandomSalt;

async function signMessage(hashedPassword, message) {
    const key = await subtle.importKey(
        "raw",
        HexEncoder.parse(hashedPassword),
        {
            name: "HMAC",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );
    const signature = await subtle.sign("HMAC", key, UTF8Encoder.parse(message));

    return HexEncoder.stringify(new Uint8Array(signature));
}
exports.signMessage = signMessage;

function getRandomAlphanum() {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let byteArray;
    let parsedInt;

    // Keep generating new random bytes until we get a value that falls
    // within a range that can be evenly divided by possibleCharacters.length
    do {
        byteArray = crypto.getRandomValues(new Uint8Array(1));
        // extract the lowest byte to get an int from 0 to 255 (probably unnecessary, since we're only generating 1 byte)
        parsedInt = byteArray[0] & 0xff;
    } while (parsedInt >= 256 - (256 % possibleCharacters.length));

    // Take the modulo of the parsed integer to get a random number between 0 and totalLength - 1
    const randomIndex = parsedInt % possibleCharacters.length;

    return possibleCharacters[randomIndex];
}

/**
 * Generate a random string of a given length.
 *
 * @param {int} length
 * @returns {string}
 */
function generateRandomString(length) {
    let randomString = "";

    for (let i = 0; i < length; i++) {
        randomString += getRandomAlphanum();
    }

    return randomString;
}
exports.generateRandomString = generateRandomString;

  return exports;
})());
const codec = ((function(){
  const exports = {};
  /**
 * Initialize the codec with the provided cryptoEngine - this return functions to encode and decode messages.
 *
 * @param cryptoEngine - the engine to use for encryption / decryption
 */
function init(cryptoEngine) {
    const exports = {};

    /**
     * Top-level function for encoding a message.
     * Includes password hashing, encryption, and signing.
     *
     * @param {string} msg
     * @param {string} password
     * @param {string} salt
     *
     * @returns {string} The encoded text
     */
    async function encode(msg, password, salt) {
        const hashedPassword = await cryptoEngine.hashPassword(password, salt);

        const encrypted = await cryptoEngine.encrypt(msg, hashedPassword);

        // we use the hashed password in the HMAC because this is effectively what will be used a password (so we can store
        // it in localStorage safely, we don't use the clear text password)
        const hmac = await cryptoEngine.signMessage(hashedPassword, encrypted);

        return hmac + encrypted;
    }
    exports.encode = encode;

    /**
     * Encode using a password that has already been hashed. This is useful to encode multiple messages in a row, that way
     * we don't need to hash the password multiple times.
     *
     * @param {string} msg
     * @param {string} hashedPassword
     *
     * @returns {string} The encoded text
     */
    async function encodeWithHashedPassword(msg, hashedPassword) {
        const encrypted = await cryptoEngine.encrypt(msg, hashedPassword);

        // we use the hashed password in the HMAC because this is effectively what will be used a password (so we can store
        // it in localStorage safely, we don't use the clear text password)
        const hmac = await cryptoEngine.signMessage(hashedPassword, encrypted);

        return hmac + encrypted;
    }
    exports.encodeWithHashedPassword = encodeWithHashedPassword;

    /**
     * Top-level function for decoding a message.
     * Includes signature check and decryption.
     *
     * @param {string} signedMsg
     * @param {string} hashedPassword
     * @param {string} salt
     * @param {int} backwardCompatibleAttempt
     * @param {string} originalPassword
     *
     * @returns {Object} {success: true, decoded: string} | {success: false, message: string}
     */
    async function decode(signedMsg, hashedPassword, salt, backwardCompatibleAttempt = 0, originalPassword = "") {
        const encryptedHMAC = signedMsg.substring(0, 64);
        const encryptedMsg = signedMsg.substring(64);
        const decryptedHMAC = await cryptoEngine.signMessage(hashedPassword, encryptedMsg);

        if (decryptedHMAC !== encryptedHMAC) {
            // we have been raising the number of iterations in the hashing algorithm multiple times, so to support the old
            // remember-me/autodecrypt links we need to try bringing the old hashes up to speed.
            originalPassword = originalPassword || hashedPassword;
            if (backwardCompatibleAttempt === 0) {
                const updatedHashedPassword = await cryptoEngine.hashThirdRound(originalPassword, salt);

                return decode(signedMsg, updatedHashedPassword, salt, backwardCompatibleAttempt + 1, originalPassword);
            }
            if (backwardCompatibleAttempt === 1) {
                let updatedHashedPassword = await cryptoEngine.hashSecondRound(originalPassword, salt);
                updatedHashedPassword = await cryptoEngine.hashThirdRound(updatedHashedPassword, salt);

                return decode(signedMsg, updatedHashedPassword, salt, backwardCompatibleAttempt + 1, originalPassword);
            }

            return { success: false, message: "Signature mismatch" };
        }

        return {
            success: true,
            decoded: await cryptoEngine.decrypt(encryptedMsg, hashedPassword),
        };
    }
    exports.decode = decode;

    return exports;
}
exports.init = init;

  return exports;
})());
const decode = codec.init(cryptoEngine).decode;

/**
 * Initialize the staticrypt module, that exposes functions callbable by the password_template.
 *
 * @param {{
 *  staticryptEncryptedMsgUniqueVariableName: string,
 *  isRememberEnabled: boolean,
 *  rememberDurationInDays: number,
 *  staticryptSaltUniqueVariableName: string,
 * }} staticryptConfig - object of data that is stored on the password_template at encryption time.
 *
 * @param {{
 *  rememberExpirationKey: string,
 *  rememberPassphraseKey: string,
 *  replaceHtmlCallback: function,
 *  clearLocalStorageCallback: function,
 * }} templateConfig - object of data that can be configured by a custom password_template.
 */
function init(staticryptConfig, templateConfig) {
    const exports = {};

    /**
     * Decrypt our encrypted page, replace the whole HTML.
     *
     * @param {string} hashedPassword
     * @returns {Promise<boolean>}
     */
    async function decryptAndReplaceHtml(hashedPassword) {
        const { staticryptEncryptedMsgUniqueVariableName, staticryptSaltUniqueVariableName } = staticryptConfig;
        const { replaceHtmlCallback } = templateConfig;

        const result = await decode(
            staticryptEncryptedMsgUniqueVariableName,
            hashedPassword,
            staticryptSaltUniqueVariableName
        );
        if (!result.success) {
            return false;
        }
        const plainHTML = result.decoded;

        // if the user configured a callback call it, otherwise just replace the whole HTML
        if (typeof replaceHtmlCallback === "function") {
            replaceHtmlCallback(plainHTML);
        } else {
            document.write(plainHTML);
            document.close();
        }

        return true;
    }

    /**
     * Attempt to decrypt the page and replace the whole HTML.
     *
     * @param {string} password
     * @param {boolean} isRememberChecked
     *
     * @returns {Promise<{isSuccessful: boolean, hashedPassword?: string}>} - we return an object, so that if we want to
     *   expose more information in the future we can do it without breaking the password_template
     */
    async function handleDecryptionOfPage(password, isRememberChecked) {
        const { isRememberEnabled, rememberDurationInDays, staticryptSaltUniqueVariableName } = staticryptConfig;
        const { rememberExpirationKey, rememberPassphraseKey } = templateConfig;

        // decrypt and replace the whole page
        const hashedPassword = await cryptoEngine.hashPassword(password, staticryptSaltUniqueVariableName);

        const isDecryptionSuccessful = await decryptAndReplaceHtml(hashedPassword);

        if (!isDecryptionSuccessful) {
            return {
                isSuccessful: false,
                hashedPassword,
            };
        }

        // remember the hashedPassword and set its expiration if necessary
        if (èisRememberChecked) {
            window.localStorage.setItem(rememberPassphraseKey, hashedPassword);

            // set the expiration if the duration isn't 0 (meaning no expiration)
            if (rememberDurationInDays > 0) {
                window.localStorage.setItem(
                    rememberExpirationKey,
                    (new Date().getTime() + rememberDurationInDays * 24 * 60 * 60 * 1000).toString()
                );
            }
        }

        return {
            isSuccessful: true,
            hashedPassword,
        };
    }
    exports.handleDecryptionOfPage = handleDecryptionOfPage;

    /**
     * Clear localstorage from staticrypt related values
     */
    function clearLocalStorage() {
        const { clearLocalStorageCallback, rememberExpirationKey, rememberPassphraseKey } = templateConfig;

        if (typeof clearLocalStorageCallback === "function") {
            clearLocalStorageCallback();
        } else {
            localStorage.removeItem(rememberPassphraseKey);
            localStorage.removeItem(rememberExpirationKey);
        }
    }

    async function handleDecryptOnLoad() {
        let isSuccessful = await decryptOnLoadFromUrl();

        if (!isSuccessful) {
            isSuccessful = await decryptOnLoadFromRememberMe();
        }

        return { isSuccessful };
    }
    exports.handleDecryptOnLoad = handleDecryptOnLoad;

    /**
     * Clear storage if we are logging out
     *
     * @returns {boolean} - whether we logged out
     */
    function logoutIfNeeded() {
        const logoutKey = "staticrypt_logout";

        // handle logout through query param
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.has(logoutKey)) {
            clearLocalStorage();
            return true;
        }

        // handle logout through URL fragment
        const hash = window.location.hash.substring(1);
        if (hash.includes(logoutKey)) {
            clearLocalStorage();
            return true;
        }

        return false;
    }

    /**
     * To be called on load: check if we want to try to decrypt and replace the HTML with the decrypted content, and
     * try to do it if needed.
     *
     * @returns {Promise<boolean>} true if we derypted and replaced the whole page, false otherwise
     */
    async function decryptOnLoadFromRememberMe() {
        const { rememberDurationInDays } = staticryptConfig;
        const { rememberExpirationKey, rememberPassphraseKey } = templateConfig;

        // if we are login out, terminate
        if (logoutIfNeeded()) {
            return false;
        }

        // if there is expiration configured, check if we're not beyond the expiration
        if (rememberDurationInDays && rememberDurationInDays > 0) {
            const expiration = localStorage.getItem(rememberExpirationKey),
                isExpired = expiration && new Date().getTime() > parseInt(expiration);

            if (isExpired) {
                clearLocalStorage();
                return false;
            }
        }

        const hashedPassword = localStorage.getItem(rememberPassphraseKey);

        if (hashedPassword) {
            // try to decrypt
            const isDecryptionSuccessful = await decryptAndReplaceHtml(hashedPassword);

            // if the decryption is unsuccessful the password might be wrong - silently clear the saved data and let
            // the user fill the password form again
            if (!isDecryptionSuccessful) {
                clearLocalStorage();
                return false;
            }

            return true;
        }

        return false;
    }

    function decryptOnLoadFromUrl() {
        const passwordKey = "staticrypt_pwd";

        // get the password from the query param
        const queryParams = new URLSearchParams(window.location.search);
        const hashedPasswordQuery = queryParams.get(passwordKey);

        // get the password from the url fragment
        const hashRegexMatch = window.location.hash.substring(1).match(new RegExp(passwordKey + "=(.*)"));
        const hashedPasswordFragment = hashRegexMatch ? hashRegexMatch[1] : null;

        const hashedPassword = hashedPasswordFragment || hashedPasswordQuery;

        if (hashedPassword) {
            return decryptAndReplaceHtml(hashedPassword);
        }

        return false;
    }

    return exports;
}
exports.init = init;

  return exports;
})());
        ;
            const templateError = "template_error",
                isRememberEnabled = true,
                staticryptConfig = {"staticryptEncryptedMsgUniqueVariableName":"bac01ffbc1608169310e16dd45e1922113a845d50eb34c7896d5937baed27d2f369ebad52068903a9425f148adc60785204ecd42ee945578c9f7d07490b837ebc43e14b1753c359262d480631b3aea2e3173a6009fc971ffcbb685522d4e12fbecbd81b7839133453314780213396789511c67d1be78e4d606d6c490b409f4e8aa1dc372485e6feb136eb030ef57e93055f23e56f4a558012d59b1cb10b427dff4d243d295d9583a971304db476322bb8d2c0487ef46ab3c2a7901867e4d665aa7e39f79919f6b0e5b2af031eb0fde1906d73564167e395027ca08417a344398065fa80f1ed160f4beedea2c41c9c7eb143e09966dbf1bb3f09a6b0c976c93d9126ee76891666fec2351532d4566dd9bfddfb33acfe858d6c6263e6bae654a39c11432f25bc019956c5a234e360457e474314cf7bed99cacc25ca5e32acb82a6880d535c233862cd525cdca38fa4227e2c40dffc8aab32ae5f9c63c694bd50466586bac8c6c07226406dba04b7c52cb91391b820da41ea340808a588240368c42ebf9ccdde7932ae65bf45ed90b7ff3c1fdc0242c383c5f5cb13ff5f221819a879cb041631e0ebb3b5686bd2d3b0bcebfd6d3eca0bbaac0ccec36332ba532f9b75e37b9b18782761b8e68f8fcdae30afee2136179d9cb828d2a666fb21d06dfebfa0a13f630cce81691aa9fa738bed2908474e9e20752e72f59be6c4581cd1671be5906228cf34c1316a82c7b22ee26da334d3288dc87fc02ba1d9db0b86acb52f37b62ce2a9d273fa3fb1985e843c2eee26838daf58396fd5526237544d21730e3b8dab33c7244e63f4115b234d037238be3ce65373549fb539883cad679cbf32fdce48746bb1a366bdb0efa89a75e43b80489284803d992c5a84f7f9dc0eb6f6260232fe2cb2c7ccec9c86de31b36ee393068f186874bc3386191c3a9f841823105630bbf534fbdb5a8d00cdbbedc79569c44cf2336cf9545ae8bec810c2a045599ce86e197ff2c0e8bf66ed10e3cc1e1b89f40c13fcccde8ecf8794f22183f45cc35df7b04fd874d2ad5835901c3b7e9dab49f5c2d52fa7e91dc595746652c3393219131ad7e2bb4495d710a9db04a8a050dea1eb92f9edfc3241d5305d799d3d2ce79f86cbba9b1bb3635250fef535a6bb496c09e56f6e4184cc8224e06fcc36db9e17d1b8bc897f9328e83a1cd67da3cd411c297b889849b32de6289a16b86ca528fac72ebea328f1ce70efb8b11d50d9a95f184bba8bdb02b3f883e5c49f7ec6f27b4c19e221ce076e17057469a6344e2c4cfce26c44a71c7f2c25c78cfbafd444540f05055c6ec7366f4312d4a319cfce965e1ff6909a83016f74b297ba7cae1d1304477444a2f1beb6794ba4311710962907356096e7224a70e80434c7c7be2608cdb714db2450c14b7b0c16d4cc874aa201f142fb9d94ad83f81c67b0f0ab5086571059ccc72718a9d4f3cb1b4baed8fc9102489613f69e601a1f88b0a2a07ee606b76f327a395e453653a74f1bedb41b1400cbe87a5e39c1b2467627764475bac16e1eae8ebd4fb25ee1645d4750727400a402786d6aa7ec9130c444d739ac2371e2fbf992917daef94fe0fb14397df08a98b37b994875de25e92fd5a055fb43be11c8c2cb6ec770a2fca57f745e1a046502a8653cc4fcee2e35db536458e262224a104326feb91df142346e5eca05682fc6ae8caa2fbc4a8e607be570615285461aeac335c8f13365440675bd2831653d5ab29a2a4ed36a53fb647e6ab504dd97f68ddf538f8fb65923ada41b70547bfe6d58acb6b14a44e763f07449e001882636371bfad25af5e43c62928bc8dd648ab67e5eb08deacf06eac75283cf6b51a269ea2fb321ee5b596811570a31dd0086c931a152af0ddba98044003d9804eb35d956ab78737e5b9857fb93dc50e2b076dd5a33f8ac3ff01944ff2653a156326e8f3ca2b7f9c3b441fcad45bea6951a7ec32bcf9e9c82e8e33c32d24e70eb77c9a8f10ce55fff329e9cdda3a5289abc25c20aa146112c277319ebfded8e725bdb0bde1d9f81234c3b543e8f5735b71ced3c124fad963cdf37fd9f27d7d0fac5027ca9da67288aaeec9ec708e2ed2c7ebab0d56e6ee0379e42ee6d4f1be0ae30ea57407ceb1762d472da5f01939163d41ab87a5a41fc376d26a6674742b63739cb5c357489113a79b0d3e5ab3362d07202cfe153657c0aea99e1f337f397ab3f1dc804979153104ced5de650dceffc0ea56bb86ce3a67a8a99867e355f8b0fc97c44e620ab2ccdcce093736009064fff5fd4ebff58c3ae81af296738e103f9de3bddefe59a0e7bde203a0e7eaa590f8178a4275b8cbd6d4ef9c0896d209387fe10cf1f365b59dc0a479c5fd4ebb457926cdbfab2f1c1fb447a97902131a287498a053e8ffc158b1932bd848dc1a20666668164810d0bacc8d281caeefdea74c6486006a8095cd50171f91ffdf1c9cb6fd170f87be65e23625a846ee283eff8393538d160ff39bdbc955fa391625e22bcd4e5c682eb89cd5e66d6d8bad0e968ea864206e32cf0531e4973865570f4d8847efe0df408486bbec47860fcefb6972c23380c8bd1adf510cb85e0db85015108deb82647f19fd7b9dbcc096cda97878f218a35ccf5e6fe60b0b68931919e79d60d9d2f1eb3fbb0ac5bff4f20acfd7001e8e5d15c86f2769a5d1e475d94681ff5c6814ccb7db51c067dfdf98bfa347ba2ee615f9a96c91200a54138ce92ed82ce94789c46b8a03802a077d263cf4716630380d586fac5c9cfc98ef248470b5ac4981461b38276e92aad059b5579d6ae40f48a33680a2e6097c649c13ff2e1a4af9a73824067fac539fdb800828747f6d28cac78db62dc8473b85e7bf614ea312f11f09f1fe463c7ac064703c02223d28127363db75d76e7344065199e470829c2402127bd387df2e7a51266d1f76d48d731658e453759e10a1dd6d0ffdc525d59f9afa3bf04ec24f1e9c020c4fef99ebf4338048d5855a3deb1edfec559083faa0d8df91bec51290fcedc2b1d7c40a1f804af051102382f983384bde38d5ca57c7376f289705db3f40be7a05c10acf1806966c26e6609a700549ad38f382a2cf55a13e3757b0312d4a5e421118e94a4aecc38225cd0e66087bef841aa1b3356f21caa13ac2f677bd2ca6a65b0eeddd87bdc47b954b10e8405efbd92bd473da169fbdb8b1b59a2b7247a45a955f94fec564596323427fa3df169f5b03250d6b1e1d44234285f8df438974bf82bf38b31e0612fe166de1935910fb7fd8526759687a3952906a26e763560147a6ca463a00b907007791f5095796504e24f493bef87237b3f266db967aef449a573268aed65747623b8055df4520802336be6e5734712e74c89e8ccb859b001ad481aa4a2920cc09608cdb4ec92ad55f925040bb39b7b8c4ed6a00ef48bf1ee2348c840eaedbc7a8cd8cfa588d9a06a68b8beb2340b8c40795ab96d563e07c0d16b7f27b8edb60f181daa8bca3e7ef0fe787c17f137c5619145fa552232b58b3c0ab2f524f851438fca0d448e644ed39d2d96a5aa561c59cfa3f596f0a7c7f09f3a5bfc05beb4cae5c3e894b90e6f7f4744cab12af9ba57d60b02246c8d7856438f7d9c54fd2fcc45a6db9398474cf555e66337de1188e6f1820bb243e8fa4dec6ad910d777c774adc8f820bc812ef45d4dc103ae5da4492736750c07a4736c0e2902cd74abce1377c825860166fb0d8c607849d4c596319d1acc4d094d413629c2aadd30fa1a09db844565f57a884a0691f93426fc69159a2d2a8a9dbf80cff41a404210fc80fcdd62f8a83cc730c345bfb232457adede562b0b2e141dff6f3aad55b1de5dfc0ba6225f171815b716f0129d0e4a7ad616e0457c1b8b2ce15cbf5ed2fdf6bd08b5af362a74262545f76f1df346c8551c5c67bc265b8eb6269c4792ef2c2451435397d78ecede2b13ee6e8e4be6926a7408912199f90a4007e242d0c1cf406ea10cb698cce79a75e854494881a7539146f62ea4c670f2d42f22f2eac5614c857c32ef4f03349b89157ea20f12452f49c34773ed9baca36e0d8bed534aae6e00e971052608456b4048283bfea462af9f974a41a104c14e0cf0abbc07472e261eaa7a0073833afdebf0f36f881f551ed1801767c3c1415711e28a417da021569c854195089b5bc94a6dbcce90a7cd99c8f4312ec5f8f9092c45c72c5f65157ee37ff069f43905c41cf8e83e920b8c6ae566ca937d55eaf89ea1447693b26cbae2569c7299239079356666e4da2dfc0e2964f3b0b024254edbb977ca93d38ebc846f514b0ee55720aac550ad8d5f5ce22274a76178b850e30e4406c1d5f1a71aba8c253ee1e18a8430532a24abc7b5ec88a2c6264aca61f4df36d8d644979be371068c172f9898afde8f68a986354066020109b203735a460c2f63902cf723e7f5c314cbdad4da62b5ca5504e7684d59ef1aea7103fab073cce358a2b91039b7afad3d0196e7d8452600e69c0ea0f28f7f39f7212f9a73287b5314abc16d42a9cbb4ba0003ff1a43d4f4ceaea66aa4dfe04111deec9e6003816577ebc8ee4ba71eaeb8d7bc5911532e066732723ded079fe040ec9752a2769ad517cdd3df6128e177d26f1ecbfcfc4249c32dd3bede4bb31e901c49756d515fd9c94b444f6ecdb0381144016ae04c2acc18c17a7e9783dfc3097dd3faa4001e352a9237c65dc1bdb5eb3c34b0477ebf3a747bce202ebe572f2f88c797e8865d80ce3c5b5e180cc364399e06d6b6d11a9499fa22b9816dc9bd8e545359932be366a8f3ce2b3e4c3442e2b21d8257b558e06a9ba2934f61826c72fc053ab0358245900d3b0a3b8f1fb87083b2b7382fc9eb9e97410ebdc5b039c77dc4c7ff403a1fa6cea08a41cd496e7ec114b55eb9c2f5eb15","isRememberEnabled":true,"rememberDurationInDays":0,"staticryptSaltUniqueVariableName":"feef091ced54451f373e51ef26d9a75b"};

            // you can edit these values to customize some of the behavior of StatiCrypt
            const templateConfig = {
                rememberExpirationKey: "staticrypt_expiration",
                rememberPassphraseKey: "staticrypt_passphrase",
                replaceHtmlCallback: null,
                clearLocalStorageCallback: null,
            };

            // init the staticrypt engine
            const staticrypt = staticryptInitiator.init(staticryptConfig, templateConfig);

            // try to automatically decrypt on load if there is a saved password
            window.onload = async function () {
                const { isSuccessful } = await staticrypt.handleDecryptOnLoad();

                // if we didn't decrypt anything on load, show the password prompt. Otherwise the content has already been
                // replaced, no need to do anything
                if (!isSuccessful) {
                    // hide loading screen
                    document.getElementById("staticrypt_loading").classList.add("hidden");
                    document.getElementById("staticrypt_content").classList.remove("hidden");
                    document.getElementById("staticrypt-password").focus();

                    // show the remember me checkbox
                    if (false) {
                        document.getElementById("staticrypt-remember-label").classList.remove("hidden");
                    }
                }
            };

            // handle password form submission
            document.getElementById("staticrypt-form").addEventListener("submit", async function (e) {
                e.preventDefault();

                const password = document.getElementById("staticrypt-password").value,
                    isRememberChecked = document.getElementById("staticrypt-remember").checked;

                const { isSuccessful } = await staticrypt.handleDecryptionOfPage(password, false);

                if (!isSuccessful) {
                    document.getElementById("txt").innerHTML = "Incorrect password";
                }
            });