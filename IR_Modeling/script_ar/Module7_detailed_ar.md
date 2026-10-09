# النص التفصيلي للوحدة السابعة: اعتبارات التنفيذ العملي (Practical Implementation Considerations)

**المدة التقريبية:** حوالي 1,850 كلمة، أي نحو 15 دقيقة نطق بإيقاع هادئ (قابلة للتقسيم إلى جزأين)
**الشرائح المصاحبة:** IR_Module7_Implementation.pptx (13 شريحة، بالإنجليزية) ·  **الأسلوب:** مصرية مهذّبة وواضحة بصوت المعلّم، والمصطلحات التقنية بالإنجليزية كما هي في الشرائح مع شرحها بالعربية
**ملحوظة:** الشرائح باتجاه اليسار لليمين، فالصندوق الأصفر على اليمين أو تحت المحتوى.
**علامات القراءة:** `‖` وقفة قصيرة · `‖‖` وقفة أطول (استنى الشريحة تتحرك) · *[بين قوسين]* تعليمات أداء، مش بتتقال

---

## الشريحة 1: Practical Implementation Considerations

أهلاً بيكم في الوحدة السابعة والأخيرة. ‖ اتعلّمنا الفهرسة، والنماذج اللفظية، والاحتمالية، والعصبية، والتقويم. ‖ دلوقتي السؤال الهندسي: ‖ إزاي نجمّع كل ده في نظام حقيقي، ‖ بيخدم ملايين المستخدمين، ‖ وبيجاوب في أجزاء من الثانية، ‖ وما بيقعش؟ ‖‖
*[أشّر على العنوان]* ‖ عنوان الوحدة: «Practical Implementation Considerations»، ‖ اعتبارات التنفيذ العملي. ‖ وتحته: «Architecture, scale, freshness and operations»، ‖ المعمارية، والتوسّع، والحداثة، والتشغيل. ‖‖
ومن غير كود ومن غير أسماء منتجات معيّنة، ‖ هنركّز على المبادئ اللي بتتكرر في أي نظام.

## الشريحة 2: Learning objectives

*[انتظر ظهور الأهداف]*
أربع أهداف.‖‖
*[الأول]* ‖ «Design a multi-stage ranking architecture ‖ and justify each stage». ‖ تصمّم معمارية ترتيب متعددة المراحل، ‖ وتبرّر كل مرحلة.‖‖
*[التاني]* ‖ «Explain sharding, replication, caching and tail latency». ‖ تشرح التقسيم، والنسخ المتماثل، والتخزين المؤقت، ‖ وزمن الاستجابة الذيلي.‖‖
*[التالت]* ‖ «Describe approximate nearest neighbor search ‖ and the recall-speed trade-off». ‖ تصف البحث التقريبي عن أقرب الجيران، ‖ والمفاضلة بين الاستدعاء والسرعة.‖‖
*[الرابع]* ‖ «Plan for freshness, learning to rank، ‖ monitoring and responsible use». ‖ تخطّط للحداثة، والتعلّم للترتيب، ‖ والمراقبة، والاستخدام المسؤول.

## الشريحة 3: Multi-stage ranking

