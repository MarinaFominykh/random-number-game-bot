const TelegramApi = require("node-telegram-bot-api");
const token = "5718482071:AAGidoVQ-q6tacWhGi8emRe4tjqOPyIzNCQ";
const { gameOptions, againOptions } = require("./options");
const chats = {};

const bot = new TelegramApi(token, { polling: true });
bot.setMyCommands([
  {
    command: "start",
    description: "Start the bot",
  },
  { command: "info", description: "Get info about user" },
  { command: "game", description: "Игра 'Угадай число!'" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Я загадаю число от 0 до 9, а ты должен его угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const {
      text,
      chat: { id: chatId },
    } = msg;
    if (text === "/start") {
      // bot.sendSticker(chatId, "")
      return bot.sendMessage(chatId, "Hello, I'm a bot!");
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "This command not find");
  });
  bot.on("callback_query", async (msg) => {
    const {
      data,
      message: {
        chat: { id: chatId },
      },
    } = msg;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (Number(data) === Number(chats[chatId])) {
      return bot.sendMessage(
        chatId,
        `Ты угадал! Я загадал число ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ты не угадал. Я загадал число ${chats[chatId]}`,
        againOptions
      );
    }
    //bot.sendMessage(chatId, `Ты выбрал число ${data}`);
  });
};

start();
