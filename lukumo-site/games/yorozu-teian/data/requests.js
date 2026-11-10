// 自動生成ファイル。直接編集せず data/requests.json を直して node tools/sync-data を実行
window.YOROZU_DATA = {
 "version": 1,
 "note": "依頼は requests に1件ずつ足す。day と time で来店日・時間帯を指定。再来店は同じ clientId で visit を増やし returnGreeting を付ける。 結果が「いまいち」の時は aftermath.poor（よかった所をほめる＋「本当は〜」で本音、40字前後）を出す。",
 "clients": {
  "sakura": {
   "name": "さくらさん",
   "kind": "人",
   "profile": "30代の妻。結婚5年目",
   "species": "human",
   "unusual": false,
   "memo": [],
   "likes": [
    "のんびり",
    "静か",
    "星",
    "家族"
   ]
  },
  "yuto": {
   "name": "ゆうとさん",
   "kind": "人",
   "profile": "大学生の彼氏",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "kenta": {
   "name": "けんたさん",
   "kind": "人",
   "profile": "40代の父。妻と小学生の娘と3人家族",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "hoshina": {
   "name": "ほしなさん夫婦",
   "kind": "テントウムシ",
   "profile": "結婚1年目のテントウムシの夫婦",
   "species": "ladybug",
   "unusual": true,
   "memo": [
    "水辺",
    "寒い",
    "鳥"
   ]
  },
  "miyuki": {
   "name": "みゆきさん",
   "kind": "人",
   "profile": "20代の会社員。元山岳部",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "fumie": {
   "name": "ふみえさん",
   "kind": "人",
   "profile": "70代の祖母。高校生の孫がいる",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "kumada": {
   "name": "くまださん親子",
   "kind": "クマ",
   "profile": "お父さんグマと子グマ",
   "species": "bear",
   "unusual": true,
   "memo": [
    "人里",
    "大きな音",
    "暑い"
   ]
  },
  "shota": {
   "name": "しょうたさん",
   "kind": "人",
   "profile": "20代。はじめてのデートを控える",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "pururu": {
   "name": "ぷるるさん",
   "kind": "宇宙からの旅人",
   "profile": "地球に来て3日目の旅人",
   "species": "alien",
   "unusual": true,
   "memo": [
    "しょっぱい",
    "まぶしい"
   ]
  },
  "daiki": {
   "name": "だいきさん",
   "kind": "人",
   "profile": "30代。プロポーズを考えている",
   "species": "human",
   "unusual": false,
   "memo": []
  }
 },
 "requests": [
  {
   "id": "r01",
   "source": "事前テスト",
   "day": 1,
   "time": "朝",
   "clientId": "sakura",
   "visit": 1,
   "regularId": "sakura",
   "lines": [
    "結婚5年目の記念日に、夫と旅行に行きたいんです。",
    "せっかくなら、写真を撮りたくなるような話題の場所がいいかな…。",
    "夫は最近ずっと帰りが遅くて、休みの日もソファで寝てばかりなんです。",
    "予算は3万円、1泊2日でお願いします。"
   ],
   "surfaceWish": "映え",
   "honneTags": [
    "のんびり",
    "静か"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 30000,
    "unit": "円",
    "duration": "1泊2日"
   },
   "aftermath": {
    "great": "夫が「久しぶりにぐっすり眠れた」って笑ってくれました！",
    "ok": "楽しかったけど、夫は少し疲れたみたいです。",
    "poor": "すてきなプランでした。…でも本当は、夫をのんびり休ませてあげたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "話題のテーマパーク",
      "cost": 15000,
      "tags": [
       "映え",
       "にぎやか"
      ],
      "art": "ferriswheel"
     },
     {
      "name": "山あいの温泉宿",
      "cost": 14000,
      "tags": [
       "のんびり",
       "静か"
      ],
      "art": "onsen"
     },
     {
      "name": "都会の夜景ホテル",
      "cost": 18000,
      "tags": [
       "映え"
      ],
      "art": "nightcity"
     },
     {
      "name": "湖のほとりの宿",
      "cost": 12000,
      "tags": [
       "静か",
       "のんびり"
      ],
      "art": "lakeinn"
     }
    ],
    "activity": [
     {
      "name": "行列のカフェめぐり",
      "cost": 3000,
      "tags": [
       "映え",
       "にぎやか"
      ],
      "art": "coffee"
     },
     {
      "name": "貸切の露天風呂",
      "cost": 5000,
      "tags": [
       "のんびり"
      ],
      "art": "onsenbath"
     },
     {
      "name": "アクティビティ体験",
      "cost": 6000,
      "tags": [
       "にぎやか"
      ],
      "art": "kayak"
     },
     {
      "name": "ハンモックでお昼寝",
      "cost": 2000,
      "tags": [
       "のんびり",
       "静か"
      ],
      "art": "hammock"
     }
    ],
    "food": [
     {
      "name": "人気のビュッフェ",
      "cost": 6000,
      "tags": [
       "にぎやか"
      ],
      "art": "buffet"
     },
     {
      "name": "部屋で食べる会席",
      "cost": 8000,
      "tags": [
       "のんびり",
       "静か"
      ],
      "art": "kaiseki"
     },
     {
      "name": "おしゃれなカフェランチ",
      "cost": 3000,
      "tags": [
       "映え"
      ],
      "art": "sandwich"
     },
     {
      "name": "地元の定食屋",
      "cost": 2000,
      "tags": [],
      "art": "teishoku"
     }
    ],
    "surprise": [
     {
      "name": "花束",
      "cost": 3000,
      "tags": [
       "映え"
      ],
      "art": "bouquet"
     },
     {
      "name": "マッサージ券",
      "cost": 4000,
      "tags": [
       "のんびり"
      ],
      "art": "ticket"
     },
     {
      "name": "写真スタジオで撮影",
      "cost": 7000,
      "tags": [
       "映え"
      ],
      "art": "camera"
     },
     {
      "name": "手書きの手紙",
      "cost": 0,
      "tags": [],
      "art": "letter"
     }
    ]
   }
  },
  {
   "id": "r02",
   "source": "事前テスト",
   "day": 1,
   "time": "昼",
   "clientId": "yuto",
   "visit": 1,
   "lines": [
    "彼女と付き合って1年なんです。とにかく派手なサプライズで驚かせたくて！",
    "あいつ、最近スマホで僕らの写真ばっかり見返してるんですよ。",
    "初めてのデートは、駅前の小さな水族館でした。",
    "前に、人が多いところは疲れるって言ってたな…。予算は2万円、日帰りで！"
   ],
   "surfaceWish": "派手",
   "honneTags": [
    "思い出",
    "静か"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 20000,
    "unit": "円",
    "duration": "日帰り"
   },
   "aftermath": {
    "great": "彼女、2人の思い出の話が止まらなくて。最高の1日です！",
    "ok": "喜んでくれたけど、ちょっと疲れさせちゃったかも。",
    "poor": "派手で楽しかったです。…でも本当は、2人の思い出を静かにたどりたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "初デートの水族館",
      "cost": 3000,
      "tags": [
       "思い出",
       "静か"
      ],
      "art": "aquarium"
     },
     {
      "name": "大型テーマパーク",
      "cost": 9000,
      "tags": [
       "派手",
       "にぎやか"
      ],
      "art": "ferriswheel"
     },
     {
      "name": "花火大会の会場",
      "cost": 2000,
      "tags": [
       "派手",
       "にぎやか"
      ],
      "art": "fireworks"
     },
     {
      "name": "海辺の展望台",
      "cost": 1000,
      "tags": [
       "静か"
      ],
      "art": "seaview"
     }
    ],
    "activity": [
     {
      "name": "フラッシュモブ",
      "cost": 10000,
      "tags": [
       "派手",
       "にぎやか"
      ],
      "art": "music"
     },
     {
      "name": "2人でアルバム作り",
      "cost": 3000,
      "tags": [
       "思い出",
       "静か"
      ],
      "art": "album"
     },
     {
      "name": "人気スポットのはしご",
      "cost": 4000,
      "tags": [
       "にぎやか"
      ],
      "art": "mappin"
     },
     {
      "name": "初デートの道をもう一度",
      "cost": 0,
      "tags": [
       "思い出"
      ],
      "art": "footprints"
     }
    ],
    "food": [
     {
      "name": "初デートで行ったカフェ",
      "cost": 2000,
      "tags": [
       "思い出"
      ],
      "art": "coffee"
     },
     {
      "name": "行列の人気店",
      "cost": 4000,
      "tags": [
       "にぎやか"
      ],
      "art": "donburi"
     },
     {
      "name": "夜景のレストラン",
      "cost": 9000,
      "tags": [
       "派手"
      ],
      "art": "wine"
     },
     {
      "name": "静かな公園でお弁当",
      "cost": 1500,
      "tags": [
       "静か"
      ],
      "art": "bento"
     }
    ],
    "surprise": [
     {
      "name": "巨大バルーンのメッセージ",
      "cost": 8000,
      "tags": [
       "派手"
      ],
      "art": "balloons"
     },
     {
      "name": "1年分の写真で作った本",
      "cost": 4000,
      "tags": [
       "思い出"
      ],
      "art": "photobook"
     },
     {
      "name": "指輪",
      "cost": 15000,
      "tags": [
       "派手"
      ],
      "art": "ring"
     },
     {
      "name": "ドローンの空撮動画",
      "cost": 6000,
      "tags": [
       "派手"
      ],
      "art": "drone"
     }
    ]
   }
  },
  {
   "id": "r03",
   "day": 1,
   "time": "夜",
   "clientId": "kenta",
   "visit": 1,
   "lines": [
    "週末に、妻と小学生の娘を連れて旅行に行きたいんです。",
    "せっかくなら、テレビで話題の人気スポットがいいかな。",
    "娘は最近、虫や草花の図鑑を毎晩ながめているんですよ。",
    "予算は5万円、2泊3日でお願いします。"
   ],
   "surfaceWish": "人気",
   "honneTags": [
    "自然",
    "学び"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 50000,
    "unit": "円",
    "duration": "2泊3日"
   },
   "aftermath": {
    "great": "娘が自然の中で大はしゃぎ！自由研究も決まりました。",
    "ok": "楽しんでいましたが、娘は少し退屈そうな時もありました。",
    "poor": "にぎやかで楽しかったです。…でも本当は、娘と森で虫や草花を見たかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "話題の観光タワー",
      "cost": 26000,
      "tags": [
       "人気",
       "にぎやか"
      ],
      "art": "tower"
     },
     {
      "name": "森のキャンプ場",
      "cost": 15000,
      "tags": [
       "自然"
      ],
      "art": "tent"
     },
     {
      "name": "人気のアウトレット",
      "cost": 23000,
      "tags": [
       "人気",
       "にぎやか"
      ],
      "art": "shopbags"
     },
     {
      "name": "博物館のある町",
      "cost": 20000,
      "tags": [
       "学び"
      ],
      "art": "museum"
     }
    ],
    "activity": [
     {
      "name": "行列のアトラクション",
      "cost": 15000,
      "tags": [
       "人気",
       "にぎやか"
      ],
      "art": "coaster"
     },
     {
      "name": "昆虫さがしツアー",
      "cost": 8000,
      "tags": [
       "自然",
       "学び"
      ],
      "art": "bugnet"
     },
     {
      "name": "買い物めぐり",
      "cost": 11000,
      "tags": [
       "人気"
      ],
      "art": "shopbags"
     },
     {
      "name": "川あそび",
      "cost": 5000,
      "tags": [
       "自然"
      ],
      "art": "splash"
     }
    ],
    "food": [
     {
      "name": "話題のパンケーキ",
      "cost": 8000,
      "tags": [
       "人気"
      ],
      "art": "pancake"
     },
     {
      "name": "川辺のバーベキュー",
      "cost": 13000,
      "tags": [
       "自然"
      ],
      "art": "bbq"
     },
     {
      "name": "ホテルのビュッフェ",
      "cost": 16000,
      "tags": [
       "にぎやか"
      ],
      "art": "buffet"
     },
     {
      "name": "地元のそば屋",
      "cost": 5000,
      "tags": [],
      "art": "soba"
     }
    ],
    "surprise": [
     {
      "name": "人気のおみやげ",
      "cost": 6000,
      "tags": [
       "人気"
      ],
      "art": "giftbox"
     },
     {
      "name": "草花の標本キット",
      "cost": 5000,
      "tags": [
       "学び",
       "自然"
      ],
      "art": "specimen"
     },
     {
      "name": "家族の記念写真",
      "cost": 13000,
      "tags": [],
      "art": "familyphoto"
     },
     {
      "name": "大きなぬいぐるみ",
      "cost": 10000,
      "tags": [],
      "art": "teddy"
     }
    ]
   }
  },
  {
   "id": "r04",
   "source": "事前テスト",
   "day": 2,
   "time": "朝",
   "clientId": "hoshina",
   "visit": 1,
   "lines": [
    "わたしたち、結婚して1年になるの。記念日にどこかへ連れてって！",
    "景色がきれいなところがいいな。…でも最近、葉っぱの上のごはんがおいしくなくてね。",
    "となりの畑のバラにアブラムシがいっぱいって聞いて、2人でずっと話してたの。",
    "予算は花粉300粒、半日でお願い！"
   ],
   "surfaceWish": "景色",
   "honneTags": [
    "食"
   ],
   "dislikeTags": [
    "水辺",
    "寒い",
    "鳥"
   ],
   "budget": {
    "amount": 300,
    "unit": "花粉の粒",
    "duration": "半日"
   },
   "aftermath": {
    "great": "ごはんがとってもおいしかった！羽までつやつやよ！",
    "ok": "景色はきれいだったわ。ごはんはまあまあね。",
    "poor": "景色はきれいだったわ。…でも本当は、アブラムシをおなかいっぱい食べたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "バラの畑",
      "cost": 120,
      "tags": [
       "食"
      ],
      "art": "rose"
     },
     {
      "name": "池のほとりの花畑",
      "cost": 100,
      "tags": [
       "景色",
       "水辺"
      ],
      "art": "flowerpond"
     },
     {
      "name": "山の上の展望台",
      "cost": 150,
      "tags": [
       "景色",
       "寒い"
      ],
      "art": "mountain"
     },
     {
      "name": "野菜の家庭菜園",
      "cost": 90,
      "tags": [
       "食"
      ],
      "art": "vegetables"
     }
    ],
    "activity": [
     {
      "name": "葉っぱで日なたぼっこ",
      "cost": 30,
      "tags": [
       "のんびり"
      ],
      "art": "leafsun"
     },
     {
      "name": "ボートで池めぐり",
      "cost": 80,
      "tags": [
       "景色",
       "水辺"
      ],
      "art": "boat"
     },
     {
      "name": "アブラムシ食べ歩き",
      "cost": 70,
      "tags": [
       "食"
      ],
      "art": "aphids"
     },
     {
      "name": "小鳥の歌のコンサート",
      "cost": 60,
      "tags": [
       "鳥"
      ],
      "art": "birdsong"
     }
    ],
    "food": [
     {
      "name": "朝つゆのジュース",
      "cost": 40,
      "tags": [],
      "art": "dewdrop"
     },
     {
      "name": "とれたてアブラムシ",
      "cost": 90,
      "tags": [
       "食"
      ],
      "art": "aphids"
     },
     {
      "name": "花の蜜のデザート",
      "cost": 50,
      "tags": [
       "景色"
      ],
      "art": "nectar"
     },
     {
      "name": "水辺のピクニック",
      "cost": 60,
      "tags": [
       "水辺"
      ],
      "art": "picnic"
     }
    ],
    "surprise": [
     {
      "name": "ホタルの光のショー",
      "cost": 70,
      "tags": [
       "景色"
      ],
      "art": "firefly"
     },
     {
      "name": "四つ葉の冠",
      "cost": 40,
      "tags": [],
      "art": "clover"
     },
     {
      "name": "アブラムシのケーキ",
      "cost": 50,
      "tags": [
       "食"
      ],
      "art": "cake"
     },
     {
      "name": "小鳥と記念撮影",
      "cost": 50,
      "tags": [
       "鳥"
      ],
      "art": "birdphoto"
     }
    ]
   }
  },
  {
   "id": "r05",
   "day": 2,
   "time": "昼",
   "clientId": "miyuki",
   "visit": 1,
   "lines": [
    "仕事が一段落したので、ひとりで旅に出たいんです。",
    "疲れているので、ゆっくり癒やされたいと思っていて。",
    "学生のころは山岳部で、週末はいつも山にいたんですよ。",
    "予算は2万5千円、1泊2日でお願いします。"
   ],
   "surfaceWish": "癒やし",
   "honneTags": [
    "山",
    "体を動かす"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 25000,
    "unit": "円",
    "duration": "1泊2日"
   },
   "aftermath": {
    "great": "久しぶりに山の空気を吸って、体の中から元気になりました！",
    "ok": "のんびりできたけど、少し体がなまった気がします。",
    "poor": "ゆっくりできました。…でも本当は、山を歩いて思いきり体を動かしたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "高級スパホテル",
      "cost": 16000,
      "tags": [
       "癒やし"
      ],
      "art": "hotel"
     },
     {
      "name": "山小屋のある高原",
      "cost": 9000,
      "tags": [
       "山",
       "体を動かす"
      ],
      "art": "hut"
     },
     {
      "name": "海辺のリゾート",
      "cost": 13000,
      "tags": [
       "癒やし"
      ],
      "art": "palmbeach"
     },
     {
      "name": "渓谷の宿",
      "cost": 10000,
      "tags": [
       "山"
      ],
      "art": "gorge"
     }
    ],
    "activity": [
     {
      "name": "アロマのマッサージ",
      "cost": 6000,
      "tags": [
       "癒やし"
      ],
      "art": "aroma"
     },
     {
      "name": "朝日の登山",
      "cost": 2000,
      "tags": [
       "山",
       "体を動かす"
      ],
      "art": "sunrise"
     },
     {
      "name": "岩場のボルダリング",
      "cost": 4000,
      "tags": [
       "体を動かす"
      ],
      "art": "climbing"
     },
     {
      "name": "宿でごろごろ",
      "cost": 0,
      "tags": [],
      "art": "futon"
     }
    ],
    "food": [
     {
      "name": "薬膳のコース",
      "cost": 6000,
      "tags": [
       "癒やし"
      ],
      "art": "kaiseki"
     },
     {
      "name": "山頂でおにぎり",
      "cost": 1000,
      "tags": [
       "山"
      ],
      "art": "onigiri"
     },
     {
      "name": "ホテルのディナー",
      "cost": 8000,
      "tags": [],
      "art": "cloche"
     },
     {
      "name": "名物のジビエ",
      "cost": 4000,
      "tags": [],
      "art": "steak"
     }
    ],
    "surprise": [
     {
      "name": "岩盤浴の券",
      "cost": 3000,
      "tags": [
       "癒やし"
      ],
      "art": "ticket"
     },
     {
      "name": "新しい登山靴",
      "cost": 7000,
      "tags": [
       "山",
       "体を動かす"
      ],
      "art": "boots"
     },
     {
      "name": "星空の写真集",
      "cost": 2000,
      "tags": [],
      "art": "photobook"
     },
     {
      "name": "ご当地の入浴剤",
      "cost": 1000,
      "tags": [
       "癒やし"
      ],
      "art": "bathsalt"
     }
    ]
   }
  },
  {
   "id": "r06",
   "day": 2,
   "time": "夜",
   "clientId": "fumie",
   "visit": 1,
   "lines": [
    "高校生の孫と、ふたりで出かける約束をしたんです。",
    "若い子が喜ぶような、流行りの場所がいいのかしらね。",
    "あの子、最近わたしの台所に来て、煮物の味を聞くのよ。",
    "予算は1万5千円、日帰りでお願いね。"
   ],
   "surfaceWish": "流行り",
   "honneTags": [
    "料理",
    "ふたりで"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 15000,
    "unit": "円",
    "duration": "日帰り"
   },
   "aftermath": {
    "great": "孫がわたしの味を覚えてくれて。うれしくて涙が出ました。",
    "ok": "楽しかったけど、若い子の場所はちょっと疲れたわ。",
    "poor": "にぎやかで楽しかったわ。…でも本当は、孫とふたりで料理がしたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "流行りの若者の街",
      "cost": 5000,
      "tags": [
       "流行り",
       "にぎやか"
      ],
      "art": "neon"
     },
     {
      "name": "朝市のある港町",
      "cost": 4000,
      "tags": [
       "料理"
      ],
      "art": "port"
     },
     {
      "name": "話題の展望デッキ",
      "cost": 6000,
      "tags": [
       "流行り"
      ],
      "art": "tower"
     },
     {
      "name": "古い商店街",
      "cost": 2000,
      "tags": [],
      "art": "arcade"
     }
    ],
    "activity": [
     {
      "name": "映えカフェめぐり",
      "cost": 4000,
      "tags": [
       "流行り"
      ],
      "art": "coffee"
     },
     {
      "name": "ふたりの料理教室",
      "cost": 5000,
      "tags": [
       "料理",
       "ふたりで"
      ],
      "art": "cookpot"
     },
     {
      "name": "ゲームセンター",
      "cost": 3000,
      "tags": [
       "流行り",
       "にぎやか"
      ],
      "art": "gamepad"
     },
     {
      "name": "港の市場めぐり",
      "cost": 2000,
      "tags": [
       "料理"
      ],
      "art": "fishmarket"
     }
    ],
    "food": [
     {
      "name": "行列のスイーツ店",
      "cost": 2500,
      "tags": [
       "流行り"
      ],
      "art": "parfait"
     },
     {
      "name": "港の海鮮丼",
      "cost": 3000,
      "tags": [],
      "art": "seafoodbowl"
     },
     {
      "name": "ファミリーレストラン",
      "cost": 2000,
      "tags": [],
      "art": "hamburg"
     },
     {
      "name": "朝市の食べ歩き",
      "cost": 2000,
      "tags": [
       "料理",
       "ふたりで"
      ],
      "art": "skewer"
     }
    ],
    "surprise": [
     {
      "name": "流行りの服",
      "cost": 6000,
      "tags": [
       "流行り"
      ],
      "art": "shirt"
     },
     {
      "name": "名入れの包丁",
      "cost": 5000,
      "tags": [
       "料理"
      ],
      "art": "knife"
     },
     {
      "name": "似顔絵",
      "cost": 3000,
      "tags": [],
      "art": "easel"
     },
     {
      "name": "ふたりの記念写真",
      "cost": 2000,
      "tags": [
       "ふたりで"
      ],
      "art": "familyphoto"
     }
    ]
   }
  },
  {
   "id": "r07",
   "day": 3,
   "time": "朝",
   "clientId": "sakura",
   "visit": 2,
   "regularId": "sakura",
   "bonusBudget": 5000,
   "returnGreeting": {
    "great": "前回の旅、夫がとても喜んで！またお願いしに来ました。",
    "ok": "こんにちは。前回はありがとうございました。",
    "poor": "今度こそ…。夫は夜、ベランダで空ばかり見ているんです。"
   },
   "lines": [
    "夫の誕生日に、おいしいごちそうの旅を贈りたくて。",
    "夫は子どものころ、天文学者になりたかったんですって。",
    "予算は2万5千円、1泊2日でお願いします。"
   ],
   "surfaceWish": "ごちそう",
   "honneTags": [
    "星"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 25000,
    "unit": "円",
    "duration": "1泊2日"
   },
   "aftermath": {
    "great": "夫が夜空を指さして、星の名前をずっと教えてくれました！",
    "ok": "ごはんはおいしかったです。夫も満足そうでした。",
    "poor": "ごちそう、おいしかったです。…でも本当は、夫と一緒に星をながめたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "高級料亭のある町",
      "cost": 14000,
      "tags": [
       "ごちそう"
      ],
      "art": "ryotei"
     },
     {
      "name": "高原の天文台の宿",
      "cost": 12000,
      "tags": [
       "星"
      ],
      "art": "observatory"
     },
     {
      "name": "港町のホテル",
      "cost": 11000,
      "tags": [
       "ごちそう"
      ],
      "art": "port"
     },
     {
      "name": "山の上の一軒宿",
      "cost": 10000,
      "tags": [
       "星",
       "静か"
      ],
      "art": "hut"
     }
    ],
    "activity": [
     {
      "name": "食べ歩きツアー",
      "cost": 4000,
      "tags": [
       "ごちそう"
      ],
      "art": "candyapple"
     },
     {
      "name": "星空の観察会",
      "cost": 3000,
      "tags": [
       "星"
      ],
      "art": "telescope"
     },
     {
      "name": "温泉めぐり",
      "cost": 3000,
      "tags": [],
      "art": "onsenbath"
     },
     {
      "name": "寿司づくり体験",
      "cost": 5000,
      "tags": [
       "ごちそう"
      ],
      "art": "sushi"
     }
    ],
    "food": [
     {
      "name": "満腹の焼肉コース",
      "cost": 8000,
      "tags": [
       "ごちそう"
      ],
      "art": "yakiniku"
     },
     {
      "name": "星を見ながら夕食",
      "cost": 6000,
      "tags": [
       "星"
      ],
      "art": "stardinner"
     },
     {
      "name": "カニの食べ放題",
      "cost": 9000,
      "tags": [
       "ごちそう"
      ],
      "art": "crabnabe"
     },
     {
      "name": "宿の手作りカレー",
      "cost": 2000,
      "tags": [],
      "art": "curry"
     }
    ],
    "surprise": [
     {
      "name": "高級な牛肉",
      "cost": 6000,
      "tags": [
       "ごちそう"
      ],
      "art": "steak"
     },
     {
      "name": "星に名前をつける",
      "cost": 3000,
      "tags": [
       "星"
      ],
      "art": "starname"
     },
     {
      "name": "名入れのグラス",
      "cost": 4000,
      "tags": [],
      "art": "glass"
     },
     {
      "name": "誕生日ケーキ",
      "cost": 3000,
      "tags": [
       "ごちそう"
      ],
      "art": "cake"
     }
    ]
   }
  },
  {
   "id": "r08",
   "day": 3,
   "time": "昼",
   "clientId": "kumada",
   "visit": 1,
   "lines": [
    "冬眠の前に、この子とふたりで出かけたいんだ。",
    "この子は冒険がしたいって。遠くの山まで行くか…。",
    "でもこの子、ぼくが川で魚をとるのを、いつもじっと見てる。",
    "予算はどんぐり160個、3日間でたのむよ。"
   ],
   "surfaceWish": "冒険",
   "honneTags": [
    "川"
   ],
   "dislikeTags": [
    "人里",
    "大きな音",
    "暑い"
   ],
   "budget": {
    "amount": 160,
    "unit": "どんぐり",
    "duration": "3日間"
   },
   "aftermath": {
    "great": "この子が初めて自分で魚をとったんだ！胸をはってたよ。",
    "ok": "冒険は楽しかったみたいだ。ちょっと疲れたけどな。",
    "poor": "冒険も楽しかったよ。…でも本当は、この子と川で魚をとりたかったんだ"
   },
   "slots": {
    "destination": [
     {
      "name": "遠くの火山",
      "cost": 80,
      "tags": [
       "冒険",
       "暑い"
      ],
      "art": "volcano"
     },
     {
      "name": "鮭ののぼる川",
      "cost": 60,
      "tags": [
       "川"
      ],
      "art": "salmonriver"
     },
     {
      "name": "人里近くの果樹園",
      "cost": 50,
      "tags": [
       "人里"
      ],
      "art": "orchard"
     },
     {
      "name": "霧の深い洞くつ",
      "cost": 70,
      "tags": [
       "冒険"
      ],
      "art": "cave"
     }
    ],
    "activity": [
     {
      "name": "洞くつ探検",
      "cost": 40,
      "tags": [
       "冒険"
      ],
      "art": "lantern"
     },
     {
      "name": "魚とりのお手本",
      "cost": 20,
      "tags": [
       "川"
      ],
      "art": "fish"
     },
     {
      "name": "花火の見物",
      "cost": 30,
      "tags": [
       "大きな音",
       "人里"
      ],
      "art": "fireworks"
     },
     {
      "name": "木登り競争",
      "cost": 15,
      "tags": [],
      "art": "tree"
     }
    ],
    "food": [
     {
      "name": "焼きたての鮭",
      "cost": 40,
      "tags": [
       "川"
      ],
      "art": "grilledfish"
     },
     {
      "name": "人里のはちみつ",
      "cost": 50,
      "tags": [
       "人里"
      ],
      "art": "honey"
     },
     {
      "name": "山ぶどう狩り",
      "cost": 25,
      "tags": [],
      "art": "grapes"
     },
     {
      "name": "冒険のおべんとう",
      "cost": 30,
      "tags": [
       "冒険"
      ],
      "art": "bento"
     }
    ],
    "surprise": [
     {
      "name": "冒険の地図",
      "cost": 30,
      "tags": [
       "冒険"
      ],
      "art": "treasuremap"
     },
     {
      "name": "手作りの釣り竿",
      "cost": 35,
      "tags": [
       "川"
      ],
      "art": "fishingrod"
     },
     {
      "name": "太鼓の演奏",
      "cost": 30,
      "tags": [
       "大きな音"
      ],
      "art": "drum"
     },
     {
      "name": "ふわふわの毛布",
      "cost": 20,
      "tags": [],
      "art": "blanket"
     }
    ]
   }
  },
  {
   "id": "r09",
   "day": 3,
   "time": "夜",
   "clientId": "shota",
   "visit": 1,
   "lines": [
    "来週、はじめてのデートなんです。緊張してて…。",
    "かっこよく見られたいので、おしゃれな店がいいです。",
    "相手は図書館で働いてて、好きな作家の話で盛り上がって。",
    "予算は1万円、夕方から夜まででお願いします。"
   ],
   "surfaceWish": "おしゃれ",
   "honneTags": [
    "本",
    "話せる"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 10000,
    "unit": "円",
    "duration": "夕方から夜"
   },
   "aftermath": {
    "great": "本の話が止まらなくて、次のデートの約束もできました！",
    "ok": "楽しかったです。でも少し緊張しすぎました。",
    "poor": "おしゃれな夜でした。…でも本当は、相手と本の話をゆっくりしたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "おしゃれなバー",
      "cost": 4000,
      "tags": [
       "おしゃれ"
      ],
      "art": "cocktail"
     },
     {
      "name": "古本の町",
      "cost": 1500,
      "tags": [
       "本"
      ],
      "art": "books"
     },
     {
      "name": "高層ビルの展望台",
      "cost": 3000,
      "tags": [
       "おしゃれ"
      ],
      "art": "nightcity"
     },
     {
      "name": "夜の植物園",
      "cost": 2000,
      "tags": [
       "話せる"
      ],
      "art": "nightgarden"
     }
    ],
    "activity": [
     {
      "name": "人気のクラブ",
      "cost": 3000,
      "tags": [
       "おしゃれ",
       "にぎやか"
      ],
      "art": "discoball"
     },
     {
      "name": "本屋で選び合う",
      "cost": 0,
      "tags": [
       "本",
       "話せる"
      ],
      "art": "books"
     },
     {
      "name": "ライブハウス",
      "cost": 3500,
      "tags": [
       "にぎやか"
      ],
      "art": "guitar"
     },
     {
      "name": "川沿いの散歩",
      "cost": 0,
      "tags": [
       "話せる"
      ],
      "art": "footprints"
     }
    ],
    "food": [
     {
      "name": "高級イタリアン",
      "cost": 6000,
      "tags": [
       "おしゃれ"
      ],
      "art": "pasta"
     },
     {
      "name": "ブックカフェ",
      "cost": 2000,
      "tags": [
       "本",
       "話せる"
      ],
      "art": "bookcafe"
     },
     {
      "name": "立ち飲み屋",
      "cost": 2000,
      "tags": [
       "にぎやか"
      ],
      "art": "beer"
     },
     {
      "name": "静かな定食屋",
      "cost": 1500,
      "tags": [],
      "art": "teishoku"
     }
    ],
    "surprise": [
     {
      "name": "高級な香水",
      "cost": 5000,
      "tags": [
       "おしゃれ"
      ],
      "art": "perfume"
     },
     {
      "name": "好きな作家の新刊",
      "cost": 1500,
      "tags": [
       "本"
      ],
      "art": "books"
     },
     {
      "name": "バラの花束",
      "cost": 3000,
      "tags": [
       "おしゃれ"
      ],
      "art": "bouquet"
     },
     {
      "name": "手作りのしおり",
      "cost": 500,
      "tags": [
       "本"
      ],
      "art": "bookmark"
     }
    ]
   }
  },
  {
   "id": "r10",
   "day": 4,
   "time": "朝",
   "clientId": "sakura",
   "visit": 3,
   "regularId": "sakura",
   "bonusBudget": 5000,
   "becomesRegular": true,
   "returnGreeting": {
    "great": "また来ちゃいました！もうここ以外には頼めません。",
    "ok": "こんにちは。今日もよろしくお願いします。",
    "poor": "今度こそ…。両親は昔の家族旅行の写真をよく見ているんです。"
   },
   "lines": [
    "両親の結婚40年のお祝いに、旅行を贈りたいんです。",
    "予算は4万円、2泊3日。高級なホテルで贅沢してほしくて。",
    "両親は、わたしが小さいころの家族旅行の話ばかりするの。"
   ],
   "surfaceWish": "高級",
   "honneTags": [
    "家族",
    "なつかしい"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 40000,
    "unit": "円",
    "duration": "2泊3日"
   },
   "aftermath": {
    "great": "母が「あの頃みたい」って。家族みんなで笑いました！",
    "ok": "両親はくつろげたみたい。ありがとうございました。",
    "poor": "豪華な旅でした。…でも本当は、家族のなつかしい思い出をたどりたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "高級ホテルの最上階",
      "cost": 18000,
      "tags": [
       "高級"
      ],
      "art": "hotel"
     },
     {
      "name": "昔泊まった海辺の宿",
      "cost": 12000,
      "tags": [
       "なつかしい"
      ],
      "art": "seaview"
     },
     {
      "name": "有名な温泉リゾート",
      "cost": 15000,
      "tags": [
       "高級"
      ],
      "art": "onsen"
     },
     {
      "name": "家族で行った牧場",
      "cost": 9000,
      "tags": [
       "なつかしい",
       "家族"
      ],
      "art": "farm"
     }
    ],
    "activity": [
     {
      "name": "エステとスパ",
      "cost": 8000,
      "tags": [
       "高級"
      ],
      "art": "aroma"
     },
     {
      "name": "家族のアルバム鑑賞",
      "cost": 1000,
      "tags": [
       "家族",
       "なつかしい"
      ],
      "art": "album"
     },
     {
      "name": "クルーズ船の旅",
      "cost": 14000,
      "tags": [
       "高級"
      ],
      "art": "ship"
     },
     {
      "name": "美術館めぐり",
      "cost": 4000,
      "tags": [],
      "art": "artframe"
     }
    ],
    "food": [
     {
      "name": "フレンチのフルコース",
      "cost": 12000,
      "tags": [
       "高級"
      ],
      "art": "cloche"
     },
     {
      "name": "家族みんなで鍋",
      "cost": 6000,
      "tags": [
       "家族"
      ],
      "art": "nabe"
     },
     {
      "name": "有名シェフの店",
      "cost": 10000,
      "tags": [
       "高級"
      ],
      "art": "chefhat"
     },
     {
      "name": "ホテルの朝食",
      "cost": 3000,
      "tags": [],
      "art": "breakfast"
     }
    ],
    "surprise": [
     {
      "name": "高級な腕時計",
      "cost": 18000,
      "tags": [
       "高級"
      ],
      "art": "watch"
     },
     {
      "name": "家族のビデオ手紙",
      "cost": 2000,
      "tags": [
       "家族"
      ],
      "art": "videoletter"
     },
     {
      "name": "花束",
      "cost": 3000,
      "tags": [],
      "art": "bouquet"
     },
     {
      "name": "思い出の写真の額",
      "cost": 3000,
      "tags": [
       "なつかしい"
      ],
      "art": "artframe"
     }
    ]
   }
  },
  {
   "id": "r11",
   "day": 4,
   "time": "昼",
   "clientId": "pururu",
   "visit": 1,
   "lines": [
    "地球に来て3日目です。帰る前に旅の思い出がほしい。",
    "地球でいちばん有名な名所を、ぜんぶ見ておきたいです。",
    "街の人が買い物したり、ごはんを食べたりするのを見るのが好き。",
    "予算は星のかけら90個、地球時間で1日です。"
   ],
   "surfaceWish": "名所",
   "honneTags": [
    "ふつう"
   ],
   "dislikeTags": [
    "しょっぱい",
    "まぶしい"
   ],
   "budget": {
    "amount": 90,
    "unit": "星のかけら",
    "duration": "地球時間で1日"
   },
   "aftermath": {
    "great": "街の人の暮らしを、すぐそばで見られました！星のみんなに自慢します。",
    "ok": "名所はすごかったです。少し人が多かったけど。",
    "poor": "名所はすごかったです。…でも本当は、地球のふつうの毎日を味わいたかったのです"
   },
   "slots": {
    "destination": [
     {
      "name": "世界遺産の城",
      "cost": 45,
      "tags": [
       "名所"
      ],
      "art": "castle"
     },
     {
      "name": "駅前の商店街",
      "cost": 20,
      "tags": [
       "ふつう"
      ],
      "art": "arcade"
     },
     {
      "name": "大きな滝の名所",
      "cost": 40,
      "tags": [
       "名所"
      ],
      "art": "waterfall"
     },
     {
      "name": "真夏の砂浜",
      "cost": 30,
      "tags": [
       "まぶしい"
      ],
      "art": "palmbeach"
     }
    ],
    "activity": [
     {
      "name": "名所めぐりバス",
      "cost": 30,
      "tags": [
       "名所"
      ],
      "art": "bus"
     },
     {
      "name": "銭湯に入る",
      "cost": 10,
      "tags": [
       "ふつう"
      ],
      "art": "bathbucket"
     },
     {
      "name": "夜景のライトアップ",
      "cost": 25,
      "tags": [
       "まぶしい",
       "名所"
      ],
      "art": "lightup"
     },
     {
      "name": "スーパーで買い物",
      "cost": 5,
      "tags": [
       "ふつう"
      ],
      "art": "cart"
     }
    ],
    "food": [
     {
      "name": "老舗の天ぷら",
      "cost": 30,
      "tags": [
       "名所"
      ],
      "art": "tempura"
     },
     {
      "name": "家庭料理の定食",
      "cost": 15,
      "tags": [
       "ふつう"
      ],
      "art": "teishoku"
     },
     {
      "name": "塩ラーメン",
      "cost": 15,
      "tags": [
       "しょっぱい"
      ],
      "art": "ramen"
     },
     {
      "name": "屋台の焼きそば",
      "cost": 10,
      "tags": [],
      "art": "yakisoba"
     }
    ],
    "surprise": [
     {
      "name": "名所の写真集",
      "cost": 20,
      "tags": [
       "名所"
      ],
      "art": "photobook"
     },
     {
      "name": "商店街の福引き",
      "cost": 5,
      "tags": [
       "ふつう"
      ],
      "art": "lottery"
     },
     {
      "name": "花火の打ち上げ",
      "cost": 30,
      "tags": [
       "まぶしい"
      ],
      "art": "fireworks"
     },
     {
      "name": "ご当地のおみやげ",
      "cost": 15,
      "tags": [],
      "art": "giftbox"
     }
    ]
   }
  },
  {
   "id": "r12",
   "day": 4,
   "time": "夜",
   "clientId": "daiki",
   "visit": 1,
   "lines": [
    "彼女にプロポーズしたくて、旅行を計画してるんです。",
    "やっぱり夜景の見えるレストランが定番ですよね？",
    "彼女、休みの日は動物の保護施設で手伝いをしてて。",
    "予算は5万円、2泊3日でお願いします。"
   ],
   "surfaceWish": "夜景",
   "honneTags": [
    "動物"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 50000,
    "unit": "円",
    "duration": "2泊3日"
   },
   "aftermath": {
    "great": "動物たちに囲まれてプロポーズしたら、泣いて笑ってくれました！",
    "ok": "OKはもらえました！でも少し緊張させちゃったかな。",
    "poor": "夜景はきれいでした。…でも本当は、動物といる時の彼女の笑顔が見たかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "夜景の高層ホテル",
      "cost": 28000,
      "tags": [
       "夜景"
      ],
      "art": "nightcity"
     },
     {
      "name": "牧場のコテージ",
      "cost": 18000,
      "tags": [
       "動物"
      ],
      "art": "farm"
     },
     {
      "name": "港の夜景の街",
      "cost": 24000,
      "tags": [
       "夜景"
      ],
      "art": "port"
     },
     {
      "name": "動物の島の民宿",
      "cost": 15000,
      "tags": [
       "動物",
       "自然"
      ],
      "art": "island"
     }
    ],
    "activity": [
     {
      "name": "夜景クルーズ",
      "cost": 12000,
      "tags": [
       "夜景"
      ],
      "art": "ship"
     },
     {
      "name": "乗馬体験",
      "cost": 8000,
      "tags": [
       "動物"
      ],
      "art": "horse"
     },
     {
      "name": "高級店で買い物",
      "cost": 15000,
      "tags": [],
      "art": "shopbags"
     },
     {
      "name": "美術館めぐり",
      "cost": 5000,
      "tags": [],
      "art": "artframe"
     }
    ],
    "food": [
     {
      "name": "夜景のフレンチ",
      "cost": 15000,
      "tags": [
       "夜景"
      ],
      "art": "wine"
     },
     {
      "name": "動物カフェでランチ",
      "cost": 5000,
      "tags": [
       "動物"
      ],
      "art": "catcafe"
     },
     {
      "name": "屋形船のごはん",
      "cost": 12000,
      "tags": [
       "夜景"
      ],
      "art": "yakatabune"
     },
     {
      "name": "ホテルのルームサービス",
      "cost": 9000,
      "tags": [],
      "art": "cloche"
     }
    ],
    "surprise": [
     {
      "name": "花火の打ち上げ",
      "cost": 15000,
      "tags": [
       "夜景"
      ],
      "art": "fireworks"
     },
     {
      "name": "子ヤギの名付け親",
      "cost": 5000,
      "tags": [
       "動物"
      ],
      "art": "goat"
     },
     {
      "name": "大きな花束",
      "cost": 6000,
      "tags": [],
      "art": "bouquet"
     },
     {
      "name": "指輪のケーキ",
      "cost": 4000,
      "tags": [],
      "art": "cake"
     }
    ]
   }
  }
 ]
};