*[رسم قمع بأربع مراحل]*
أهم فكرة في المعمارية: ‖ الترتيب على مراحل. ‖ الرسم على شكل قمع، funnel، ‖ بيضيق من فوق لتحت.‖‖
*[المرحلة الأولى: Candidate generation]* ‖ توليد المرشّحين. ‖ العدد: «billions to thousands»، ‖ من المليارات إلى الآلاف. ‖ والوصف: «Cheap, high-recall retrieval: ‖ inverted index and dense search». ‖ استرجاع رخيص عالي الاستدعاء: ‖ الفهرس المقلوب والبحث الكثيف. ‖ هنا الهدف إننا ما نفوّتش وثيقة مفيدة، ‖ حتى لو جبنا معاها وثائق كتير مش مفيدة.‖‖
*[المرحلة التانية: Lightweight ranker]* ‖ المرتّب الخفيف. ‖ من الآلاف للمئات. ‖ «Fast learned model over simple features»، ‖ نموذج متعلّم سريع على خصائص بسيطة.‖‖
*[المرحلة التالتة: Heavy reranker]* ‖ المرتّب الثقيل. ‖ من المئات للعشرات. ‖ «Expensive neural model on a short list»، ‖ نموذج عصبي مكلف على قايمة قصيرة. ‖ ودي مكان المرمّز المتقاطع من الوحدة الخامسة.‖‖
*[المرحلة الرابعة: Final assembly]* ‖ التجميع النهائي. ‖ العدد: «tens of results»، عشرات النتايج. ‖ «Diversity, business rules, snippets»، ‖ تنويع، وقواعد عمل، ومقتطفات.‖‖
*[أشّر على الصندوق الأصفر: Why stages?]* ‖ ولية مراحل؟ ‖ «Cost per document rises with model power، ‖ so apply expensive models only ‖ to the few candidates that survive cheaper stages». ‖ تكلفة الوثيقة بتزيد مع قوة النموذج، ‖ فبنطبّق النماذج المكلفة بس ‖ على القلة اللي نجت من المراحل الأرخص. ‖ زي مقابلات التوظيف: ‖ فرز الـ CV بسرعة لآلاف، ‖ بعدين مقابلة قصيرة لمئات، ‖ بعدين مقابلة معمّقة لعشرة.

## الشريحة 4: A latency budget (illustrative)

*[جدول من خمس صفوف]*
الفكرة دي محتاجة ميزانية زمن. ‖ والجدول بيورّي مثال توضيحي.‖‖
*[الصف الأول: Query understanding]* ‖ فهم الاستعلام: ‖ عشرة ميلّي ثانية. ‖ للتصحيح الإملائي، والنية، والمرشّحات.‖‖
*[الصف التاني: Candidate generation]* ‖ توليد المرشّحين: ‖ تلاتين ميلّي ثانية. ‖ للاسترجاع اللفظي والكثيف عبر كل الشظايا.‖‖
*[الصف التالت: Reranking]* ‖ إعادة الترتيب: ‖ خمسين ميلّي ثانية. ‖ للتقييم العصبي لقايمة قصيرة.‖‖
*[الصف الرابع: Assembly]* ‖ التجميع: ‖ عشرة ميلّي ثانية. ‖ للمقتطفات وتنسيق النتايج.‖‖
*[الصف الخامس: Total]* ‖ الإجمالي: ‖ مية ميلّي ثانية. ‖ هدف لمعظم الحركة.‖‖
*[أشّر على الصندوق الأصفر: Reading it]* ‖ والدرس: ‖ «Quality gains are bought with latency. ‖ A larger reranker is only affordable ‖ if earlier stages shrink the candidate list». ‖ مكاسب الجودة بتتشرى بالزمن. ‖ مرتّب أكبر مش متاح ‖ إلا لو المراحل الأسبق قلّلت قايمة المرشّحين. ‖ وفكّروا في نفس المنطق ‖ في ميزانية أي مشروع: ‖ لو كل مرحلة بتاخد وقت، ‖ لازم نتفاوض عليها.

## الشريحة 5: Scaling out: sharding and replication

