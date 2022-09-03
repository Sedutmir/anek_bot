function random_int(max) {
    return Math.floor(Math.random() * max);
}

/*
    Jokes format:

    {
        %categoty%: [
            {
                id: ID,
                text: STRING,
                rate: { like: UINT, dislike: UINT },
                reports: [
                    {
                        type: "report",
                        date: DATETIME,
                        is_open: BOOLEAN,
                        text: STRING,
                    },
                    {
                        type: "edit",
                        date: DATETIME,
                        is_open: BOOLEAN,
                        text: STRING,
                    }
                ]
            }
        ]
    }
*/

class Jokes {
    constructor() {
        this.jokes = {};
        this.categories = [];
    }

    // WARNING: No validate scheme.
    init_with_JSON(path) {
        const fs = require("fs");

        try {
            const raw_data = fs.readFileSync(path).toString();
            const jokes = JSON.parse(raw_data);
            this.jokes = jokes;
            return true;
        } catch (err) {
            console.error("No init jokes!", err);
            return false;
        }
    }

    save_in_JSON(path, rewrite = true) {
        const fs = require("fs");

        if (!rewrite) {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, JSON.stringify(this.jokes));
            }
        } else {
            fs.writeFileSync(path, JSON.stringify(this.jokes));
        }
    }

    // Random joke
    get_random(category = null) {
        if (category) {
            if (this.categories.includes(category)) {
                const selection = this.jokes[category];
                return selection[random_int(selection.length)];
            } else {
                return false;
            }
        } else {
            const category = this.categories[random_int(this.categories.length)];
            return this.get_random(category);
        }
    }

    search_joke(joke_text) {
        for (const category of this.categories) {
            for (const joke of this.jokes[category]) {
                if (joke.text === joke_text) {
                    return joke;
                }
            }
        }
        return false;
    }

    get_open_reports() {
        const reports = [];
        for (const category of this.categories) {
            for (const joke of this.jokes[category]) {
                for (const report of joke.reports.filter(r => r.status)) {
                    report.push( { joke: joke, report: report } );
                }
            }
        }
        return reports;
    }

    clear_closed_reports() {
        for (const category of this.categories) {
            for (const joke of this.jokes[category]) {
                joke.reports = joke.reports.filter(r => r.status);
            }
        }
    }
}

module.exports = Jokes;