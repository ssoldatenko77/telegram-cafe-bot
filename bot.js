// require('dotenv').config();

// const TelegramBot = require('node-telegram-bot-api');

// // Вставь сюда свой токен
// // const token = '7854715812:AAE5drdxPJLd130ZYiViQCWMZtPmLsiuqwc';
// const token = process.env.BOT_TOKEN;
// // Создаём бота
// const bot = new TelegramBot(token, { polling: true });

// const menu = `
// 🍽 Меню:
// ☕ Кофе:
// - Американо — 3 BYN
// - Капучино — 4 BYN

// 🍰 Десерты:
// - Чизкейк — 5 BYN
// - Эклер — 3 BYN

// 🥪 Закуски:
// - Бургер — 7 BYN
// - Сендвич — 4 BYN
// `;
// // bot.deleteWebhook()ы
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "👋 Добро пожаловать в Кафе «Летний Ветерок»!\nВыберите опцию:", {
//     reply_markup: {
//       keyboard: [
//         ['🍽 Меню', '🛍 Заказ'],
//         ['📞 Контакты', '📍 Адрес']
//       ],
//       resize_keyboard: true
//     }
//   });
// });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const text = msg.text;

//   if (text === '🍽 Меню') {
//     bot.sendMessage(chatId, menu);
//   } else if (text === '🛍 Заказ') {
//     bot.sendMessage(chatId, 'Напишите, что вы хотите заказать:');
//   } else if (text === '📞 Контакты') {
//     bot.sendMessage(chatId, '📞 +375 29 123-45-67\nInstagram: @kafe_letniy');
//   } else if (text === '📍 Адрес') {
//     bot.sendMessage(chatId, '📍 Гродно, ул. Советская, 10');
//   } else if (text !== '/start') {
//     // Заказ
//     bot.sendMessage(chatId, `Ваш заказ: ${text}\nСпасибо! Мы свяжемся с вами для подтверждения.`);
//   }
// });

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// 💬 Вставь свой токен в .env (BOT_TOKEN=...)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// 👤 Твой Telegram ID для приёма заказов
const ADMIN_CHAT_ID = '1179244332'; // замени на свой ID

const users = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users[chatId] = {}; // новый заказ

  bot.sendMessage(chatId, "👋 Добро пожаловать в Кафе «Летний Ветерок»!\nВыберите блюдо:", {
    reply_markup: {
      keyboard: [
        ['🥗 Салат Цезарь', '🍕 Пицца Маргарита'],
        ['🍝 Паста Карбонара', '☕ Капучино']
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Пропускаем системные сообщения
  if (!users[chatId]) return;

  if (!users[chatId].item && text !== '/start') {
    users[chatId].item = text;
    bot.sendMessage(chatId, "📛 Введите ваше имя:");
    return;
  }

  if (users[chatId].item && !users[chatId].name) {
    users[chatId].name = text;
    bot.sendMessage(chatId, "📞 Введите номер телефона:");
    return;
  }

  if (users[chatId].item && users[chatId].name && !users[chatId].phone) {
    users[chatId].phone = text;

    const order = `🛒 Новый заказ!\n🍽 Блюдо: ${users[chatId].item}\n👤 Имя: ${users[chatId].name}\n📞 Телефон: ${users[chatId].phone}`;
    
    bot.sendMessage(ADMIN_CHAT_ID, order); // отправка админу
    bot.sendMessage(chatId, "✅ Спасибо! Ваш заказ принят. Мы скоро свяжемся!");

    delete users[chatId]; // очищаем данные
  }
});