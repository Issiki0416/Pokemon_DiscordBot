const pokemonData: pokemon[] = require("../json/pokemon_data.json");
/*
no: 79,
    name: 'ヤドン',
    form: '',
    isMegaEvolution: false,
    evolutions: [ 80, 199 ],
    types: [ 'みず', 'エスパー' ],
    abilities: [ 'どんかん', 'マイペース' ],
    hiddenAbilities: [ 'さいせいりょく' ],
    stats: {
      hp: 90,
      attack: 65,
      defence: 65,
      spAttack: 40,
      spDefence: 40,
      speed: 15
    }
  },
  */
export type pokemon = {
  //型エイリアスのお決まりで「type」
  no: number;
  name: string;
  form: string;
  isMegaEvolution: boolean;
  evolutions: number[];
  types: string[];
  abilities: string[];
  hiddenAbilities: string[];
  stats: {
    hp: number;
    attack: number;
    defence: number;
    spAttack: number;
    spDefence: number;
    speed: number;
  };
};

class Pokemon {
  /**
   * @private {string[]}
   * @private {}
   */
  private pokeArray: pokemon[] = [];
  private sideColor: number = 0xffffff;
  private thumbnailUrl: string = "";
  private thumnailUrlRandom: number = 0;
  /**
   * ポケモンの名前を配列で返すメソッド
   * @param content メッセージからポケモンを取り出す
   * @return {string[]} jsonファイルから入力されたポケモン名を検索して配列に格納(ここでポケモンの名前は同じだが種類が多いポケモンのため配列)
   */
  choosePokemon(content: string): pokemon[] {
    if (this.pokeArray.length) {
      this.pokeArray = [];
    }
    for (let i = 0; i < pokemonData.length; i++) {
      if (pokemonData[i].name === content) {
        this.pokeArray.push(pokemonData[i]);
      }
    }
    return this.pokeArray;
  }
  /**
   * 乱数生成用関数
   * @param min 最小値
   * @param max 最大値
   * @returns 引数の範囲から乱数を生成する
   */

  //色違い処理、複数の色を持つポケモン判定用乱数
  getRandomArbitrary(min: number, max: number): number {
    let result: number = Math.random() * (max - min) + min;
    return Math.floor(result);
  }

  /**
   * @param color
   * @returns {number} 16進数で色を返す
   */
  setSideColor(color: string) {
    switch (color) {
      case "ノーマル":
        this.sideColor = 0xb8b895;
        break;
      case "くさ":
        this.sideColor = 0x95c779;
        break;
      case "ほのお":
        this.sideColor = 0xdc5949;
        break;
      case "みず":
        this.sideColor = 0x73b8ea;
        break;
      case "でんき":
        this.sideColor = 0xf2d479;
        break;
      case "こおり":
        this.sideColor = 0xb8e7e7;
        break;
      case "かくとう":
        this.sideColor = 0x873530;
        break;
      case "どく":
        this.sideColor = 0x9b5fa7;
        break;
      case "じめん":
        this.sideColor = 0xe3cb8e;
        break;
      case "ひこう":
        this.sideColor = 0xb2bdea;
        break;
      case "エスパー":
        this.sideColor = 0xe36c9b;
        break;
      case "むし":
        this.sideColor = 0xbdb85f;
        break;
      case "いわ":
        this.sideColor = 0xc2a75f;
        break;
      case "ゴースト":
        this.sideColor = 0x6c6ca1;
        break;
      case "ドラゴン":
        this.sideColor = 0x6687e3;
        break;
      case "あく":
        this.sideColor = 0x6c594e;
        break;
      case "はがね":
        this.sideColor = 0xc7d4e0;
        break;
      case "フェアリー":
        this.sideColor = 0xfa90ba;
        break;

      default:
        break;
    }
    return this.sideColor;
  }