*[أربع نقاط وصندوق]*
مجموعة بحجم مليارات الوثائق ‖ ما بتتخزّنش في جهاز واحد. ‖ فازاي بنوزّعها؟‖‖
*[النقطة الأولى: Sharding]* ‖ التقسيم، sharding. ‖ «Split the collection into partitions ‖ held on different machines. ‖ Each query fans out to every shard». ‖ نقسّم المجموعة لأجزاء على أجهزة مختلفة. ‖ وكل استعلام بينتشر على كل جزء. ‖ والجزء ده بنسمّيه shard، «شظية».‖‖
*[النقطة التانية: Merge]* ‖ الدمج. ‖ «Every shard returns its local top k، ‖ and a broker merges them into the global top k». ‖ كل شظية بترجّع أفضل k عندها، ‖ ووسيط، broker، بيدمجهم في أفضل k عالمية. ‖ لو عايزين أفضل عشرة، ‖ كل شظية بترجّع عشرة، ‖ والوسيط بيختار الأفضل عشرة من المجموع.‖‖
*[النقطة التالتة: Replication]* ‖ النسخ المتماثل. ‖ «Keep several copies of each shard ‖ to raise throughput and survive failures». ‖ نحتفظ بعدة نسخ من كل شظية، ‖ لرفع الإنتاجية والنجاة من الأعطال.‖‖
*[النقطة الرابعة: Tail latency]* ‖ زمن الاستجابة الذيلي. ‖ «The slowest shard sets the response time، ‖ so rare slowness is multiplied across many shards». ‖ أبطأ شظية هي اللي بتحدّد زمن الاستجابة، ‖ فالبطء النادر بيتضاعف عبر شظايا كتير. ‖ لو كل شظية بتبطّئ في واحد في المية من الحالات، ‖ ولدينا مية شظية، ‖ فاحتمال إن استعلام يصادف شظية بطيئة كبير جدًا، ‖ حوالي 63 في المية.‖‖
*[أشّر على الصندوق الأصفر: Two axes]* ‖ ومحورين مختلفين: ‖ «Sharding scales data size، ‖ replication scales query volume and availability. ‖ They solve different problems». ‖ التقسيم بيوسّع حجم البيانات، ‖ والنسخ بيوسّع حجم الاستعلامات والإتاحة. ‖ يعني بيحلّوا مشكلتين مختلفتين. ‖ وده جواب سؤال «Check yourself» في آخر الوحدة.

## الشريحة 6: Caching

*[أربع نقاط وصندوق]*
أرخص طريقة لتحسين الأداء: ‖ ما نعيدش الشغل.‖‖
*[النقطة الأولى: Skewed demand]* ‖ طلب غير متساوي. ‖ «A small share of queries ‖ accounts for a large share of traffic، ‖ so repeated work is common». ‖ نسبة قليلة من الاستعلامات ‖ بتمثّل نسبة كبيرة من الحركة، ‖ فالشغل المتكرّر شائع. ‖ ودي حقيقة معروفة: ‖ «أحوال الطقس» و«نتيجة المباراة» ‖ بتتسأل آلاف المرات في الدقيقة.‖‖
*[النقطة التانية: Result cache]* ‖ تخزين النتايج. ‖ «Store final results for popular queries ‖ and skip the pipeline». ‖ نخزّن النتايج النهائية للاستعلامات الشائعة، ‖ ونتخطّى المسار كله.‖‖
*[النقطة التالتة: List cache]* ‖ تخزين القوايم. ‖ «Keep hot postings or vectors in memory ‖ so disk reads are avoided». ‖ نحتفظ بالقوايم أو المتجهات الساخنة في الذاكرة، ‖ فنتجنّب القراءة من القرص.‖‖
*[النقطة الرابعة: Staleness]* ‖ البلى. ‖ «Cached answers can be out of date، ‖ so set expiry according to how fast content changes». ‖ الإجابات المخزّنة ممكن تبقى قديمة، ‖ فحدّد مدّة الصلاحية حسب سرعة تغيّر المحتوى.‖‖
*[أشّر على الصندوق الأصفر: Trade-off]* ‖ والمقايضة: ‖ «Caching is the cheapest way to cut cost and latency، ‖ but it complicates evaluation، ‖ since logged results may come from the cache». ‖ التخزين المؤقت أرخص طريقة لتقليل التكلفة والزمن، ‖ لكنه بيعقّد التقويم، ‖ لأن النتايج المسجّلة ممكن تكون جاية من المخزّن.

## الشريحة 7: Approximate nearest neighbor search

