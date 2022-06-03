const { Keyboard, Key } = require('telegram-keyboard')

const main_keyboard = Keyboard.make([
    '👤 Личный кабинет',
    '🔖Афиша мероприятий',
    '🗒 Меню клуба',
    '💼 Корпоративы',
    '💳 Женские карточки',
    '📸 Фотки с вечеринок',
    '📱 Связь с клубом',
    '🔍Потерянные вещи'
], {
    pattern: [1, 1, 2, 2, 2],
}).reply();

const back_keyboard = Keyboard.make(['🔙 Назад']).reply();

const profile_keyboard = Keyboard.make([
    Key.callback('💰 Пополнить счет', 'addbalance'),
    Key.callback('📲 QR-код', 'qr_code')
], { columns: 1 }).inline();

module.exports = {
    back_keyboard,
    main_keyboard,
    profile_keyboard
}