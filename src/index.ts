import { Message, Client, MessageEmbed } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  //権限周りはAdministratorをオンにするか
  //「ボット」のところからなんかでてくる３つをオンにする
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
});

import { pokemon } from "./Pokemon";
client.once("ready", () => {
  console.log("Ready!");
  // console.log(client.user!.tag);//client.user!オブジェクトがあることが前提でなにかしなさい（よくない）
  // console.log(client.user?.tag);//client.user?ないならやんないであるならやって
  if (client.user) {
    //client.user(ボットの情報)
    console.log(client.user.tag);
  }
  // console.log(client.user.tag);
});
/**
 * クライアント.が(イベント 'messageCreate' を受信したら, それを msg とする => {
  もし (発言内容(msg.content) が '!ping' なら) {
  発言があったチャンネル(msg.channel).に発言する('Pong!')
  }
}) 
 */
client.on("messageCreate", async (msg: Message) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith("!ping")) {
    msg.channel.send("Pong!");
  } else if (msg.content.startsWith("!")) {
    let req_pokemonName: string = msg.content.slice(1); //入力されたポケモンの名前を取得(!エルレイド)→（エルレイド）

    //choosePokemon():jsonファイルからポケモン名を検索
    //returnされたポケモンを配列に格納
    let found_pokemon: pokemon[] = pokemon.choosePokemon(req_pokemonName);
    found_pokemon.forEach((data) => {
      console.log(data);
      //文字列なんだけども実際の中身はオブジェクトなのでエラーが出た
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
        //fields配列の先頭に追加
        fields.unshift({
          name: "フォルム",
          value: data.form,
          inline: false,
        });
      }
      /**
       * @param sideColor : 複合タイプの1番目をsideColorに設定
       */
      let sideColor = pokemon.setSideColor(data.types[0]);
      /**
       * @thumbnailUrl : ポケモンのサムネイル画像のURLを取得
       */
      let thumbnailUrl: string;
      let thumbnailUrlRandom = pokemon.getRandomArbitrary(0, 4096);
      if (thumbnailUrlRandom == 1000) {
        thumbnailUrl = `https://www.serebii.net/Shiny/SM/${
          data.no < 10 ? "00" : data.no < 100 ? "0" : ""
        }${data.no}.png`;
      } else {
        thumbnailUrl = `https://www.serebii.net/sunmoon/pokemon/${
          data.no < 10 ? "00" : data.no < 100 ? "0" : ""
        }${data.no}.png`;
      }
      console.log(data);
      console.log(thumbnailUrlRandom);
      console.log(thumbnailUrl); //とれてる
      //@ts-ignore
      thumbnailUrl = pokemon.getMegaEvolution(data, thumbnailUrl);

      // pokemon.thumnailUrRandom(data.no);
      let exampleEmbed = new MessageEmbed() //[v12]からは[MessageEmbed]を使うようになった
        .setTitle(data.name)
        .setURL(`https://www.serebii.net/pokedex-sm/${data.no}.shtml`)
        .setColor(sideColor)
        .setDescription(
          `${data.name}は「${data.types}」タイプです。\nこのポケモンのより詳細なデータはこちら` +
            `https://yakkun.com/sm/zukan/n${data.no}`
        )
        .setThumbnail(thumbnailUrl)
        /*addFieldsはaddFieldにわたす引数と同じ内容をオブジェクトとして配列化複数の引数で複数渡せる */
        .addFields(fields)
        .setTimestamp()
        .setFooter(
          "Powered by Serebii",
          "https://www.serebii.net/pokedex-sm/th/001.png"
        );
      // console.log(exampleEmbed.fields);
      msg.channel.send({
        embeds: [exampleEmbed],
      });
    });
  }
});

client.login(process.env.TOKEN);
