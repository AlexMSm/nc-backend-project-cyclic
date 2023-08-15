process.stdin.resume();
process.stdin.setEncoding("utf8");

let stdin = ```mieux vaut prévenir que guérir
merci|thank you
que|than
malade|sick
mieux|better
guérir|to heal
chien|dog
vaut prévenir|to prevent
beurre|butter
s'il vous plaît|please```;

process.stdin
  .on("data", (chunk) => {
    stdin = `${stdin}${chunk}`;
  })
  .on("end", () => {
    const lines = stdin.trim().split("\n");
    console.log("message", lines[0]);
    const message = lines[0];
    const rosetta = {};

    for (let i = 1; i < lines.length; i++) {
      let line = lines[i].split("|");
      rosetta[line[0]] = line[1];
      //process.stdout.write(`${line}\n`);
    }
    let decodedMessage = "";
    for (let i = 0; i < lines.length; i++) {
      console.log(i, lines.length);
      if (message[i] === " ") {
        decodedMessage += " ";
        console.log("dm", decodedMessage);
        continue;
      }
      let found = false;
      for (let j = message.length - i; j > 0; j--) {
        if (rosetta[message.slice(i, i + j)]) {
          decodedMessage += rosetta[chunk];
          i += j;
          found = true;
          break;
        }
      }
      if (!found) {
        i++;
      }
    }
    console.log(decodedMessage.length);
    process.stdout.write(decodedMessage);
  });
