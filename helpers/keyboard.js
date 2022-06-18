const { Keyboard, Key } = require('telegram-keyboard')

const main_keyboard = Keyboard.make([
    '👤 Личный кабинет',
    '🔖 Афиша мероприятий',
    '🗒 Меню клуба',
    '💼 Корпоративы',
    '💳 Женские карточки',
    '📸 Фотки с вечеринок',
    '📱 Связь с клубом',
    '🔍 Потерянные вещи'
], {
    pattern: [1, 1, 2, 2, 2],
}).reply();

const cancel_keyboard = Keyboard.make(['↩️ Вернутся в главное меню']).reply();
const back_keyboard = Keyboard.make([Key.callback('🔙 Назад', 'back')]).inline();

const profile_keyboard = Keyboard.make([
    Key.callback('💰 Пополнить счет', 'addbalance'),
    Key.callback('📲 QR-код', 'qr_code')
], { columns: 1 }).inline();

const menu_keyboard = Keyboard.make([
    Key.callback('🔪 Кухня', 'menu 1'),
    Key.callback('🍸 Паровые коктейли', 'menu 2'),
    Key.callback('🥃 Бар', 'menu 3')
], { columns: 1 }).inline();

const girl_keyboard = Keyboard.make([
    Key.callback('📝 Заполнить анкету', 'formGirl'),
    Key.callback('🔙 Назад', 'deleteMessage')
], { columns: 1 }).inline();

const corporation_keyboard = Keyboard.make([
    Key.callback('👋 Welcome home', 'corporation 1 0'),
    Key.callback('🥃 Bar home', 'corporation 2 0'),
    Key.callback('🍸 Coctail home', 'corporation 3 0'),
], { columns: 1 }).inline();

const askSupport_keyboard = Keyboard.make(['📞 Написать менеджеру', '↩️ Вернутся в главное меню'], { columns: 1 }).reply();

const item_lost_keyboard = Keyboard.make([
    Key.callback('🔍 Я потерял вещь', 'lost_item')
]).inline();

const closeRequest_keyboard = Keyboard.make([
    Key.callback('Отменить созданную заявку', 'close_my_request')
]).inline();

const ask_keyboard = Keyboard.make([
    Key.callback('✏️ Написать комментарий', 'ask'),
    Key.callback('🔙 Назад', 'close_info')
], { columns: 1 }).inline();


const admin_keyboard = Keyboard.make([
    Key.callback('Афиша мероприятий', 'edit_mp'),
    Key.callback('Меню клуба', 'edit_menu'),
    Key.callback('Корпоративы', 'edit_corporation'),
    Key.callback('Женские карточки', 'edit_girlCards'),
    Key.callback('Фотки с вечеринок', 'edit_photos')
], { columns: 1}).inline();

const admin_mp_keyboard = Keyboard.make([
    Key.callback('Добавить мероприятие', 'add_mp'),
    Key.callback('Остановить мероприятие', 'stop_mp')
], { columns: 1 }).inline();

const admin_menu_keyboard = Keyboard.make([
    Key.callback('🔪 Кухня', 'menu_change 1'),
    Key.callback('🍸 Паровые коктейли', 'menu_change 2'),
    Key.callback('🥃 Бар', 'menu_change 3')
], { columns: 1 }).inline();

const admin_corporation_keyboard = Keyboard.make([
    Key.callback('👋 Welcome home', 'corporation_change 1'),
    Key.callback('🥃 Bar home', 'corporation_change 2'),
    Key.callback('🍸 Coctail home', 'corporation_change 3'),
], { columns: 1 }).inline();

const admin_girlCards_keyboard = Keyboard.make([
    Key.callback('Список владельцев', 'list_girlCards')
], { columns: 1 }).inline();

const admin_photos_keyboard = Keyboard.make([
    Key.callback('Добавить фото', 'add_photo'),
    Key.callback('Скрыть фото', 'stop_photo')
], { columns: 1 }).inline();

module.exports = {
    back_keyboard,
    cancel_keyboard,
    main_keyboard,
    profile_keyboard,
    menu_keyboard,
    girl_keyboard,
    corporation_keyboard,
    askSupport_keyboard,
    item_lost_keyboard,
    closeRequest_keyboard,
    ask_keyboard,
    admin_keyboard,
    admin_mp_keyboard,
    admin_menu_keyboard,
    admin_photos_keyboard,
    admin_girlCards_keyboard,
    admin_corporation_keyboard
}