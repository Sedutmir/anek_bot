const c_start = ctx => {
    ctx.reply(`Привет! Я бот, который имеет довольно крупную базу анекдотов.
Для получения информации о том, что я умею, напиши /help`);
};

const f_check_admin = id_user => {
    return global.admins.includes(id_user)
}

const d_check_admin = fn => {
    return ctx => {
        const id_user = 11;
        if (f_check_admin(id_user)) {
            fn(ctx);
        } else {
            ctx.reply("Вы не админ! Вам нельзя использовать эту команду.");
        }
    }

}

// TODO: добавить расширенный хелп для админов.
const c_help = ctx => {
    const help_string =
        `\
Мои команды:
    
/help - список команд.
/joke - получить случайный анекдот.
/report [text] - (в ответ на анекдот) отправить жалобу на анекдот с опциональным поясняющим текстом. [Пока не работает]
/edit [new joke text] - (в ответ на анекдот) предложить исправление. В исправлении вводить полный текст анекдота. [Пока не работает]
/offer [new joke] - предложить новый анекдот. [Пока не работает]
/joke_id - (в ответ на анекдот) узнать внутренний ID анекдота для обращения.
        `;
    ctx.reply(help_string);
};

const c_joke = ctx => {
    ctx.reply(global.jokes.get_random());
};

const c_report = ctx => {
    if (!ctx.message.reply_to_message) {
        ctx.reply("Чтобы отослать жалобу на анекдот, надо написать команду в ответ на сообщение с анекдотом.");
        return;
    }

    if (ctx.message.reply_to_message.from.username !== process.env.USERNAME) {
        ctx.reply("Это не мой анекдот!");
        return;
    }

    const date = ctx.message.date;
    const joke_text = ctx.message.reply_to_message.text;
    const text_report = ctx.message.text.replace("/report", "").trim();

    const joke = global.jokes.search_joke(joke_text);

    if (!joke) {
        ctx.reply("Внуренняя ошибка: анекдот не обнаружен в базе данных!");
        return;
    }

    joke.reports.push(
        {
            type: 'report',
            is_open: true,
            date,
            text: text_report
        }
    );

    ctx.reply("Принято на рассмотрение!");
};

const c_edit = ctx => {
    if (!ctx.message.reply_to_message) {
        ctx.reply("Чтобы отослать предложение на исправление анекдота, надо написать команду в ответ на сообщение с анекдотом.");
        return;
    }

    if (ctx.message.reply_to_message.from.username !== process.env.USERNAME) {
        ctx.reply("Это не мой анекдот!");
        return;
    }

    const date = ctx.message.date;
    const joke_text = ctx.message.reply_to_message.text;
    const text_report = ctx.message.text.replace("/edit", "").trim();

    const joke = global.jokes.search_joke(joke_text);

    if (!joke) {
        ctx.reply("Внуренняя ошибка: анекдот не обнаружен в базе данных!");
        return;
    }

    joke.reports.push(
        {
            type: 'edit',
            is_open: true,
            date,
            text: text_report
        }
    );

    ctx.reply("Принято на рассмотрение!");
};

const c_joke_id = ctx => {
    if (!ctx.message.reply_to_message) {
        ctx.reply("Чтобы узнать внутренний ID анекдота, надо написать команду в ответ на сообщение с анекдотом.");
        return;
    }

    if (ctx.message.reply_to_message.from.username !== process.env.USERNAME) {
        ctx.reply("Это не мой анекдот!");
        return;
    }

    const joke_text = ctx.message.reply_to_message.text;
    const joke = global.jokes.search_joke(joke_text);

    if (!joke) {
        ctx.reply("Внуренняя ошибка: анекдот не обнаружен в базе данных!");
        return;
    }

    ctx.reply(`ID: ${joke.id}`);
};

// TODO
const c_offer = ctx => {};

// TODO
const c_clear_closed_reports = d_check_admin(ctx => {

});

// TODO
const c_get_report = d_check_admin(ctx => {

});

// TODO
const add_admin = d_check_admin(ctx => {

});

module.exports = {
    commands: {c_start, c_help, c_joke, c_report, c_edit, c_joke_id},
    utils: {f_check_admin}
};