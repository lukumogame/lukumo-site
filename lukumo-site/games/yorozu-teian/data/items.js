// 自動生成ファイル。直接編集せず data/items.json を直して node tools/sync-data を実行
window.YOROZU_ITEMS = {
 "version": 1,
 "note": "もらえる品。group は species:<種類のまとまり> か regular:<依頼者のID>。order の順に渡す。colors は [元の色, 色違い]。use は wear（part: head/body/hand）か deco（place: shelf/wall）。常連の品は1キャラ3つまで（js/rewards.js の MAX_REGULAR_ITEMS）。名前は図鑑のカードに1行で収まるよう7字以内",
 "speciesGroups": {
  "human": "human",
  "ladybug": "bug",
  "bee": "bug",
  "bear": "animal",
  "rabbit": "animal",
  "alien": "alien",
  "alien_scholar": "alien"
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
  }
 ]
};
