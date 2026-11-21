// 自動生成ファイル。直接編集せず data/items.json を直して node tools/sync-data を実行
window.YOROZU_ITEMS = {
 "version": 1,
 "note": "もらえる品。group は species:<種類のまとまり> か regular:<依頼者のID>。order の順に渡す。colors は [元の色, 色違い]。use は wear（part: head/body/hand）か deco（place: shelf/wall）。常連の品は1キャラ3つまで（js/rewards.js の MAX_REGULAR_ITEMS）。名前は図鑑のカードに1行で収まるよう7字以内。company は会社（書かなければ旅行・デート travel、イベントは event、ライフプランは life。イベントの品の id は ev-、ライフプランの品は lp- で始める）",
 "speciesGroups": {
  "human": "human",
  "ladybug": "bug",
  "bee": "bug",
  "bear": "animal",
  "rabbit": "animal",
  "alien": "alien",
  "alien_scholar": "alien",
  "firefly": "bug",
  "ant": "bug",
  "squirrel": "animal",
  "penguin": "animal",
  "alien_student": "alien",
  "alien_captain": "alien",
  "beaver": "animal",
  "bagworm": "bug"
 },
 "groupNames": {
  "human": "人",
  "bug": "虫",
  "animal": "動物",
  "alien": "宇宙人"
 },
 "items": [
  {
   "id": "it-h-hat",
   "name": "麦わら帽子",
   "group": "species:human",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#e8c36a",
    "#d98a6a"
   ],
   "colorNames": [
    "きいろ",
    "れんが"
   ],
   "art": "strawhat"
  },
  {
   "id": "it-h-globe",
   "name": "ミニ地球儀",
   "group": "species:human",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#4a8fd8",
    "#5cb87a"
   ],
   "colorNames": [
    "あお",
    "みどり"
   ],
   "art": "globe"
  },
  {
   "id": "it-h-map",
   "name": "街の古い地図",
   "group": "species:human",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#e9d8a6",
    "#bcd4e6"
   ],
   "colorNames": [
    "クリーム",
    "みずいろ"
   ],
   "art": "oldmap"
  },
  {
   "id": "it-b-umbrella",
   "name": "葉っぱの傘",
   "group": "species:bug",
   "order": 1,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#6cbf5a",
    "#e0a03a"
   ],
   "colorNames": [
    "みどり",
    "オレンジ"
   ],
   "art": "leafumbrella"
  },
  {
   "id": "it-b-jar",
   "name": "花のみつのびん",
   "group": "species:bug",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#f2c94c",
    "#e07aa8"
   ],
   "colorNames": [
    "きいろ",
    "ピンク"
   ],
   "art": "honeyjar"
  },
  {
   "id": "it-b-wreath",
   "name": "朝つゆのリース",
   "group": "species:bug",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#7cc5a0",
    "#b79ad8"
   ],
   "colorNames": [
    "ミント",
    "むらさき"
   ],
   "art": "dewwreath"
  },
  {
   "id": "it-a-poncho",
   "name": "木の実ポンチョ",
   "group": "species:animal",
   "order": 1,
   "use": "wear",
   "part": "body",
   "colors": [
    "#b9784a",
    "#7a9a4a"
   ],
   "colorNames": [
    "ちゃいろ",
    "オリーブ"
   ],
   "art": "poncho"
  },
  {
   "id": "it-a-pinecone",
   "name": "松ぼっくり",
   "group": "species:animal",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#a0683c",
    "#c9a24a"
   ],
   "colorNames": [
    "ちゃいろ",
    "こがね"
   ],
   "art": "pinecone"
  },
  {
   "id": "it-a-frame",
   "name": "紅葉の額ぶち",
   "group": "species:animal",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#e2574c",
    "#f0a830"
   ],
   "colorNames": [
    "あか",
    "オレンジ"
   ],
   "art": "leafframe"
  },
  {
   "id": "it-x-wand",
   "name": "星のかけらの杖",
   "group": "species:alien",
   "order": 1,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#8fd0c8",
    "#f2c94c"
   ],
   "colorNames": [
    "ミント",
    "きいろ"
   ],
   "art": "starwand"
  },
  {
   "id": "it-x-planet",
   "name": "ちいさな惑星",
   "group": "species:alien",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#b79ad8",
    "#6cc0e0"
   ],
   "colorNames": [
    "むらさき",
    "みずいろ"
   ],
   "art": "planet"
  },
  {
   "id": "it-x-tapestry",
   "name": "星座の壁かけ",
   "group": "species:alien",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#3d4f8a",
    "#6a3d7a"
   ],
   "colorNames": [
    "こん",
    "むらさき"
   ],
   "art": "constellation"
  },
  {
   "id": "it-r-sakura-1",
   "name": "月のヘアピン",
   "group": "regular:sakura",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#f2c94c",
    "#c9d6e3"
   ],
   "colorNames": [
    "きいろ",
    "ぎんいろ"
   ],
   "art": "moonpin"
  },
  {
   "id": "it-r-sakura-2",
   "name": "星空の上着",
   "group": "regular:sakura",
   "order": 2,
   "use": "wear",
   "part": "body",
   "colors": [
    "#3d4f8a",
    "#e8a0b0"
   ],
   "colorNames": [
    "こん",
    "ピンク"
   ],
   "art": "starcardigan"
  },
  {
   "id": "it-r-sakura-3",
   "name": "星座早見盤",
   "group": "regular:sakura",
   "order": 3,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#4a8fd8",
    "#5cb87a"
   ],
   "colorNames": [
    "あお",
    "みどり"
   ],
   "art": "starwheel"
  },
  {
   "id": "it-r-hoshina-1",
   "name": "水玉のリボン",
   "group": "regular:hoshina",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#e2574c",
    "#f0a830"
   ],
   "colorNames": [
    "あか",
    "オレンジ"
   ],
   "art": "dotribbon"
  },
  {
   "id": "it-r-hoshina-2",
   "name": "水玉のマント",
   "group": "regular:hoshina",
   "order": 2,
   "use": "wear",
   "part": "body",
   "colors": [
    "#e2574c",
    "#4a8fd8"
   ],
   "colorNames": [
    "あか",
    "あお"
   ],
   "art": "dotcape"
  },
  {
   "id": "it-r-hoshina-3",
   "name": "四つ葉のうちわ",
   "group": "regular:hoshina",
   "order": 3,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#5cb87a",
    "#e8c36a"
   ],
   "colorNames": [
    "みどり",
    "きいろ"
   ],
   "art": "cloverfan"
  },
  {
   "id": "it-r-kumada-1",
   "name": "どんぐり帽子",
   "group": "regular:kumada",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#a0683c",
    "#6f8a3c"
   ],
   "colorNames": [
    "ちゃいろ",
    "オリーブ"
   ],
   "art": "acornhat"
  },
  {
   "id": "it-r-kumada-2",
   "name": "オーバーオール",
   "group": "regular:kumada",
   "order": 2,
   "use": "wear",
   "part": "body",
   "colors": [
    "#4a7fb8",
    "#b9784a"
   ],
   "colorNames": [
    "あお",
    "ちゃいろ"
   ],
   "art": "overalls"
  },
  {
   "id": "it-r-kumada-3",
   "name": "魚とりの網",
   "group": "regular:kumada",
   "order": 3,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#e8c36a",
    "#e2574c"
   ],
   "colorNames": [
    "きいろ",
    "あか"
   ],
   "art": "fishnet"
  },
  {
   "id": "ev-h-hat",
   "name": "パーティー帽",
   "group": "species:human",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#e57aa0",
    "#4a8fd8"
   ],
   "colorNames": [
    "ピンク",
    "あお"
   ],
   "art": "partyhat"
  },
  {
   "id": "ev-h-ball",
   "name": "ミラーボール",
   "group": "species:human",
   "company": "event",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#c9d6e3",
    "#f2c94c"
   ],
   "colorNames": [
    "ぎんいろ",
    "きんいろ"
   ],
   "art": "mirrorball"
  },
  {
   "id": "ev-h-flower",
   "name": "紙の花かざり",
   "group": "species:human",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#f6a8c8",
    "#f2c94c"
   ],
   "colorNames": [
    "ピンク",
    "きいろ"
   ],
   "art": "paperflower"
  },
  {
   "id": "ev-b-bow",
   "name": "花びらのリボン",
   "group": "species:bug",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "body",
   "colors": [
    "#f08ab0",
    "#b79ad8"
   ],
   "colorNames": [
    "ピンク",
    "むらさき"
   ],
   "art": "petalbow"
  },
  {
   "id": "ev-b-lamp",
   "name": "ホタルのランプ",
   "group": "species:bug",
   "company": "event",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#f2e27a",
    "#9ce0b0"
   ],
   "colorNames": [
    "きいろ",
    "ミント"
   ],
   "art": "fireflylamp"
  },
  {
   "id": "ev-b-flags",
   "name": "葉っぱの旗",
   "group": "species:bug",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#6cbf5a",
    "#e0a03a"
   ],
   "colorNames": [
    "みどり",
    "オレンジ"
   ],
   "art": "leafflags"
  },
  {
   "id": "ev-a-maracas",
   "name": "木の実マラカス",
   "group": "species:animal",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#b9784a",
    "#e2574c"
   ],
   "colorNames": [
    "ちゃいろ",
    "あか"
   ],
   "art": "acornmaracas"
  },
  {
   "id": "ev-a-cake",
   "name": "木の実のケーキ",
   "group": "species:animal",
   "company": "event",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#fff0d8",
    "#f4b8c8"
   ],
   "colorNames": [
    "クリーム",
    "いちご"
   ],
   "art": "nutcake"
  },
  {
   "id": "ev-a-sign",
   "name": "きのこの看板",
   "group": "species:animal",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#e2574c",
    "#4a8fd8"
   ],
   "colorNames": [
    "あか",
    "あお"
   ],
   "art": "mushroomsign"
  },
  {
   "id": "ev-x-halo",
   "name": "光る輪っか",
   "group": "species:alien",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#f2e27a",
    "#8fe0e8"
   ],
   "colorNames": [
    "きいろ",
    "みずいろ"
   ],
   "art": "halo"
  },
  {
   "id": "ev-x-kusudama",
   "name": "星くずのくす玉",
   "group": "species:alien",
   "company": "event",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#b79ad8",
    "#f28fb0"
   ],
   "colorNames": [
    "むらさき",
    "ピンク"
   ],
   "art": "starkusudama"
  },
  {
   "id": "ev-x-curtain",
   "name": "流れ星の幕",
   "group": "species:alien",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#2b3a66",
    "#6a3d7a"
   ],
   "colorNames": [
    "こん",
    "むらさき"
   ],
   "art": "shootingcurtain"
  },
  {
   "id": "ev-r-minori-1",
   "name": "コック帽",
   "group": "regular:minori",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#ffffff",
    "#f6c8d0"
   ],
   "colorNames": [
    "しろ",
    "ピンク"
   ],
   "art": "cookhat"
  },
  {
   "id": "ev-r-minori-2",
   "name": "花のエプロン",
   "group": "regular:minori",
   "company": "event",
   "order": 2,
   "use": "wear",
   "part": "body",
   "colors": [
    "#e2574c",
    "#5cb87a"
   ],
   "colorNames": [
    "あか",
    "みどり"
   ],
   "art": "apron"
  },
  {
   "id": "ev-r-minori-3",
   "name": "おにぎりの皿",
   "group": "regular:minori",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#5a7fc0",
    "#e8a0b0"
   ],
   "colorNames": [
    "あい",
    "さくら"
   ],
   "art": "onigiriplate"
  },
  {
   "id": "ev-r-tomori-1",
   "name": "つゆのかんむり",
   "group": "regular:tomori",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#9ce0f0",
    "#f2e27a"
   ],
   "colorNames": [
    "みずいろ",
    "きいろ"
   ],
   "art": "dewcrown"
  },
  {
   "id": "ev-r-tomori-2",
   "name": "光る花たば",
   "group": "regular:tomori",
   "company": "event",
   "order": 2,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#f2e27a",
    "#f6a8c8"
   ],
   "colorNames": [
    "きいろ",
    "ピンク"
   ],
   "art": "glowbouquet"
  },
  {
   "id": "ev-r-tomori-3",
   "name": "ふたりの光の絵",
   "group": "regular:tomori",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#2b3a66",
    "#3d6a4a"
   ],
   "colorNames": [
    "よぞら",
    "ふかみどり"
   ],
   "art": "riverpainting"
  },
  {
   "id": "ev-r-momiji-1",
   "name": "もみじのピン",
   "group": "regular:momiji",
   "company": "event",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#e2574c",
    "#f0a830"
   ],
   "colorNames": [
    "あか",
    "オレンジ"
   ],
   "art": "maplepin"
  },
  {
   "id": "ev-r-momiji-2",
   "name": "木の実リュック",
   "group": "regular:momiji",
   "company": "event",
   "order": 2,
   "use": "wear",
   "part": "body",
   "colors": [
    "#a0683c",
    "#5cb87a"
   ],
   "colorNames": [
    "ちゃいろ",
    "みどり"
   ],
   "art": "nutbackpack"
  },
  {
   "id": "ev-r-momiji-3",
   "name": "どんぐりの家",
   "group": "regular:momiji",
   "company": "event",
   "order": 3,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#c58a52",
    "#7a9a4a"
   ],
   "colorNames": [
    "ちゃいろ",
    "オリーブ"
   ],
   "art": "acornhouse"
  },
  {
   "id": "lp-h-hat",
   "name": "あみかけの帽子",
   "group": "species:human",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#e2574c",
    "#5a8fd0"
   ],
   "colorNames": [
    "あか",
    "あお"
   ],
   "art": "knithat"
  },
  {
   "id": "lp-h-pot",
   "name": "小さな鉢植え",
   "group": "species:human",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#d9825a",
    "#f2efe6"
   ],
   "colorNames": [
    "テラコッタ",
    "しろ"
   ],
   "art": "smallpot"
  },
  {
   "id": "lp-h-clock",
   "name": "家族の時計",
   "group": "species:human",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#c58a52",
    "#e2574c"
   ],
   "colorNames": [
    "ちゃいろ",
    "あか"
   ],
   "art": "familyclock"
  },
  {
   "id": "lp-b-mantle",
   "name": "葉っぱのマント",
   "group": "species:bug",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "body",
   "colors": [
    "#5cb87a",
    "#e0a03a"
   ],
   "colorNames": [
    "みどり",
    "かれは"
   ],
   "art": "leafmantle"
  },
  {
   "id": "lp-b-jar",
   "name": "種の貯金つぼ",
   "group": "species:bug",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#e8a0b0",
    "#8fc8e8"
   ],
   "colorNames": [
    "さくら",
    "みずいろ"
   ],
   "art": "seedjar"
  },
  {
   "id": "lp-b-swing",
   "name": "枝のブランコ",
   "group": "species:bug",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#f2c94c",
    "#e57aa0"
   ],
   "colorNames": [
    "きいろ",
    "ピンク"
   ],
   "art": "branchswing"
  },
  {
   "id": "lp-a-cane",
   "name": "木のつえ",
   "group": "species:animal",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#a0683c",
    "#d8b48a"
   ],
   "colorNames": [
    "こげちゃ",
    "しらき"
   ],
   "art": "woodcane"
  },
  {
   "id": "lp-a-house",
   "name": "小さな家の模型",
   "group": "species:animal",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#d9534a",
    "#4a8fd8"
   ],
   "colorNames": [
    "あか",
    "あお"
   ],
   "art": "minihouse"
  },
  {
   "id": "lp-a-map",
   "name": "川の地図",
   "group": "species:animal",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#f6e7c1",
    "#dcefd2"
   ],
   "colorNames": [
    "きなり",
    "わかば"
   ],
   "art": "rivermap"
  },
  {
   "id": "lp-x-badge",
   "name": "星のバッジ",
   "group": "species:alien",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#4a8fd8",
    "#b79ad8"
   ],
   "colorNames": [
    "あお",
    "むらさき"
   ],
   "art": "starbadge"
  },
  {
   "id": "lp-x-frame",
   "name": "未来の写真立て",
   "group": "species:alien",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#8fd0d8",
    "#f2c94c"
   ],
   "colorNames": [
    "みずいろ",
    "きんいろ"
   ],
   "art": "futureframe"
  },
  {
   "id": "lp-x-cal",
   "name": "星の暦",
   "group": "species:alien",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#2b3a66",
    "#6a3d7a"
   ],
   "colorNames": [
    "こん",
    "むらさき"
   ],
   "art": "starcalendar"
  },
  {
   "id": "lp-r-megumi-1",
   "name": "よだれかけ",
   "group": "regular:megumi",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "body",
   "colors": [
    "#f6c8d0",
    "#a8d8f0"
   ],
   "colorNames": [
    "ピンク",
    "みずいろ"
   ],
   "art": "bib"
  },
  {
   "id": "lp-r-megumi-2",
   "name": "家族の手形",
   "group": "regular:megumi",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#e2574c",
    "#4a8fd8"
   ],
   "colorNames": [
    "あか",
    "あお"
   ],
   "art": "handprints"
  },
  {
   "id": "lp-r-megumi-3",
   "name": "ベビーベッド",
   "group": "regular:megumi",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#f4e3c8",
    "#a8d8b8"
   ],
   "colorNames": [
    "クリーム",
    "ミント"
   ],
   "art": "babycrib"
  },
  {
   "id": "lp-r-sota-1",
   "name": "ギターのピック",
   "group": "regular:sota",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "hand",
   "colors": [
    "#e2574c",
    "#2b3a66"
   ],
   "colorNames": [
    "あか",
    "こん"
   ],
   "art": "guitarpick"
  },
  {
   "id": "lp-r-sota-2",
   "name": "バンドポスター",
   "group": "regular:sota",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#2b2b3a",
    "#e2574c"
   ],
   "colorNames": [
    "くろ",
    "あか"
   ],
   "art": "bandposter"
  },
  {
   "id": "lp-r-sota-3",
   "name": "はじめての鍵",
   "group": "regular:sota",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#f2c94c",
    "#c9d6e3"
   ],
   "colorNames": [
    "きんいろ",
    "ぎんいろ"
   ],
   "art": "firstkey"
  },
  {
   "id": "lp-r-banta-1",
   "name": "大工の帽子",
   "group": "regular:banta",
   "company": "life",
   "order": 1,
   "use": "wear",
   "part": "head",
   "colors": [
    "#f2c94c",
    "#e07a3a"
   ],
   "colorNames": [
    "きいろ",
    "オレンジ"
   ],
   "art": "carpenterhat"
  },
  {
   "id": "lp-r-banta-2",
   "name": "木の巣の看板",
   "group": "regular:banta",
   "company": "life",
   "order": 2,
   "use": "deco",
   "place": "wall",
   "colors": [
    "#c58a52",
    "#e8d0a0"
   ],
   "colorNames": [
    "ちゃいろ",
    "しらき"
   ],
   "art": "nestsign"
  },
  {
   "id": "lp-r-banta-3",
   "name": "木くずの置物",
   "group": "regular:banta",
   "company": "life",
   "order": 3,
   "use": "deco",
   "place": "shelf",
   "colors": [
    "#e8c88a",
    "#b9784a"
   ],
   "colorNames": [
    "しらき",
    "ちゃいろ"
   ],
   "art": "woodchip"
  }
 ]
};