*[بطاقتين وصندوق]*
في الوحدة الخامسة قلنا إن البحث الكثيف بيعتمد على أقرب الجيران. ‖ لكن كيف بنلاقيهم بسرعة؟‖‖
*[البطاقة الأولى: Exact search]* ‖ البحث الدقيق. ‖ «Compare the query with every vector»، ‖ نقارن الاستعلام بكل متجه. ‖ «Cost grows with collection size and dimension»، ‖ والتكلفة بتزيد مع حجم المجموعة والأبعاد. ‖ «Perfect recall»، ‖ استدعاء كامل. ‖ لو عندنا مليار متجه بخمسمية بعد، ‖ ده خمسمية مليار عملية ضرب لكل استعلام.‖‖
*[البطاقة التانية: Approximate search]* ‖ البحث التقريبي. ‖ «Use graphs, clusters or compressed vectors»، ‖ بنستخدم رسوم بيانية، أو عناقيد، أو متجهات مضغوطة. ‖ «Examine a small fraction of candidates»، ‖ نفحص كسر صغير من المرشّحين. ‖ «Slightly lower recall, far faster»، ‖ استدعاء أقل شوية، وأسرع بكتير.‖‖
*[أشّر على الصندوق الأصفر: Three-way budget]* ‖ وعنوانه: «Three-way budget: recall, latency, memory»، ‖ ميزانية تلاتية: الاستدعاء، والزمن، والذاكرة. ‖ «Tune the search depth until recall of the true neighbors ‖ is acceptable at the latency and memory budget». ‖ اضبط عمق البحث لحد ما استدعاء الجيران الحقيقيين ‖ يبقى مقبول في حدود ميزانية الزمن والذاكرة. ‖ «Measure end-to-end relevance، ‖ since small recall losses often barely move final quality». ‖ وقيس الصلة من الطرف للطرف، ‖ لأن خسائر الاستدعاء الصغيرة غالبًا ما بتحرّكش الجودة النهائية. ‖ يعني ممكن نفوّت جار حقيقي رقم 8 ‖ من بين العشرة، ‖ والمستخدم ما يحسّش.

## الشريحة 8: Query processing shortcuts

*[أربع نقاط]*
حتى مع الفهرس المقلوب، ‖ فيه اختصارات ذكية لتسريع الاستعلام.‖‖
*[النقطة الأولى: Early termination]* ‖ الإنهاء المبكر. ‖ «Stop reading a postings list ‖ once remaining documents cannot reach the current top k». ‖ نوقف قراءة قايمة ‖ لما الوثائق المتبقية مش هتوصل لأفضل k الحالية.‖‖
*[النقطة التانية: Tiered indexes]* ‖ الفهارس المتدرّجة. ‖ «Search a small, high-quality tier first ‖ and consult larger tiers only if needed». ‖ نبحث في طبقة صغيرة عالية الجودة الأول، ‖ ونرجع للطبقات الأكبر لو احتجنا.‖‖
*[النقطة التالتة: Static quality scores]* ‖ درجات الجودة الثابتة. ‖ «Order postings by a precomputed quality value ‖ so the best candidates come first». ‖ نرتّب القوايم بقيمة جودة محسوبة مسبقًا، ‖ فأفضل المرشّحين يجوا الأول.‖‖
*[النقطة الرابعة: Risk]* ‖ والخطر. ‖ «Shortcuts can miss results، ‖ so measure the effect on relevance, not only on speed». ‖ الاختصارات ممكن تفوّت نتايج، ‖ فقيس أثرها على الصلة، مش بس على السرعة.

## الشريحة 9: Keeping the index fresh

*[أربع بطاقات مرقّمة]*
الوثائق الجديدة بتيجي طول الوقت. ‖ إزاي نحدّث الفهرس من غير ما نعيد بناءه كله؟‖‖
*[الخطوة 1: Buffer]* ‖ التخزين المؤقت. ‖ «New documents go into a small in-memory structure ‖ and become searchable quickly». ‖ الوثائق الجديدة بتدخل هيكل صغير في الذاكرة، ‖ وبتبقى قابلة للبحث بسرعة.‖‖
*[الخطوة 2: Flush]* ‖ التفريغ. ‖ «Periodically write the buffer as an immutable segment». ‖ كل فترة نكتب المخزّن كـ«قطعة» ثابتة، immutable segment.‖‖
*[الخطوة 3: Merge]* ‖ الدمج. ‖ «Combine small segments into larger ones in the background». ‖ ندمج القطع الصغيرة في أكبر، في الخلفية.‖‖
*[الخطوة 4: Delete]* ‖ الحذف. ‖ «Mark removed documents with tombstones ‖ and drop them when segments merge». ‖ نعلّم الوثائق المحذوفة بـ«شواهد قبور»، tombstones، ‖ ونتخلّص منها لما القطع تندمج.‖‖
*[أشّر على الصندوق الأصفر: Why immutable segments?]* ‖ ولية القطع الثابتة؟ ‖ «Never editing a written segment ‖ avoids locks and makes readers simple and fast. ‖ Cost is background merge work». ‖ عدم تعديل قطعة اتكتبت ‖ بيتجنّب الأقفال وبيخلّي القرّاء بسيطين وسريعين. ‖ والتكلفة هي شغل الدمج في الخلفية. ‖ وده شبيه بأنظمة قواعد بيانات كتير ‖ بتستخدم فكرة «الكتابة بالإلحاق فقط».