  /**
   * 色違い用Url生成関数
   * @param pokemon_id ポケモン図鑑番号
   * @returns Urlを返す
   */
  thumnailUrRandom(pokemon_id: number) {
    this.thumnailUrlRandom = this.getRandomArbitrary(0, 4096);
    if (this.thumnailUrlRandom == 1000) {
      this.thumbnailUrl = `https://www.serebii.net/Shiny/SM/${
        pokemon_id < 10 ? "00" : pokemon_id < 100 ? "0" : ""
      }${pokemon_id}.png`;
    } else {
      //0パッディング処理
      this.thumbnailUrl = ` https://www.serebii.net/sunmoon/pokemon/${
        pokemon_id < 10 ? "00" : pokemon_id < 100 ? "0" : ""
      }${pokemon_id}.png`;
    }
    return this.thumbnailUrl;
  }

  //メガシンカ用
  /**
   * メガシンカ、フォルムがあるポケモン画像Urlを返す関数
   * @param data ポケモンのjsonデータ
   * @param thumbnailUrl thumbnailUrl
   * @returns Urlを変更して返す
   */
  //@ts-ignore
  getMegaEvolution(data: any, thumbnailUrl: string) {
    // this.thumnailUrRandom;
    if (data.isMegaEvolution) {
      //末尾4文字を削除
      // console.log(thumbnailUrl.slice(0, -4) + "-m.png");
      return thumbnailUrl.slice(0, -4) + "-m.png";
    } else if (data.form.startsWith("アローラ")) {
      //アローラ用サムネイル処理
      return thumbnailUrl.slice(0, -4) + "-a.png";
    } else {
      switch (data.name) {
        case "デオキシス":
          if (data.form == "ノーマルフォルム") {
            return thumbnailUrl;
            break;
          }
          if (data.form == "アタックフォルム") {
            return thumbnailUrl.slice(0, -4) + "-a.png";
          }
          if (data.form == "ディフェンスフォルム") {
            return thumbnailUrl.slice(0, -4) + "-d.png";
          }
          if (data.form == "スピードフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "ミノマダム":
          if (data.form == "くさきのミノ") {
            return thumbnailUrl;
            break;
          }
          if (data.form == "すなちのミノ") {
            return thumbnailUrl.slice(0, -4) + "-c.png";
          }
          if (data.form == "ゴミのミノ") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        // case "ミノマダム":
        //   if (data.form == "すなちのミノ") {
        //     return thumbnailUrl.slice(0, -4) + "-c.png";
        //   }
        //   if (data.form == "ゴミのミノ") {
        //     return thumbnailUrl.slice(0, -4) + "-s.png";
        //   }
        //   break;
        case "ロトム":
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "ヒートロトム") {
            return thumbnailUrl.slice(0, -4) + "-h.png";
          }
          if (data.form == "ウォッシュロトム") {
            return thumbnailUrl.slice(0, -4) + "-w.png";
          }
          if (data.form == "フロストロトム") {
            return thumbnailUrl.slice(0, -4) + "-f.png";
          }
          if (data.form == "スピンロトム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          if (data.form == "カットロトム") {
            return thumbnailUrl.slice(0, -4) + "-m.png";
          }
          break;
        case "ギラティナ":
          if (data.form == "アナザーフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "オリジンフォルム") {
            return thumbnailUrl.slice(0, -4) + "-o.png";
          }
          break;
        case "シェイミ":
          if (data.form == "ランドフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "スカイフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }

          break;
        case "バスラオ":
          if (data.form == "あかすじ") {
            return thumbnailUrl;
          }
          if (data.form == "あおすじ") {
            return thumbnailUrl.slice(0, -4) + "-b.png";
          }
          break;
        case "ヒヒダルマ":
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "ダルマモード") {
            return thumbnailUrl.slice(0, -4) + "-d.png";
          }
          break;
        case "トルネロス":
          if (data.form == "けしんフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "れいじゅうフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "ボルトロス":
          if (data.form == "けしんフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "れいじゅうフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "ランドロス":
          if (data.form == "けしんフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "れいじゅうフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "キュレム":
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "ホワイトキュレム") {
            return thumbnailUrl.slice(0, -4) + "-w.png";
          }
          if (data.form == "ブラックキュレム") {
            return thumbnailUrl.slice(0, -4) + "-b.png";
          }
          break;
        case "ケルディオ":
          if (data.form == "") {
            //readiness
            return thumbnailUrl;
          }
          if (data.form == "かくごのすがた") {
            //readiness
            return thumbnailUrl.slice(0, -4) + "-r.png";
          }
          break;
        case "メロエッタ":
          if (data.form == "ボイスフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "ステップフォルム") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "ゲッコウガ":
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "サトシゲッコウガ") {
            return thumbnailUrl.slice(0, -4) + "-a.png";
          }
          break;
        case "ニャオニクス":
          if (data.form == "オスのすがた") {
            return thumbnailUrl;
          }
          if (data.form == "メスのすがた") {
            return thumbnailUrl.slice(0, -4) + "-f.png";
          }
          break;
        case "ギルガルド":
          if (data.form == "シールドフォルム") {
            return thumbnailUrl;
          }
          if (data.form == "ブレードフォルム") {
            return thumbnailUrl.slice(0, -4) + "-b.png";
          }
          break;
        case "バケッチャ":
          if (data.form == "ちいさいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "おおきいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-l.png";
          }
          if (data.form == "とくだいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-h.png";
          }
          break;
        case "パンプジン":
          if (data.form == "ちいさいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          if (data.form == "おおきいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-l.png";
          }
          if (data.form == "とくだいサイズ") {
            return thumbnailUrl.slice(0, -4) + "-h.png";
          }
          break;
        case "ジガルデ":
          if (data.form == "10%フォルム") {
            return thumbnailUrl.slice(0, -4) + "-10.png";
          }
          if (data.form == "50%フォルム") {
            return thumbnailUrl;
          }

          if (data.form == "パーフェクトフォルム") {
            return thumbnailUrl.slice(0, -4) + "-c.png";
          }

          break;
        case "フーパ":
          if (data.form == "いましめられしフーパ") {
            return thumbnailUrl;
          }
          if (data.form == "ときはなたれしフーパ") {
            return thumbnailUrl.slice(0, -4) + "-u.png";
          }
          break;
        case "オドリドリ":
          if (data.form == "めらめらスタイル") {
            return thumbnailUrl;
          }
          if (data.form == "ぱちぱちスタイル") {
            return thumbnailUrl.slice(0, -4) + "-p.png";
          }

          if (data.form == "ふらふらスタイル") {
            return thumbnailUrl.slice(0, -4) + "-pau.png";
          }
          if (data.form == "まいまいスタイル") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "ルガルガン":
          if (data.form == "まひるのすがた") {
            return thumbnailUrl;
          }
          if (data.form == "まよなかのすがた") {
            return thumbnailUrl.slice(0, -4) + "-m.png";
          }

          if (data.form == "たそがれのすがた") {
            return thumbnailUrl.slice(0, -4) + "-d.png";
          }

          break;
        case "ヨワシ":
          if (data.form == "たんどくのすがた") {
            return thumbnailUrl;
          }
          if (data.form == "むれたすがた") {
            return thumbnailUrl.slice(0, -4) + "-s.png";
          }
          break;
        case "メテノ":
          if (data.form == "コア") {
            let random: number = this.getRandomArbitrary(0, 7);
            if (random == 0) {
              return thumbnailUrl.slice(0, -4) + "-b.png";
            } else if (random == 1) {
              return thumbnailUrl.slice(0, -4) + "-g.png";
            } else if (random == 2) {
              return thumbnailUrl.slice(0, -4) + "-i.png";
            } else if (random == 3) {
              return thumbnailUrl.slice(0, -4) + "-o.png";
            } else if (random == 4) {
              return thumbnailUrl.slice(0, -4) + "-r.png";
            } else if (random == 5) {
              return thumbnailUrl.slice(0, -4) + "-v.png";
            } else if (random == 6) {
              return thumbnailUrl.slice(0, -4) + "-y.png";
            }
          } else {
            return thumbnailUrl;
          }
          break;
        case "ネクロズマ":
          if (data.form == "") {
            return thumbnailUrl;
          }
          if (data.form == "たそがれのたてがみ") {
            return thumbnailUrl.slice(0, -4) + "-dm.png";
          }
          if (data.form == "あかつきのつばさ") {
            return thumbnailUrl.slice(0, -4) + "-dw.png";
          }
          break;

        default:
          return thumbnailUrl;
        // break;
      }
    }
  }
}
//Pokemonクラスをインスタンス化してエクスポート
export const pokemon = new Pokemon();
