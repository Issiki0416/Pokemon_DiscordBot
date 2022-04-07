"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});
const Pokemon_1 = require("./Pokemon");
client.once("ready", () => {
    console.log("Ready!");
    if (client.user) {
    }
});
client.on("messageCreate", async (msg) => {
    if (msg.author.bot)
        return;
    if (msg.content.startsWith("!ping")) {
        msg.channel.send("Pong!");
    }
    else if (msg.content.startsWith("!")) {
        let req_pokemonName = msg.content.slice(1);
        let found_pokemon = Pokemon_1.pokemon.choosePokemon(req_pokemonName);
        found_pokemon.forEach((data) => {
            let fields = [
                {
                    name: "HP",
                    value: `${data.stats.hp}`,
                    inline: true,
                },
                {
                    name: "攻撃",
                    value: `${data.stats.attack}`,
                    inline: true,
                },
                {
                    name: "防御",
                    value: `${data.stats.defence}`,
                    inline: true,
                },
                {
                    name: "特攻",
                    value: `${data.stats.spAttack}`,
                    inline: true,
                },
                {
                    name: "特防",
                    value: `${data.stats.spDefence}`,
                    inline: true,
                },
                {
                    name: "すばやさ",
                    value: `${data.stats.speed}`,
                    inline: true,
                },
            ];
            if (data.form != "") {
                fields.unshift({
                    name: "フォルム",
                    value: data.form,
                    inline: false,
                });
            }
            let sideColor = Pokemon_1.pokemon.setSideColor(data.types[0]);
            let thumbnailUrl;
            let thumbnailUrlRandom = Pokemon_1.pokemon.getRandomArbitrary(0, 4096);
            if (thumbnailUrlRandom == 1000) {
                thumbnailUrl = `https://www.serebii.net/Shiny/SM/${data.no < 10 ? "00" : data.no < 100 ? "0" : ""}${data.no}.png`;
            }
            else {
                thumbnailUrl = `https://www.serebii.net/sunmoon/pokemon/${data.no < 10 ? "00" : data.no < 100 ? "0" : ""}${data.no}.png`;
            }
            thumbnailUrl = Pokemon_1.pokemon.getMegaEvolution(data, thumbnailUrl);
            let exampleEmbed = new discord_js_1.MessageEmbed()
                .setTitle(data.name)
                .setURL(`https://www.serebii.net/pokedex-sm/${data.no}.shtml`)
                .setColor(sideColor)
                .setDescription(`${data.name}は「${data.types}」タイプです。\nこのポケモンのより詳細なデータはこちら` +
                `https://yakkun.com/sm/zukan/n${data.no}`)
                .setThumbnail(thumbnailUrl)
                .addFields(fields)
                .setTimestamp()
                .setFooter("Powered by Serebii", "https://www.serebii.net/pokedex-sm/th/001.png");
            msg.channel.send({
                embeds: [exampleEmbed],
            });
        });
    }
});
client.login();
//# sourceMappingURL=index.js.map