## الشريحة 10: Understanding the query

*[أربع نقاط]*
الاستعلام نفسه بيحتاج معالجة ذكية.‖‖
*[النقطة الأولى: Cleanup]* ‖ التنظيف. ‖ «Spelling correction, normalization and handling of abbreviations»، ‖ تصحيح إملائي، وتطبيع، ومعالجة الاختصارات.‖‖
*[النقطة التانية: Expansion]* ‖ التوسيع. ‖ «Add synonyms or related terms ‖ to reduce vocabulary mismatch, at the risk of drift». ‖ نضيف مترادفات أو مصطلحات مرتبطة ‖ لتقليل عدم تطابق المفردات، ‖ مع خطر الانجراف، drift، ‖ يعني ينحرف معنى الاستعلام عن قصد المستخدم.‖‖
*[النقطة التالتة: Intent]* ‖ النية. ‖ «Classify the need: navigate, find facts, shop، ‖ and choose filters or result types». ‖ نصنّف الحاجة: تنقّل، أو بحث عن حقايق، أو تسوّق، ‖ ونختار المرشّحات أو أنواع النتايج.‖‖
*[النقطة الرابعة: Context]* ‖ السياق. ‖ «Language, location and session history ‖ can disambiguate queries like jaguar speed». ‖ اللغة والمكان وتاريخ الجلسة ‖ ممكن تفكّ التباس استعلامات زي jaguar speed. ‖ تفتكروا المثال بتاع الوحدة الأولى؟ ‖ أهو السياق هو اللي بيحلّه.

## الشريحة 11: Learning to rank

*[أربع نقاط وصندوق]*
وصلنا لمكوّن مهم في المرتّب الخفيف: ‖ التعلّم للترتيب، Learning to Rank.‖‖
*[النقطة الأولى: Features]* ‖ الخصائص. ‖ «Combine signals such as BM25, dense similarity، ‖ freshness, popularity and quality ‖ into a feature vector». ‖ نجمع إشارات، زي BM25، والتشابه الكثيف، ‖ والحداثة، والشعبية، والجودة، ‖ في متجه خصائص.‖‖
*[النقطة التانية: Training]* ‖ التدريب. ‖ «Fit a model on judged or click-derived data». ‖ نضبط نموذج على بيانات محكومة أو مشتقّة من النقرات. ‖ «Pointwise models score items، ‖ pairwise models order pairs، ‖ listwise models optimize the list». ‖ النماذج النقطية بتقيّم عناصر منفردة، ‖ والزوجية بتفاضل بين أزواج، ‖ والقائمية بتحسّن القايمة كلها.‖‖
*[النقطة التالتة: Benefit]* ‖ الفايدة. ‖ «Weights are learned rather than hand-set، ‖ and new signals are easy to add». ‖ الأوزان بتتعلّم مش بتتحط يدويًا، ‖ وإضافة إشارات جديدة سهلة.‖‖
*[النقطة الرابعة: Risk]* ‖ الخطر. ‖ «The model inherits bias and noise from its labels، ‖ and needs retraining as content drifts». ‖ النموذج بيورّث التحيّز والضجيج من تعليماته، ‖ ويحتاج إعادة تدريب لما المحتوى يتغيّر.‖‖
*[أشّر على الصندوق الأصفر: Where it fits]* ‖ ومكانه: ‖ «Learned rankers usually sit in the second stage، ‖ where features are cheap to compute ‖ for a few thousand candidates». ‖ المرتّبات المتعلّمة غالبًا في المرحلة التانية، ‖ حيث الخصائص رخيصة الحساب ‖ لبضعة آلاف من المرشّحين.

