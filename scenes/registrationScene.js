const { BaseScene } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard');

const registration_scene = new BaseScene('registration_scene');
registration_scene.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_1"));
});

registration_scene.on('text', async (ctx) => {
	ctx.session.first_name = ctx.message.text;
	return ctx.scene.enter("registration_scene_2")
});


const registration_scene_2 = new BaseScene('registration_scene_2');
registration_scene_2.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_2"));
});

registration_scene_2.on('text', async (ctx) => {
	ctx.session.last_name = ctx.message.text;
	return ctx.scene.enter("registration_scene_3")
});


const registration_scene_3 = new BaseScene('registration_scene_3');
registration_scene_3.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_3"));
});

registration_scene_3.on('text', async (ctx) => {
	ctx.session.birthday = ctx.message.text;
	return ctx.scene.enter("registration_scene_4")
});

const registration_scene_4 = new BaseScene('registration_scene_4');
registration_scene_4.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_4"));
});

registration_scene_4.on('text', async (ctx) => {
	ctx.session.phoneNumber = ctx.message.text;
	return ctx.scene.enter("registration_scene_5")
});

const registration_scene_5 = new BaseScene('registration_scene_5');
registration_scene_5.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_5"));
});

registration_scene_5.on('photo', async (ctx) => {
	ctx.session.photo = ctx.message.photo[0].file_id;
	return ctx.scene.leave();
});


module.exports = {
	registration_scene,
	registration_scene_2,
	registration_scene_3,
	registration_scene_4,
	registration_scene_5
}