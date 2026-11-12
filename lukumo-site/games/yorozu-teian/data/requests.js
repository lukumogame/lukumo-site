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
   ],
   "thanks": "いつも本当にありがとうございます。また来ますね。"
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
   ],
   "thanks": "いつもありがとう！家族みんな、ここが大好きよ。"
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
   ],
   "thanks": "いつもありがとな。この子も、ここが大好きなんだ。"
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
  },
  "akira": {
   "name": "あきらさん",
   "kind": "人",
   "profile": "60代。先月、長年勤めた会社を退職した",
   "species": "human",
   "unusual": false,
   "memo": []
  },
  "mitsue": {
   "name": "みつえさん",
   "kind": "ミツバチ",
   "profile": "働きもののミツバチ。はじめてのお休み",
   "species": "bee",
   "unusual": true,
   "memo": [
    "雨",
    "煙",
    "クモの巣"
   ]
  },
  "fuwari": {
   "name": "ふわりさん",
   "kind": "ウサギ",
   "profile": "ウサギのおばあちゃん。孫が6匹いる",
   "species": "rabbit",
   "unusual": true,
   "memo": [
    "キツネ",
    "大きな音",
    "水ぬれ"
   ]
  },
  "miru": {
   "name": "ミルさん",
   "kind": "宇宙からの研究者",
   "profile": "遠い星から来た研究者。調査は今日まで",
   "species": "alien_scholar",
   "unusual": true,
   "memo": [
    "強いにおい",
    "ゆれる乗り物"
   ]
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
      "art": "massageticket"
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
      "art": "yakuzen"
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
      "art": "stonebathticket"
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
  },
  {
   "id": "r13",
   "day": 5,
   "time": "朝",
   "clientId": "hoshina",
   "visit": 2,
   "regularId": "hoshina",
   "bonusBudget": 40,
   "returnGreeting": {
    "great": "前回のごはん、夫婦でまだ話してるの！またお願いね。",
    "ok": "こんにちは。この前はありがとう！",
    "poor": "今度こそ…。夫は、お日さまの当たる場所が大好きなの。"
   },
   "lines": [
    "今度は夫の誕生日なの。もうすぐ卵もかえるし、にぎやかにお祝いしたいわ。",
    "でも夫ったら、朝が冷えるって、このごろ葉っぱの下で丸まってばかり。",
    "予算は花粉260粒、半日でお願い！"
   ],
   "surfaceWish": "にぎやか",
   "honneTags": [
    "日なた"
   ],
   "dislikeTags": [
    "水辺",
    "寒い",
    "鳥"
   ],
   "budget": {
    "amount": 260,
    "unit": "花粉の粒",
    "duration": "半日"
   },
   "aftermath": {
    "great": "夫ったら、体がぽかぽかで元気いっぱい！最高の誕生日よ。",
    "ok": "にぎやかで楽しかったわ。夫は少し寒そうだったけど。",
    "poor": "お祝いはにぎやかで楽しかったわ。…でも本当は、夫をお日さまで温めてあげたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "朝日の当たる丘",
      "cost": 120,
      "tags": [
       "日なた"
      ],
      "art": "sunrise"
     },
     {
      "name": "浮き草の大広場",
      "cost": 100,
      "tags": [
       "にぎやか",
       "水辺"
      ],
      "art": "flowerpond"
     },
     {
      "name": "日だまりの花だん",
      "cost": 110,
      "tags": [
       "日なた",
       "のんびり"
      ],
      "art": "flowerbed"
     },
     {
      "name": "夜の植物園の集会",
      "cost": 90,
      "tags": [
       "にぎやか",
       "寒い"
      ],
      "art": "nightgarden"
     }
    ],
    "activity": [
     {
      "name": "葉っぱで日なたぼっこ",
      "cost": 30,
      "tags": [
       "日なた",
       "のんびり"
      ],
      "art": "leafsun"
     },
     {
      "name": "虫たちのダンス会",
      "cost": 60,
      "tags": [
       "にぎやか"
      ],
      "art": "bugparty"
     },
     {
      "name": "夜風の散歩",
      "cost": 40,
      "tags": [
       "寒い"
      ],
      "art": "nightbreeze"
     },
     {
      "name": "鳥の巣の見学",
      "cost": 50,
      "tags": [
       "鳥"
      ],
      "art": "birdsong"
     }
    ],
    "food": [
     {
      "name": "日なたのアブラムシ",
      "cost": 70,
      "tags": [
       "日なた",
       "食"
      ],
      "art": "aphids"
     },
     {
      "name": "パーティーの大皿",
      "cost": 80,
      "tags": [
       "にぎやか"
      ],
      "art": "buffet"
     },
     {
      "name": "冷たい朝つゆ",
      "cost": 30,
      "tags": [
       "寒い"
      ],
      "art": "dewdrop"
     },
     {
      "name": "花の蜜のデザート",
      "cost": 50,
      "tags": [],
      "art": "nectar"
     }
    ],
    "surprise": [
     {
      "name": "パーティーの風船",
      "cost": 60,
      "tags": [
       "にぎやか"
      ],
      "art": "balloons"
     },
     {
      "name": "ぽかぽか葉っぱの毛布",
      "cost": 40,
      "tags": [
       "日なた"
      ],
      "art": "blanket"
     },
     {
      "name": "小鳥の歌のプレゼント",
      "cost": 50,
      "tags": [
       "鳥"
      ],
      "art": "birdphoto"
     },
     {
      "name": "四つ葉の冠",
      "cost": 40,
      "tags": [],
      "art": "clover"
     }
    ]
   }
  },
  {
   "id": "r14",
   "day": 5,
   "time": "昼",
   "clientId": "akira",
   "visit": 1,
   "lines": [
    "長く勤めた会社を先月退職しまして。妻に旅行を贈りたいんです。",
    "南の島のリゾートなんてどうでしょう。きっと妻も喜ぶかと。",
    "妻とは昔、夜行列車でたまたま隣の席になったのが縁でしてね。",
    "予算は4万5千円、2泊3日でお願いします。"
   ],
   "surfaceWish": "リゾート",
   "honneTags": [
    "鉄道"
   ],
   "dislikeTags": [],
   "budget": {
    "amount": 45000,
    "unit": "円",
    "duration": "2泊3日"
   },
   "aftermath": {
    "great": "妻が窓の外をながめながら、出会った日の話をしてくれました！",
    "ok": "のんびりできました。妻もくつろいでいたようです。",
    "poor": "すてきな旅でした。…でも本当は、妻ともう一度列車の旅をしたかったんです"
   },
   "slots": {
    "destination": [
     {
      "name": "南の島のリゾート",
      "cost": 30000,
      "tags": [
       "リゾート"
      ],
      "art": "palmbeach"
     },
     {
      "name": "寝台列車の旅",
      "cost": 26000,
      "tags": [
       "鉄道"
      ],
      "art": "sleepertrain"
     },
     {
      "name": "海辺の高級ホテル",
      "cost": 28000,
      "tags": [
       "リゾート"
      ],
      "art": "hotel"
     },
     {
      "name": "ローカル線の終点の町",
      "cost": 16000,
      "tags": [
       "鉄道",
       "のんびり"
      ],
      "art": "localtrain"
     }
    ],
    "activity": [
     {
      "name": "ビーチでマリン体験",
      "cost": 8000,
      "tags": [
       "リゾート"
      ],
      "art": "kayak"
     },
     {
      "name": "リゾートのエステ",
      "cost": 9000,
      "tags": [
       "リゾート"
      ],
      "art": "aroma"
     },
     {
      "name": "鉄道の博物館",
      "cost": 4000,
      "tags": [
       "鉄道"
      ],
      "art": "museum"
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
      "name": "リゾートのディナー",
      "cost": 12000,
      "tags": [
       "リゾート"
      ],
      "art": "cloche"
     },
     {
      "name": "食堂車のコース",
      "cost": 14000,
      "tags": [
       "鉄道"
      ],
      "art": "diningcar"
     },
     {
      "name": "駅弁の食べくらべ",
      "cost": 3000,
      "tags": [
       "鉄道"
      ],
      "art": "bento"
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
      "name": "記念の切符セット",
      "cost": 3000,
      "tags": [
       "鉄道"
      ],
      "art": "trainticket"
     },
     {
      "name": "思い出の列車の模型",
      "cost": 8000,
      "tags": [
       "鉄道",
       "思い出"
      ],
      "art": "trainmodel"
     },
     {
      "name": "南国の花の首飾り",
      "cost": 3000,
      "tags": [
       "リゾート"
      ],
      "art": "lei"
     },
     {
      "name": "夫婦の記念写真",
      "cost": 5000,
      "tags": [],
      "art": "familyphoto"
     }
    ]
   }
  },
  {
   "id": "r15",
   "day": 5,
   "time": "夜",
   "clientId": "kumada",
   "visit": 2,
   "regularId": "kumada",
   "bonusBudget": 25,
   "returnGreeting": {
    "great": "この前は最高だった！この子、魚とりが得意になったよ。",
    "ok": "やあ、また来たよ。今日もたのむよ。",
    "poor": "今度こそ…。この子、ぼくの背中によじのぼって遠くを見るのが好きでな。"
   },
   "lines": [
    "この子、食べざかりでな。腹いっぱいごちそうを食べさせたい。",
    "この子、ひと回り大きくなってな。高い木のてっぺんばかり見てるよ。",
    "予算はどんぐり150個、3日間でたのむよ。"
   ],
   "surfaceWish": "ごちそう",
   "honneTags": [
    "木登り"
   ],
   "dislikeTags": [
    "人里",
    "大きな音",
    "暑い"
   ],
   "budget": {
    "amount": 150,
    "unit": "どんぐり",
    "duration": "3日間"
   },
   "aftermath": {
    "great": "この子が高いところから、得意そうに手をふってたよ！",
    "ok": "腹いっぱい食べたよ。この子は少し退屈そうだったな。",
    "poor": "ごちそう、うまかったよ。…でも本当は、この子に木登りを教えてやりたかったんだ"
   },
   "slots": {
    "destination": [
     {
      "name": "春の山菜の森",
      "cost": 60,
      "tags": [
       "ごちそう"
      ],
      "art": "vegetables"
     },
     {
      "name": "大きな木のある森",
      "cost": 60,
      "tags": [
       "木登り"
      ],
      "art": "tree"
     },
     {
      "name": "人里の果樹園",
      "cost": 50,
      "tags": [
       "ごちそう",
       "人里"
      ],
      "art": "orchard"
     },
     {
      "name": "古い大木の谷",
      "cost": 70,
      "tags": [
       "木登り"
      ],
      "art": "gorge"
     }
    ],
    "activity": [
     {
      "name": "はちみつさがし",
      "cost": 30,
      "tags": [
       "ごちそう"
      ],
      "art": "honey"
     },
     {
      "name": "木登りのお手本",
      "cost": 20,
      "tags": [
       "木登り"
      ],
      "art": "treeclimb"
     },
     {
      "name": "川で春の魚とり",
      "cost": 25,
      "tags": [
       "ごちそう"
      ],
      "art": "fish"
     },
     {
      "name": "祭りの太鼓見物",
      "cost": 30,
      "tags": [
       "大きな音",
       "人里"
      ],
      "art": "drum"
     }
    ],
    "food": [
     {
      "name": "山盛りのたけのこ",
      "cost": 40,
      "tags": [
       "ごちそう"
      ],
      "art": "bamboo"
     },
     {
      "name": "木の上の山ぶどう",
      "cost": 25,
      "tags": [
       "木登り"
      ],
      "art": "grapes"
     },
     {
      "name": "焼きたての川魚",
      "cost": 40,
      "tags": [
       "ごちそう"
      ],
      "art": "grilledfish"
     },
     {
      "name": "木の実のスープ",
      "cost": 15,
      "tags": [],
      "art": "cookpot"
     }
    ],
    "surprise": [
     {
      "name": "木の上の秘密基地",
      "cost": 40,
      "tags": [
       "木登り"
      ],
      "art": "treehouse"
     },
     {
      "name": "春のごちそうかご",
      "cost": 35,
      "tags": [
       "ごちそう"
      ],
      "art": "giftbox"
     },
     {
      "name": "冬眠用の毛布",
      "cost": 20,
      "tags": [],
      "art": "blanket"
     },
     {
      "name": "人里の花火見物",
      "cost": 30,
      "tags": [
       "大きな音",
       "人里"
      ],
      "art": "fireworks"
     }
    ]
   }
  },
  {
   "id": "r16",
   "day": 6,
   "time": "朝",
   "clientId": "mitsue",
   "visit": 1,
   "lines": [
    "はじめてのお休みをもらったの！1日だけだけど、出かけたいわ。",
    "いろんな花の蜜を集めて回りたいの。いつもの仕事より、たくさんね。",
    "…この前、花の上でついうとうとして、気づいたら夕方だったけど。",
    "予算はみつのしずく190、1日でお願いね。"
   ],
   "surfaceWish": "花",
   "honneTags": [
    "休む"
   ],
   "dislikeTags": [
    "雨",
    "煙",
    "クモの巣"
   ],
   "budget": {
    "amount": 190,
    "unit": "みつのしずく",
    "duration": "1日"
   },
   "aftermath": {
    "great": "羽がこんなに軽いの、はじめて！明日からまたがんばれるわ。",
    "ok": "たくさんの花を回れたわ。ちょっと疲れちゃったけど。",
    "poor": "花はとってもきれいだった。…でも本当は、何もしないでゆっくり休みたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "一面の花畑",
      "cost": 90,
      "tags": [
       "花"
      ],
      "art": "flowerfield"
     },
     {
      "name": "木かげの静かな野原",
      "cost": 70,
      "tags": [
       "休む"
      ],
      "art": "meadow"
     },
     {
      "name": "雨の多い花の谷",
      "cost": 60,
      "tags": [
       "花",
       "雨"
      ],
      "art": "gorge"
     },
     {
      "name": "森の奥の休み小屋",
      "cost": 80,
      "tags": [
       "休む"
      ],
      "art": "hut"
     }
    ],
    "activity": [
     {
      "name": "花の蜜あつめ大会",
      "cost": 50,
      "tags": [
       "花"
      ],
      "art": "nectar"
     },
     {
      "name": "花びらの上でお昼寝",
      "cost": 30,
      "tags": [
       "休む",
       "花"
      ],
      "art": "beenap"
     },
     {
      "name": "羽のマッサージ",
      "cost": 40,
      "tags": [
       "休む"
      ],
      "art": "aroma"
     },
     {
      "name": "焚き火を囲む会",
      "cost": 30,
      "tags": [
       "煙"
      ],
      "art": "campfire"
     }
    ],
    "food": [
     {
      "name": "百の花のはちみつ",
      "cost": 50,
      "tags": [
       "花"
      ],
      "art": "honey"
     },
     {
      "name": "ゆっくり朝ごはん",
      "cost": 40,
      "tags": [
       "休む"
      ],
      "art": "breakfast"
     },
     {
      "name": "煙の香りのバーベキュー",
      "cost": 40,
      "tags": [
       "煙"
      ],
      "art": "bbq"
     },
     {
      "name": "朝つゆのジュース",
      "cost": 20,
      "tags": [],
      "art": "dewdrop"
     }
    ],
    "surprise": [
     {
      "name": "花の冠",
      "cost": 40,
      "tags": [
       "花"
      ],
      "art": "clover"
     },
     {
      "name": "ふかふかの花びら布団",
      "cost": 50,
      "tags": [
       "休む"
      ],
      "art": "blanket"
     },
     {
      "name": "花束",
      "cost": 30,
      "tags": [
       "花"
      ],
      "art": "bouquet"
     },
     {
      "name": "クモの糸のブランコ",
      "cost": 30,
      "tags": [
       "クモの巣"
      ],
      "art": "spiderweb"
     }
    ]
   }
  },
  {
   "id": "r17",
   "day": 6,
   "time": "昼",
   "clientId": "pururu",
   "visit": 2,
   "regularId": "pururu",
   "profile": "地球が気に入って、また来た旅人",
   "bonusBudget": 15,
   "returnGreeting": {
    "great": "地球のふつうの毎日、星のみんなに大人気でした！",
    "ok": "こんにちは。また地球に来ました。",
    "poor": "今度こそ…。商店街で見た手編みのセーター、ずっと気になっています。"
   },
   "lines": [
    "星の友だちに、地球の珍しいおみやげを持って帰りたいです。",
    "わたしの星では、物はみんな機械が作ります。地球の人の指は器用ですね。",
    "予算は星のかけら100個、地球時間で1日です。"
   ],
   "surfaceWish": "珍しい",
   "honneTags": [
    "手作り"
   ],
   "dislikeTags": [
    "しょっぱい",
    "まぶしい"
   ],
   "budget": {
    "amount": 100,
    "unit": "星のかけら",
    "duration": "地球時間で1日"
   },
   "aftermath": {
    "great": "自分の手で作ったおみやげです！星の友だちも、きっと喜びます。",
    "ok": "珍しいものをたくさん見られました。ありがとう。",
    "poor": "珍しいおみやげが買えました。…でも本当は、自分の手で何か作ってみたかったのです"
   },
   "slots": {
    "destination": [
     {
      "name": "宝石の博物館",
      "cost": 45,
      "tags": [
       "珍しい"
      ],
      "art": "museum"
     },
     {
      "name": "焼き物の里",
      "cost": 30,
      "tags": [
       "手作り"
      ],
      "art": "pottery"
     },
     {
      "name": "不思議な鍾乳洞",
      "cost": 40,
      "tags": [
       "珍しい"
      ],
      "art": "cave"
     },
     {
      "name": "真夏の白い砂浜",
      "cost": 30,
      "tags": [
       "まぶしい"
      ],
      "art": "palmbeach"
     }
    ],
    "activity": [
     {
      "name": "編み物教室",
      "cost": 15,
      "tags": [
       "手作り"
      ],
      "art": "knitting"
     },
     {
      "name": "郷土料理づくり",
      "cost": 25,
      "tags": [
       "手作り"
      ],
      "art": "cookpot"
     },
     {
      "name": "珍しい生き物の水族館",
      "cost": 30,
      "tags": [
       "珍しい"
      ],
      "art": "aquarium"
     },
     {
      "name": "夜のイルミネーション",
      "cost": 25,
      "tags": [
       "まぶしい",
       "珍しい"
      ],
      "art": "lightup"
     }
    ],
    "food": [
     {
      "name": "おにぎりづくり",
      "cost": 10,
      "tags": [
       "手作り"
      ],
      "art": "onigiri"
     },
     {
      "name": "世界の珍味の店",
      "cost": 35,
      "tags": [
       "珍しい"
      ],
      "art": "cloche"
     },
     {
      "name": "塩からい干物",
      "cost": 15,
      "tags": [
       "しょっぱい"
      ],
      "art": "grilledfish"
     },
     {
      "name": "商店街の焼きそば",
      "cost": 10,
      "tags": [],
      "art": "yakisoba"
     }
    ],
    "surprise": [
     {
      "name": "手編みのマフラー",
      "cost": 25,
      "tags": [
       "手作り"
      ],
      "art": "scarf"
     },
     {
      "name": "珍しい色の宝石",
      "cost": 40,
      "tags": [
       "珍しい"
      ],
      "art": "gem"
     },
     {
      "name": "夜空の花火",
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
   "id": "r18",
   "day": 6,
   "time": "夜",
   "clientId": "hoshina",
   "visit": 3,
   "regularId": "hoshina",
   "bonusBudget": 40,
   "becomesRegular": true,
   "returnGreeting": {
    "great": "また来ちゃった！ここの提案、うちの家族の自慢なの。",
    "ok": "こんにちは。今日は大事なお願いなの。",
    "poor": "今度こそ…。この子たち、葉っぱから葉っぱへ少しずつ飛ぶのが好きなの。"
   },
   "lines": [
    "卵からかえった子どもたちが、羽を広げられるようになったの！",
    "遠くの有名な花畑へ…。でもこの子たち、まだ少し飛ぶとすぐ休むの。",
    "予算は花粉270粒、半日でお願い！"
   ],
   "surfaceWish": "遠く",
   "honneTags": [
    "近く",
    "練習"
   ],
   "dislikeTags": [
    "水辺",
    "寒い",
    "鳥"
   ],
   "budget": {
    "amount": 270,
    "unit": "花粉の粒",
    "duration": "半日"
   },
   "aftermath": {
    "great": "子どもたち、少しずつ上手に飛べるようになったの！もう立派ね。",
    "ok": "花畑はきれいだったわ。子どもたちは少し疲れたみたい。",
    "poor": "景色はすばらしかったわ。…でも本当は、近くで子どもたちの飛ぶ練習をしたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "遠くの大きな花畑",
      "cost": 130,
      "tags": [
       "遠く"
      ],
      "art": "flowerfield"
     },
     {
      "name": "雪の残る山の花畑",
      "cost": 120,
      "tags": [
       "遠く",
       "寒い"
      ],
      "art": "mountain"
     },
     {
      "name": "おうちのそばの菜園",
      "cost": 80,
      "tags": [
       "近く"
      ],
      "art": "vegetables"
     },
     {
      "name": "となりの低い花だん",
      "cost": 90,
      "tags": [
       "近く",
       "練習"
      ],
      "art": "flowerbed"
     }
    ],
    "activity": [
     {
      "name": "葉っぱ渡りの練習",
      "cost": 40,
      "tags": [
       "練習",
       "近く"
      ],
      "art": "leafhop"
     },
     {
      "name": "遠くまで競争飛行",
      "cost": 70,
      "tags": [
       "遠く"
      ],
      "art": "mappin"
     },
     {
      "name": "鳥の背中で空の旅",
      "cost": 80,
      "tags": [
       "遠く",
       "鳥"
      ],
      "art": "birdsong"
     },
     {
      "name": "家族で日なたぼっこ",
      "cost": 30,
      "tags": [],
      "art": "leafsun"
     }
    ],
    "food": [
     {
      "name": "遠い国の花の蜜",
      "cost": 80,
      "tags": [
       "遠く"
      ],
      "art": "nectar"
     },
     {
      "name": "近くの畑のアブラムシ",
      "cost": 60,
      "tags": [
       "近く"
      ],
      "art": "aphids"
     },
     {
      "name": "雲の上のピクニック",
      "cost": 70,
      "tags": [
       "遠く",
       "寒い"
      ],
      "art": "picnic"
     },
     {
      "name": "朝つゆのジュース",
      "cost": 30,
      "tags": [],
      "art": "dewdrop"
     }
    ],
    "surprise": [
     {
      "name": "遠くの景色の写真集",
      "cost": 50,
      "tags": [
       "遠く"
      ],
      "art": "photobook"
     },
     {
      "name": "初飛行のメダル",
      "cost": 40,
      "tags": [
       "練習"
      ],
      "art": "medal"
     },
     {
      "name": "家族の記念写真",
      "cost": 50,
      "tags": [],
      "art": "camera"
     },
     {
      "name": "小鳥のお迎え",
      "cost": 60,
      "tags": [
       "鳥"
      ],
      "art": "birdphoto"
     }
    ]
   }
  },
  {
   "id": "r19",
   "day": 7,
   "time": "朝",
   "clientId": "fuwari",
   "visit": 1,
   "lines": [
    "孫たちがずいぶん大きくなってね。みんなで夜のお出かけがしたいの。",
    "若い子は、にぎやかな遊び場のほうが喜ぶのかしらねえ。",
    "わたしの若いころは、まんまるの月の夜に、みんなでお餅をついたものよ。",
    "予算はにんじん110本、ひと晩でお願いね。"
   ],
   "surfaceWish": "遊び",
   "honneTags": [
    "月",
    "お餅"
   ],
   "dislikeTags": [
    "キツネ",
    "大きな音",
    "水ぬれ"
   ],
   "budget": {
    "amount": 110,
    "unit": "にんじん",
    "duration": "ひと晩"
   },
   "aftermath": {
    "great": "孫たちと、昔みたいな夜を過ごせたわ。最高のひと晩よ！",
    "ok": "孫たちは楽しそうだったわ。少しにぎやかすぎたけどね。",
    "poor": "孫たちは楽しそうだったわ。…でも本当は、みんなで月を見ながらお餅をつきたかったの"
   },
   "slots": {
    "destination": [
     {
      "name": "夜の遊園地",
      "cost": 60,
      "tags": [
       "遊び",
       "大きな音"
      ],
      "art": "ferriswheel"
     },
     {
      "name": "満月の見える丘",
      "cost": 40,
      "tags": [
       "月"
      ],
      "art": "moonhill"
     },
     {
      "name": "森のアスレチック",
      "cost": 35,
      "tags": [
       "遊び"
      ],
      "art": "climbing"
     },
     {
      "name": "川辺のキャンプ場",
      "cost": 30,
      "tags": [
       "水ぬれ"
      ],
      "art": "tent"
     }
    ],
    "activity": [
     {
      "name": "昔ながらの餅つき",
      "cost": 25,
      "tags": [
       "お餅"
      ],
      "art": "mochitsuki"
     },
     {
      "name": "お月見の夜さんぽ",
      "cost": 15,
      "tags": [
       "月"
      ],
      "art": "nightgarden"
     },
     {
      "name": "川で水あそび",
      "cost": 20,
      "tags": [
       "遊び",
       "水ぬれ"
      ],
      "art": "splash"
     },
     {
      "name": "キツネと宝さがし",
      "cost": 25,
      "tags": [
       "遊び",
       "キツネ"
      ],
      "art": "treasuremap"
     }
    ],
    "food": [
     {
      "name": "お月見だんご",
      "cost": 25,
      "tags": [
       "月",
       "お餅"
      ],
      "art": "dango"
     },
     {
      "name": "遊園地のポップコーン",
      "cost": 20,
      "tags": [
       "遊び"
      ],
      "art": "popcorn"
     },
     {
      "name": "山盛りの野菜",
      "cost": 15,
      "tags": [],
      "art": "vegetables"
     },
     {
      "name": "にんじんのケーキ",
      "cost": 30,
      "tags": [],
      "art": "cake"
     }
    ],
    "surprise": [
     {
      "name": "打ち上げ花火",
      "cost": 30,
      "tags": [
       "遊び",
       "大きな音"
      ],
      "art": "fireworks"
     },
     {
      "name": "月の形のランタン",
      "cost": 20,
      "tags": [
       "月"
      ],
      "art": "lantern"
     },
     {
      "name": "孫たちと記念写真",
      "cost": 20,
      "tags": [],
      "art": "camera"
     },
     {
      "name": "風船のプレゼント",
      "cost": 25,
      "tags": [
       "遊び"
      ],
      "art": "balloons"
     }
    ]
   }
  },
  {
   "id": "r20",
   "day": 7,
   "time": "昼",
   "clientId": "kumada",
   "visit": 3,
   "regularId": "kumada",
   "bonusBudget": 25,
   "becomesRegular": true,
   "returnGreeting": {
    "great": "また来たよ！この子が「あのお店がいい」って聞かなくてな。",
    "ok": "やあ。今日もよろしくたのむよ。",
    "poor": "今度こそ…。この子、ぼくと同じことをするのが一番うれしいらしい。"
   },
   "lines": [
    "この子がもうすぐ2歳なんだ。誕生日に、うんと特別な体験をさせたい。",
    "この子、ぼくのまねばかりするんだ。昼寝のかっこうまでそっくりでな。",
    "予算はどんぐり160個、3日間でたのむよ。"
   ],
   "surfaceWish": "特別",
   "honneTags": [
    "いっしょ",
    "おそろい"
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
    "great": "この子とずっと同じことをして笑ってたよ。いい誕生日だ！",
    "ok": "特別な体験に、この子も目を丸くしてたよ。",
    "poor": "特別な一日だったよ。…でも本当は、この子と同じことをして過ごしたかったんだ"
   },
   "slots": {
    "destination": [
     {
      "name": "秘密の滝つぼ",
      "cost": 70,
      "tags": [
       "特別"
      ],
      "art": "waterfall"
     },
     {
      "name": "火山の温泉",
      "cost": 80,
      "tags": [
       "特別",
       "暑い"
      ],
      "art": "volcano"
     },
     {
      "name": "親子で昼寝の丘",
      "cost": 50,
      "tags": [
       "いっしょ"
      ],
      "art": "naphill"
     },
     {
      "name": "親子の釣り場の川",
      "cost": 60,
      "tags": [
       "いっしょ"
      ],
      "art": "salmonriver"
     }
    ],
    "activity": [
     {
      "name": "熱気球の空の旅",
      "cost": 60,
      "tags": [
       "特別"
      ],
      "art": "balloons"
     },
     {
      "name": "親子で魚とり",
      "cost": 20,
      "tags": [
       "いっしょ"
      ],
      "art": "fish"
     },
     {
      "name": "おそろいで昼寝",
      "cost": 15,
      "tags": [
       "いっしょ",
       "おそろい"
      ],
      "art": "pairnap"
     },
     {
      "name": "人里の大花火",
      "cost": 30,
      "tags": [
       "特別",
       "大きな音",
       "人里"
      ],
      "art": "fireworks"
     }
    ],
    "food": [
     {
      "name": "誕生日の特大ケーキ",
      "cost": 40,
      "tags": [
       "特別"
      ],
      "art": "cake"
     },
     {
      "name": "鮭を半分こ",
      "cost": 30,
      "tags": [
       "いっしょ"
      ],
      "art": "grilledfish"
     },
     {
      "name": "人里のごちそう",
      "cost": 50,
      "tags": [
       "特別",
       "人里"
      ],
      "art": "buffet"
     },
     {
      "name": "山ぶどう",
      "cost": 15,
      "tags": [],
      "art": "grapes"
     }
    ],
    "surprise": [
     {
      "name": "おそろいの帽子",
      "cost": 30,
      "tags": [
       "おそろい"
      ],
      "art": "caps"
     },
     {
      "name": "金色のメダル",
      "cost": 40,
      "tags": [
       "特別"
      ],
      "art": "medal"
     },
     {
      "name": "太鼓の演奏会",
      "cost": 30,
      "tags": [
       "特別",
       "大きな音"
      ],
      "art": "drum"
     },
     {
      "name": "手作りの釣り竿",
      "cost": 25,
      "tags": [
       "いっしょ"
      ],
      "art": "fishingrod"
     }
    ]
   }
  },
  {
   "id": "r21",
   "day": 7,
   "time": "夜",
   "clientId": "miru",
   "visit": 1,
   "lines": [
    "地球の調査に来た研究者です。今日が最後の調査日なのです。",
    "地球でいちばん新しい技術を見て、星に報告したいのです。",
    "わたしの星はとても静か。昨日、公園で聞いた鼻歌が耳から離れません。",
    "予算は月の石100個、地球時間で半日です。"
   ],
   "surfaceWish": "最新",
   "honneTags": [
    "音楽"
   ],
   "dislikeTags": [
    "強いにおい",
    "ゆれる乗り物"
   ],
   "budget": {
    "amount": 100,
    "unit": "月の石",
    "duration": "地球時間で半日"
   },
   "aftermath": {
    "great": "地球の音楽、すばらしい！星のみんなに歌って聞かせます。",
    "ok": "新しい技術をたくさん見ました。報告書が書けそうです。",
    "poor": "新しい技術はすごかったです。…でも本当は、地球の音楽をもっと聞いてみたかったのです"
   },
   "slots": {
    "destination": [
     {
      "name": "最新のロボット工場",
      "cost": 45,
      "tags": [
       "最新"
      ],
      "art": "robot"
     },
     {
      "name": "未来の科学館",
      "cost": 40,
      "tags": [
       "最新"
      ],
      "art": "museum"
     },
     {
      "name": "森の野外音楽祭",
      "cost": 35,
      "tags": [
       "音楽"
      ],
      "art": "guitar"
     },
     {
      "name": "魚市場の見学",
      "cost": 20,
      "tags": [
       "強いにおい"
      ],
      "art": "fishmarket"
     }
    ],
    "activity": [
     {
      "name": "最新のゲーム体験",
      "cost": 25,
      "tags": [
       "最新"
      ],
      "art": "gamepad"
     },
     {
      "name": "自動運転のバス",
      "cost": 20,
      "tags": [
       "最新",
       "ゆれる乗り物"
      ],
      "art": "bus"
     },
     {
      "name": "楽器づくり体験",
      "cost": 20,
      "tags": [
       "音楽"
      ],
      "art": "drum"
     },
     {
      "name": "子どもたちの合唱会",
      "cost": 15,
      "tags": [
       "音楽"
      ],
      "art": "music"
     }
    ],
    "food": [
     {
      "name": "ロボットの料理店",
      "cost": 30,
      "tags": [
       "最新"
      ],
      "art": "robot"
     },
     {
      "name": "にんにく焼肉",
      "cost": 25,
      "tags": [
       "強いにおい"
      ],
      "art": "yakiniku"
     },
     {
      "name": "歌声の聞こえる食堂",
      "cost": 20,
      "tags": [
       "音楽"
      ],
      "art": "singingdiner"
     },
     {
      "name": "公園でおにぎり",
      "cost": 10,
      "tags": [],
      "art": "onigiri"
     }
    ],
    "surprise": [
     {
      "name": "最新のスマート時計",
      "cost": 35,
      "tags": [
       "最新"
      ],
      "art": "watch"
     },
     {
      "name": "手回しのオルゴール",
      "cost": 25,
      "tags": [
       "音楽"
      ],
      "art": "musicbox"
     },
     {
      "name": "遊覧船のチケット",
      "cost": 20,
      "tags": [
       "ゆれる乗り物"
      ],
      "art": "ship"
     },
     {
      "name": "ご当地のおみやげ",
      "cost": 15,
      "tags": [],
      "art": "giftbox"
     }
    ]
   }
  }
 ]
};