## الشريحة 12: Operating the system

*[تلات بطاقات]*
والنظام اللي اتبنى لازم يتشغّل ويتراقب.‖‖
*[البطاقة الأولى: Measure]* ‖ القياس. ‖ «Offline metrics on fixed judgments»، ‖ مقاييس غير متصلة على أحكام ثابتة. ‖ «A/B tests for launches»، ‖ اختبارات A/B للإطلاقات. ‖ «Latency and error budgets»، ‖ وميزانيات الزمن والأخطاء.‖‖
*[البطاقة التانية: Monitor]* ‖ المراقبة. ‖ «Zero-result queries»، ‖ الاستعلامات اللي ما رجّعتش نتايج، ‖ وده مؤشر ممتاز لفجوات في النظام. ‖ «Click patterns and quality drift»، ‖ أنماط النقر وانجراف الجودة. ‖ و«Index freshness»، حداثة الفهرس.‖‖
*[البطاقة التالتة: Act responsibly]* ‖ التصرّف بمسؤولية. ‖ «Audit bias and fairness»، ‖ راجع التحيّز والعدالة. ‖ «Protect user privacy in logs»، ‖ احمِ خصوصية المستخدم في السجلات. ‖ «Provide ways to report problems»، ‖ وفّر طرقًا للإبلاغ عن المشاكل.‖‖
*[أشّر على الصندوق الأصفر: Lifecycle thinking]* ‖ والتفكير في دورة الحياة: ‖ «Retrieval quality decays as content and language change. ‖ Treat evaluation and monitoring ‖ as permanent parts of the system». ‖ جودة الاسترجاع بتتدهور مع تغيّر المحتوى واللغة. ‖ فاعتبروا التقويم والمراقبة أجزاء دايمة من النظام.

## الشريحة 13: Key takeaways

*[أربع نقاط]*
آخر مراجعة في السلسلة.‖‖
*[الأولى]* ‖ استخدم توليد مرشّحين رخيص عالي الاستدعاء، ‖ ثم مرتّبات أقوى تدريجيًا على مجموعات أصغر.‖‖
*[التانية]* ‖ قسّم لحجم البيانات، وانسخ للحمل، وخزّن مؤقتًا للطلب المتفاوت، ‖ وراقب زمن الاستجابة الذيلي.‖‖
*[التالتة]* ‖ البحث التقريبي عن الجيران بيضحّي باستدعاء صغير ‖ لمكاسب كبيرة في السرعة والذاكرة.‖‖
*[الرابعة]* ‖ القطع الثابتة، والتعلّم للترتيب، والمراقبة المستمرة ‖ بتحافظ على الجودة مع الوقت.‖‖
*[أشّر على اللوحة: Up next]* ‖ والخطوة التالية: ‖ «Revisit Module 1 and map each stage of your own system ‖ to the three design questions». ‖ ارجعوا للوحدة الأولى، ‖ وطابقوا كل مرحلة في نظامكم ‖ على الأسئلة التصميمية التلاتة.‖‖
*[أشّر على Check yourself]* ‖ وسؤال أخير: ‖ «Which problem does replication solve ‖ that sharding does not؟» ‖ أي مشكلة بيحلّها النسخ ‖ ولا يحلّها التقسيم؟ ‖ الإجابة: ‖ حجم الاستعلامات والإتاحة.‖‖
*[ابتسم، وخاتمة السلسلة]* ‖ وبكده وصلنا لنهاية السلسلة. ‖ اتعلّمنا إن استرجاع المعلومات ‖ مش خوارزمية واحدة، ‖ لكن سلسلة قرارات: ‖ إزاي نمثّل النص، ونقيّم الصلة، ونقيس الجودة، ونبني نظام يتحمّل. ‖ ومع كل قرار، مقايضة بين دقة وسرعة وتكلفة. ‖ أتمنّى إن السلسلة دي تكون ساعدتكم ‖ تفهموا اللي ورا الستار في كل مرة بتبحثوا فيها. ‖ شكرًا لكم، وبالتوفيق.
