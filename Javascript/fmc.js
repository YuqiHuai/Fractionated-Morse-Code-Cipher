function createKey(keyphrase) {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = "";
    keyphrase = keyphrase.toUpperCase();

    for(var i = 0; i < keyphrase.length; ++i) {
        if(letters.indexOf(keyphrase[i]) != -1 && result.indexOf(keyphrase[i]) == -1) {
            result = result.concat(keyphrase[i]);
        }
    }
    for(var i = 0; i < letters.length; ++i) {
        if(result.indexOf(letters[i]) == -1) {
            result = result.concat(letters[i]);
        }
    }
    return result;
}

function getMap() {
    var MorseCode = new Map();
    MorseCode.set('!', '-.-.--'); MorseCode.set('"', '.-..-.');
    MorseCode.set("'", '.----.'); MorseCode.set('(', '-.--.');
    MorseCode.set(')', '-.--.-'); MorseCode.set(',', '--..--');
    MorseCode.set('-', '-....-'); MorseCode.set('.', '.-.-.-');
    MorseCode.set('0', '-----'); MorseCode.set('1', '.----');
    MorseCode.set('2', '..---'); MorseCode.set('3', '...--');
    MorseCode.set('4', '....-'); MorseCode.set('5', '.....');
    MorseCode.set('6', '-....'); MorseCode.set('7', '--...');
    MorseCode.set('8', '---..'); MorseCode.set('9', '----.');
    MorseCode.set(':', '---...'); MorseCode.set(';', '-.-.-.');
    MorseCode.set('=', '-...-'); MorseCode.set('?', '..--..');
    MorseCode.set('@', '.--.-.'); MorseCode.set('A', '.-');
    MorseCode.set('B', '-...'); MorseCode.set('C', '-.-.');
    MorseCode.set('D', '-..'); MorseCode.set('E', '.');
    MorseCode.set('F', '..-.'); MorseCode.set('G', '--.');
    MorseCode.set('H', '....'); MorseCode.set('I', '..');
    MorseCode.set('J', '.---'); MorseCode.set('K', '-.-');
    MorseCode.set('L', '.-..'); MorseCode.set('M', '--');
    MorseCode.set('N', '-.'); MorseCode.set('O', '---');
    MorseCode.set('P', '.--.'); MorseCode.set('Q', '--.-');
    MorseCode.set('R', '.-.'); MorseCode.set('S', '...');
    MorseCode.set('T', '-'); MorseCode.set('U', '..-');
    MorseCode.set('V', '...-'); MorseCode.set('W', '.--');
    MorseCode.set('X', '-..-'); MorseCode.set('Y', '-.--');
    MorseCode.set('Z', '--..');
    return MorseCode;
}

function toMorse(msg) {
    var MorseCode = getMap();

    msg = msg.toUpperCase();
    var dlm_counter = 0;
    var preced_space = false;
    var preced_char = false;
    var result = "";
    for(var i = 0; i < msg.length; ++i) {
        if(msg[i] != ' ' && MorseCode.get(msg[i]) != undefined) {
            if(preced_space == true) {
                result = result.concat("xx");
            } else if (preced_char == true) {
                result = result.concat("x");
            }
            result = result.concat(MorseCode.get(msg[i]));
            preced_char = true;
            preced_space = false;
        } else if (msg[i] == ' ') {
            preced_space = true;
            preced_char = false;
        } else {
            // do nothing
        }
    }
    if(result.length != 0) {
        result = result.concat("xx");
    }
    return result;
}

function morseToKey(mcmsg, key) {
    const mcsqs = '.....-..x.-..--.-x.x..x-.xx-..-.--.x--.-----x-x.-x--xxx..x.-x.xx-.x--x-xxx.xx-';
    if(key.length != 26) {
        return '';
    } else if (mcmsg.length < 3) {
        return '';
    }
    const sbsqs = mcmsg.substring(0, 3);
    for(var i = 0; i < 26; ++i) {
        const match = mcsqs.substring(i * 3, i * 3 + 3);
        if(sbsqs === match) {
            return key[i];
        }
    }
    return '';
}

function encrypt() {
    const msg = document.getElementById('msg').value;
    const keyphrase = document.getElementById('keyphrase').value;
    const mcmsg = toMorse(msg);
    const key = createKey(keyphrase);
    var result = '';
    var index = 0;
    while(true) {
        var val = morseToKey(mcmsg.substring(index*3, index*3+3), key);
        if(val === '') {
            break;
        }
        ++index;
        result = result.concat(val);
    }
    document.getElementById('emsg').value = result;
}

function fromMorse(mcmsg) {
    const MorseCode = getMap();
    var result = ""
    var token = ""
    var dlim_counter = 0;
    for(var i = 0; i < mcmsg.length; ++i) {
        if(mcmsg[i] == 'x') {
            dlim_counter += 1;
            if(token != "") {
                for(let [k, v] of MorseCode) {
                    if(token === v) {
                        result = result.concat(k);
                        break;
                    }
                }
                token = "";
            }
            if(dlim_counter == 2 && i != mcmsg.length - 1) {
                result = result.concat(" ");
                dlim_counter = 0;
            }
        } else {
            dlim_counter = 0;
            token = token.concat(mcmsg[i]);
        }
    }
    return result;
}

function keyToMorse(emsg, key) {
    const mcsqs = '.....-..x.-..--.-x.x..x-.xx-..-.--.x--.-----x-x.-x--xxx..x.-x.xx-.x--x-xxx.xx-';
    var result = "";
    for(var i = 0; i < emsg.length; ++i) {
        var index = key.indexOf(emsg[i])
        if(index != -1) {
            result = result.concat(mcsqs.substring(index*3, index*3+3));
        }
    }
    if (result.substring(result.length - 2) != "xx") {
        if (result.substring(result.length - 1) != "x") {
            result = result.concat("xx");
        } else {
            result = result.concat("x");
        }
    }
    return result;
}

function decrypt() {
    const emsg = document.getElementById('emsg').value;
    const keyphrase = document.getElementById('keyphrase').value;
    const key = createKey(keyphrase);
    const mcmsg = keyToMorse(emsg, key);
    const msg = fromMorse(mcmsg);
    document.getElementById('msg').value = msg;
}

function validate() {
    return false;
}