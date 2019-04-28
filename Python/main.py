import sys

class FMC(object):
    MorseCode = { "!": "-.-.--", '"': ".-..-.", "'": ".----.", "(": "-.--.",
        ")": "-.--.-", ",": "--..--", "-": "-....-", ".": ".-.-.-",
        "0": "-----", "1": ".----", "2": "..---", "3": "...--",
        "4": "....-", "5": ".....", "6": "-....", "7": "--...",
        "8": "---..", "9": "----.", ":": "---...", ";": "-.-.-.",
        "=": "-...-", "?": "..--..", "@": ".--.-.", "A": ".-",
        "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
        "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-",
        "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.",
        "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", 
        "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--.." }
    CipherSequence = '.....-..x.-..--.-x.x..x-.xx-..-.--.x--.-----x-x.-x--xxx..x.-x.xx-.x--x-xxx.xx-'

    def toMorse(self, src: str) -> str:
        result = ""
        preced_by_letter = False
        preced_by_space = False

        for letter in src.upper():
            if letter in self.MorseCode:
                if preced_by_letter:
                    result += "x"
                elif preced_by_space:
                    result += "xx"
                result += self.MorseCode[letter]
                preced_by_letter = True
                preced_by_space = False
            elif letter == ' ':
                preced_by_space = True
                preced_by_letter = False

        if len(result) != 0:
            result += "xx"
        return result

    def createKey(self, keyphrase: str = "") -> str:
        upper_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        result = ""
        for letter in keyphrase.upper():
            if letter in upper_letters and letter not in result:
                result += letter
        
        for letter in upper_letters:
            if letter not in result:
                result += letter
        
        assert len(result) == 26
        return result

    def morseToKey(self, mcmsg: str, key: str) -> str:
        assert len(key) == 26
        if len(mcmsg) >= 3:
            care_about = mcmsg[0:3]
            for index in range(len(self.CipherSequence)//3):
                if care_about == self.CipherSequence[index*3:index*3+3]:
                    return key[index]
        return ''
    
    def FMCEncrypt(self, src: str, keyphrase: str = "") -> str:
        mcmsg = self.toMorse(src)
        key = self.createKey(keyphrase)

        encrypted = ""
        counter = 0
        while True:
            val = self.morseToKey(mcmsg[counter * 3:], key)
            counter += 1
            if val != '': encrypted += val
            else: break
        return encrypted
    
    def fromMorse(self, mcmsg: str) -> str:
        result = ""
        token = ""
        dlim_counter = 0

        for i in range(len(mcmsg)):
            if mcmsg[i] == 'x':
                dlim_counter += 1
                if token != "":
                    for k in self.MorseCode:
                        if self.MorseCode[k] == token:
                            result += k
                    token = ""
                if dlim_counter == 2 and i != len(mcmsg) - 1:
                    result += " "
                    dlim_counter = 0
            else:
                dlim_counter = 0
                token += mcmsg[i]

        return result
    
    def keyToMorse(self, kmsg: str, key: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
        result = ""
        for letter in kmsg:
            try:
                index = key.index(letter)
                result += self.CipherSequence[index * 3 : index * 3 + 3]
            except:
                pass

        if result[-2:] != 'xx':
            if result[-1] != 'x':
                result += 'xx'
            else:
                result += 'x'
        return result

    def FMCDecrypt(self, emsg: str, keyphrase: str = "") -> str:
        mcmsg = self.keyToMorse(emsg, self.createKey(keyphrase))
        msg = self.fromMorse(mcmsg)
        return msg

f = FMC()
for k in f.MorseCode:
    print("MorseCode.set('{}', '{}');".format(k, f.MorseCode[k]))

# if __name__ == '__main__':

#     keyphrase = ""
#     assert len(sys.argv) in [2, 4]
#     if len(sys.argv) == 2:
#         assert sys.argv[1] in ['-e', '-d'], "Usage: python3 main.py [-k keyphrase] -e|-d"
#         mode = sys.argv[1]
#     else:
#         assert sys.argv[1] == '-k', "Usage: python3 main.py [-k keyphrase] -e|-d"
#         assert sys.argv[3] in ['-e', '-d'], "Usage: python3 main.py [-k keyphrase] -e|-d"
#         keyphrase = sys.argv[2]
#         mode = sys.argv[3]
    
#     msg = ''
#     while True:
#         char = sys.stdin.read(1)
#         if not char:
#             break
#         else:
#             msg += char

#     f = FMC()
#     if mode == '-e':
#         # encryption
#         r = f.FMCEncrypt(msg, keyphrase)
#     else:
#         # decryption
#         r = f.FMCDecrypt(msg, keyphrase)
    
#     print(r)