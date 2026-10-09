# النص التفصيلي للوحدة الرابعة: النماذج الاحتمالية للاسترجاع (Probabilistic Retrieval Models)

**المدة التقريبية:** حوالي 2,071 كلمة، أي نحو 17 دقيقة نطق بإيقاع هادئ (قابلة للتقسيم إلى جزأين)
**الشرائح المصاحبة:** IR_Module4_Probabilistic.pptx (13 شريحة، بالإنجليزية) ·  **الأسلوب:** مصرية مهذّبة وواضحة بصوت المعلّم، والمصطلحات التقنية بالإنجليزية كما هي في الشرائح مع شرحها بالعربية
**ملحوظة:** الشرائح باتجاه اليسار لليمين، فالصندوق الأصفر على اليمين أو تحت المحتوى.
**علامات القراءة:** `‖` وقفة قصيرة · `‖‖` وقفة أطول (استنى الشريحة تتحرك) · *[بين قوسين]* تعليمات أداء، مش بتتقال

---

## الشريحة 1: Probabilistic Retrieval Models

أهلاً بيكم في الوحدة الرابعة. ‖ في الوحدة اللي فاتت اتعلّمنا TF-IDF والنموذج المتجهي، ‖ وكانت فكرتهم ذكية لكنها تقديرية، heuristic: ‖ يعني اخترنا المعادلة لأنها بتشتغل، ‖ مش لأننا اشتقّيناها من مبدأ واضح. ‖ النهارده هنسأل سؤال أعمق: ‖ إيه المبدأ النظري اللي المفروض نرتّب على أساسه؟ ‖ وإزاي بيوصّلنا لأقوى دالة تقييم نصية عملية: BM25؟ ‖‖
*[أشّر على العنوان]* ‖ عنوان الوحدة: «Probabilistic Retrieval Models»، ‖ النماذج الاحتمالية للاسترجاع. ‖ وتحته: «Ranking principle, BM25 and language models»، ‖ مبدأ الترتيب، وBM25، ونماذج اللغة. ‖‖
الوحدة دي فيها شوية معادلات، ‖ لكن ما تقلقوش: ‖ هنفهمها بالأرقام والأمثلة، ‖ ومن غير إثباتات رياضية معقّدة.

## الشريحة 2: Learning objectives

*[انتظر ظهور الأهداف]*
أربع أهداف.‖‖
*[الأول]* ‖ «State the probability ranking principle ‖ and the assumptions behind it». ‖ تذكر مبدأ الترتيب الاحتمالي والافتراضات اللي وراه.‖‖
*[التاني]* ‖ «Explain why BM25 saturates term frequency ‖ and normalizes document length». ‖ تشرح ليه BM25 بتخلّي تكرار المصطلح «يشبع»، ‖ وبتطبّع طول الوثيقة.‖‖
*[التالت]* ‖ «Interpret the BM25 formula and the roles of k1 and b». ‖ تفسّر معادلة BM25 ودور البارامترين k1 وb.‖‖
*[الرابع]* ‖ «Describe query likelihood language models ‖ and why smoothing is required». ‖ تصف نماذج اللغة بأسلوب «احتمال الاستعلام»، ‖ وليه التنعيم، smoothing، ضروري.

## الشريحة 3: The probability ranking principle

*[أربع نقاط وصندوق]*
نبدأ بالمبدأ اللي بيحكم النماذج الاحتمالية كلها.‖‖
*[النقطة الأولى: Statement]* ‖ «Rank documents in decreasing order ‖ of their estimated probability of being relevant to the query». ‖ رتّب الوثائق بترتيب تنازلي ‖ حسب احتمال كونها ذات صلة بالاستعلام. ‖ يعني اللي احتمال صلته أعلى يتحط في الأول.‖‖
*[النقطة التانية: Optimality]* ‖ «Under its assumptions, this ordering ‖ gives the best expected effectiveness for the user». ‖ تحت افتراضاته، الترتيب ده بيدّي أفضل فعالية متوقّعة للمستخدم. ‖ وده كلام قوي: ‖ المبدأ بيقول مش بس إن الترتيب ده كويس، ‖ لكن إنه الأفضل نظريًا.‖‖
*[النقطة التالتة: Assumptions]* ‖ الافتراضات. ‖ «Relevance of each document is independent, ‖ and the probabilities are estimated accurately». ‖ صلة كل وثيقة مستقلة عن الباقي، ‖ والاحتمالات متقدّرة بدقة. ‖ والافتراضين دول مش دايمًا بيتحققوا. ‖ مثلًا: ‖ لو الوثيقة التانية نسخة من الأولى، ‖ فلما نعرض الاتنين ورا بعض مش بنستفيد من التانية. ‖ يعني الصلة مش مستقلة. ‖ وده سبب الاهتمام بالتنويع، diversity، في النظم الحديثة.‖‖
*[النقطة الرابعة: Consequence]* ‖ والنتيجة. ‖ «Retrieval becomes an estimation problem: ‖ find a good score that tracks probability of relevance». ‖ الاسترجاع بقى مسألة تقدير: ‖ نلاقي درجة جيدة تتتبّع احتمال الصلة.‖‖
*[أشّر على الصندوق الأصفر: Why it matters]* ‖ ولية المبدأ ده مهم؟ ‖ «It tells us what to aim for. ‖ TF-IDF was a heuristic; ‖ probabilistic models try to derive weights from this goal». ‖ بيقول لنا إحنا بنصوّب على إيه. ‖ TF-IDF كانت تقديرية، ‖ والنماذج الاحتمالية بتحاول تشتق الأوزان من الهدف ده.

## الشريحة 4: From probabilities to term weights

*[أربع نقاط]*
إزاي بنوصل من المبدأ ده لأوزان فعلية للمصطلحات؟‖‖
*[النقطة الأولى: Evidence from terms]* ‖ الأدلة من المصطلحات. ‖ «Each query term present in a document ‖ is evidence that raises or lowers the odds of relevance». ‖ كل مصطلح من الاستعلام موجود في الوثيقة ‖ هو دليل بيرفع أو بيخفّض احتمالات الصلة. ‖ فكّروا زي محقّق: ‖ كل بصمة دليل جديد بيغيّر احتمال إن المتهم هو الجاني.‖‖
*[النقطة التانية: Rare terms carry more]* ‖ المصطلحات النادرة أقوى. ‖ «A term found in few documents is stronger evidence، ‖ which reproduces the idf idea ‖ from a principled starting point». ‖ المصطلح اللي في وثائق قليلة دليل أقوى، ‖ وده بيعيد فكرة idf من نقطة بداية مبدئية. ‖ يعني اللي كنا بنعمله بالحدس في الوحدة اللي فاتت، ‖ دلوقتي بيطلع من النظرية.‖‖
*[النقطة التالتة: Independence assumption]* ‖ افتراض الاستقلال. ‖ «Combining evidence term by term is tractable but simplistic». ‖ جمع الأدلة مصطلح بمصطلح ممكن حسابيًا، ‖ لكنه مبسّط أكتر من اللازم. ‖‖
*[النقطة الرابعة: Result]* ‖ والنتيجة. ‖ «A family of scoring functions ‖ whose best-known practical member is BM25». ‖ عيلة من دوال التقييم، ‖ أشهر فرد عملي فيها هو BM25. ‖ واسم BM25 معناه «Best Matching رقم 25»، ‖ لأنه كان المحاولة الخامسة والعشرين ‖ في سلسلة تجارب على صيغ التقييم.

## الشريحة 5: Two flaws in raw TF-IDF that BM25 repairs

*[بطاقتين]*
قبل المعادلة، ‖ نفهم المشكلتين اللي BM25 بتحلّهم في TF-IDF الخام.‖‖
*[البطاقة الأولى: Linear term frequency]* ‖ المشكلة الأولى: التكرار الخطي. ‖ «Twenty occurrences score nearly twice ten». ‖ عشرين ظهور بياخدوا تقريبًا ضعف درجة عشرة. ‖ لكن «the tenth mention adds little new evidence»، ‖ الذكر العاشر بيضيف دليل جديد قليل. ‖ لو الكلمة اتكررت عشر مرات، ‖ فإحنا متأكّدين إن الوثيقة عنها، ‖ فالعشر التانيين مش بيزوّدوا تأكّدنا بنفس القدر. ‖ والحل اسمه «saturation»، التشبّع.‖‖
*[البطاقة التانية: Weak length handling]* ‖ المشكلة التانية: معالجة الطول الضعيفة. ‖ «Long documents contain more words by chance». ‖ الوثائق الطويلة فيها كلمات أكتر بالصدفة. ‖ «They may not be more relevant». ‖ وممكن ما تكونش أكتر صلة. ‖ تقرير من ميت صفحة هيحتوي تقريبًا على أي كلمة، ‖ بس مش معناه إنه عن كل حاجة. ‖ والحل اسمه «length normalization»، تطبيع الطول.‖‖
*[أشّر على الصندوق الأصفر: The idea in one line]* ‖ والفكرة في سطر: ‖ «BM25 adds two tunable parameters, one for each fix, ‖ and keeps an idf factor for rare terms». ‖ BM25 بتضيف بارامترين قابلين للضبط، ‖ واحد لكل علاج، ‖ وبتحتفظ بعامل idf للمصطلحات النادرة.

## الشريحة 6: The BM25 score

*[صندوق غامق فيه معادلة طويلة]*
المعادلة طويلة، ‖ لكن كل جزء فيها له معنى واضح. ‖ هنفكّكها قطعة قطعة.‖‖
*[أشّر على المعادلة]* ‖ درجة الاستعلام q والوثيقة d ‖ تساوي مجموع، على مصطلحات الاستعلام، ‖ لـ idf للمصطلح، مضروب في كسر. ‖‖
*[أشّر على بسط الكسر]* ‖ البسط: ‖ f بين قوسين t وd، مضروبة في k1 زائد واحد. ‖ f هنا هي عدد ظهور المصطلح في الوثيقة.‖‖
*[أشّر على المقام]* ‖ المقام: ‖ f زائد k1 مضروب في قوس: ‖ واحد ناقص b، زائد b ضرب طول الوثيقة على متوسط الطول. ‖‖
*[أشّر على التعريفات]* ‖ ودلوقتي الرموز. ‖‖
f(t,d): ‖ عدد ظهور المصطلح t في الوثيقة d.‖‖
|d| وavgdl: ‖ طول الوثيقة، ومتوسط طول وثائق المجموعة.‖‖
k1: ‖ «Saturation: higher values let repeats count for longer. ‖ Typical range 1.2 to 2». ‖ التشبّع: القيم الأعلى بتخلّي التكرار يفيد لفترة أطول. ‖ والمدى المعتاد من 1.2 إلى 2.‖‖
b: ‖ «Length normalization strength from 0 (none) to 1 (full). Often 0.75». ‖ قوة تطبيع الطول، من صفر، يعني بلا تطبيع، ‖ لواحد، يعني تطبيع كامل. ‖ وغالبًا 0.75.‖‖
*[أشّر على الصندوق الأصفر: Reading it]* ‖ وطريقة القراءة: ‖ «The sum runs over query terms. ‖ Each contributes a rarity factor idf ‖ times a bounded frequency factor ‖ that rises quickly, then flattens». ‖ المجموع على مصطلحات الاستعلام. ‖ كل مصطلح بيساهم بعامل ندرة، idf، ‖ مضروب في عامل تكرار محدود، ‖ بيرتفع بسرعة ثم بيستوي. ‖ يعني كل مصطلح في الاستعلام بيساهم بدرجة، ‖ ودرجاتهم بتتجمع.

## الشريحة 7: Saturation in numbers

*[جدول فيه صفين وخمس أعمدة]*
نشوف التشبّع بالأرقام.‖‖
*[أشّر على العنوان]* ‖ العنوان: «Saturation in numbers»، ‖ وبين قوسين: k1 يساوي 1.2، من غير أثر للطول. ‖ يعني بنعتبر b يساوي صفر عشان نركّز على التشبّع.‖‖
*[أشّر على الصف الأول]* ‖ الصف الأول هو عامل التكرار: ‖ f مضروبة في 2.2، مقسومة على f زائد 1.2. ‖ والـ 2.2 هي k1 زائد واحد.‖‖
لما f يساوي 1: ‖ واحد ضرب 2.2 على 2.2، يعني واحد بالظبط. ‖‖
لما f يساوي 2: ‖ 4.4 على 3.2، يعني 1.38.‖‖
لما f يساوي 5: ‖ 11 على 6.2، يعني 1.77.‖‖
لما f يساوي 10: ‖ 22 على 11.2، يعني 1.96.‖‖
والحد الأقصى، لما f يكبر جدًا، هو 2.2. ‖ يعني k1 زائد واحد.‖‖
*[أشّر على الصف التاني]* ‖ والصف التاني للمقارنة: ‖ العدّ الخطي: 1، 2، 5، 10، وغير محدود.‖‖
*[أشّر على الصندوق الأصفر: Reading the table]* ‖ وتفسير الجدول: ‖ «Going from 5 to 10 occurrences adds only 0.19، ‖ while 1 to 2 adds 0.38». ‖ الانتقال من 5 ظهورات لـ 10 بيضيف 0.19 بس، ‖ بينما من 1 لـ 2 بيضيف 0.38. ‖ «A single term cannot dominate the score، ‖ so queries with several terms need several matches». ‖ مصطلح واحد ما يقدرش يسيطر على الدرجة، ‖ فالاستعلامات متعددة المصطلحات محتاجة تطابقات متعددة. ‖ وده بالظبط السلوك اللي عايزينه: ‖ وثيقة بتكرّر كلمة واحدة مية مرة ‖ مش المفروض تتغلّب على وثيقة فيها كل كلمات الاستعلام.

## الشريحة 8: Length normalization at work

*[أربع بطاقات مرقّمة]*
دلوقتي الجزء التاني: تطبيع الطول، بمثال.‖‖
*[البطاقة 1: Setting]* ‖ الإعداد. ‖ k1 يساوي 1.2، وb يساوي 0.75، ‖ ومصطلح ظهر f يساوي 3 مرات. ‖ ونقارن وثيقتين.‖‖
*[البطاقة 2: Average length]* ‖ الوثيقة الأولى طولها بالظبط متوسط المجموعة. ‖ يعني النسبة |d| على avgdl تساوي واحد. ‖ المقام: ‖ 3 زائد 1.2 ضرب القوس، والقوس بيساوي واحد ناقص 0.75 زائد 0.75 ضرب واحد، يعني واحد. ‖ فالمقام 3 زائد 1.2، يساوي 4.2. ‖ والبسط 3 ضرب 2.2، يساوي 6.6. ‖ فالعامل: 6.6 على 4.2، يساوي 1.57.‖‖
*[البطاقة 3: Twice average length]* ‖ الوثيقة التانية طولها ضعف المتوسط. ‖ يعني النسبة اتنين. ‖ القوس: ‖ واحد ناقص 0.75، يعني 0.25، زائد 0.75 ضرب اتنين، يعني 1.5، ‖ المجموع 1.75. ‖ المقام: 3 زائد 1.2 ضرب 1.75، ‖ يعني 3 زائد 2.1، يساوي 5.1. ‖ والعامل: 6.6 على 5.1، يساوي 1.29.‖‖
*[البطاقة 4: Meaning]* ‖ المعنى. ‖ «Same count in a longer document is weaker evidence، ‖ so its score is lower». ‖ نفس العدد في وثيقة أطول دليل أضعف، ‖ فدرجتها أقل.‖‖
*[أشّر على الصندوق الأصفر: Why this is sensible]* ‖ ولية ده منطقي؟ ‖ «A word repeated three times in a short note ‖ is a stronger signal of topic ‖ than three times in a very long report». ‖ كلمة اتكررت ثلاث مرات في ملحوظة قصيرة ‖ إشارة أقوى للموضوع ‖ من ثلاث مرات في تقرير طويل جدًا. ‖‖
*[سؤال للطلاب — اسكت 5 ثواني]* ‖ لو b يساوي صفر، ‖ هل الوثيقتين دول هيتساووا؟ ‖‖
الإجابة: ‖ أيوه. ‖ لأن القوس يبقى واحد دايمًا، ‖ فالطول مبيأثّرش خالص. ‖ ده الإجابة على سؤال «Check yourself» في آخر الوحدة.

## الشريحة 9: Language models for retrieval

*[أربع نقاط وصندوق]*
دلوقتي نظرة تانية خالص للمسألة: نماذج اللغة.‖‖
*[النقطة الأولى: Generative view]* ‖ النظرة التوليدية. ‖ «Each document defines a word distribution. ‖ Ask how likely that model is to produce the query». ‖ كل وثيقة بتحدّد توزيع كلمات. ‖ ونسأل: ‖ لو الوثيقة دي «بتكتب» بشكل عشوائي حسب توزيعها، ‖ ما احتمال إنها تطلّع الاستعلام ده؟‖‖
*[النقطة التانية: Query likelihood]* ‖ احتمال الاستعلام. ‖ «Rank documents by P(q | d)، ‖ the product of the probabilities ‖ of the query terms under the document model». ‖ نرتّب الوثائق حسب P(q | d)، ‖ وهو حاصل ضرب احتمالات مصطلحات الاستعلام ‖ تحت نموذج الوثيقة.‖‖
*[النقطة التالتة: Zero problem]* ‖ مشكلة الصفر. ‖ «If a query term never occurs in a document، ‖ the whole product collapses to zero». ‖ لو مصطلح من الاستعلام ما ظهرش أبدًا في الوثيقة، ‖ حاصل الضرب كله بيتحوّل لصفر. ‖ تخيّلوا استعلام من خمس كلمات، ‖ وثيقة فيها أربعة منهم، والخامسة غايبة. ‖ احتمالها صفر! ‖ مع إنها مرشّحة ممتازة.‖‖
*[النقطة الرابعة: Smoothing]* ‖ الحل: التنعيم. ‖ «Blend the document estimate with the collection distribution ‖ so unseen words keep a small probability». ‖ نمزج تقدير الوثيقة مع توزيع المجموعة، ‖ عشان الكلمات اللي ما ظهرتش تفضل ليها احتمال صغير.‖‖
*[أشّر على الصندوق الأصفر: Hidden benefit]* ‖ والفايدة الخفية: ‖ «Smoothing also plays the role of idf: ‖ a rare word in the collection earns a big boost ‖ when a document does contain it». ‖ التنعيم بيلعب كمان دور idf: ‖ الكلمة النادرة في المجموعة بتاخد دفعة كبيرة ‖ لما وثيقة بتحتويها فعلًا.

## الشريحة 10: Dirichlet smoothing

*[صندوق غامق فيه معادلة]*
وأشهر نوع تنعيم: ديريكليه، Dirichlet.‖‖
*[أشّر على المعادلة]* ‖ احتمال المصطلح t في الوثيقة d ‖ يساوي: ‖ f بين قوسين t وd، زائد ميو مضروب في احتمال t في المجموعة، ‖ مقسوم على طول الوثيقة زائد ميو.‖‖
*[أشّر على الرموز]* ‖ P(t | C): ‖ «Probability of t in the whole collection، ‖ the background model». ‖ احتمال المصطلح في المجموعة كلها، ‖ ونسمّيه النموذج الخلفي.‖‖
ميو: ‖ «Smoothing strength: ‖ how many pseudo-counts come from the background». ‖ قوة التنعيم: ‖ كام «عدّ وهمي» بيجيلنا من الخلفية.‖‖
|d|: ‖ «Document length, ‖ so long documents trust their own counts more». ‖ طول الوثيقة، ‖ فالوثائق الطويلة بتثق في عدّها هي أكتر.‖‖
*[أشّر على الصندوق الأصفر: Intuition]* ‖ والحدس: ‖ «A short document has little evidence, ‖ so it leans on the collection. ‖ A long document has more evidence ‖ and is smoothed less». ‖ الوثيقة القصيرة أدلّتها قليلة، ‖ فبتعتمد على المجموعة. ‖ والطويلة أدلّتها أكتر، ‖ فبتتنعّم أقل. ‖ «Length handling emerges without a separate rule». ‖ معالجة الطول بتطلع من غير قاعدة منفصلة. ‖‖
*[مثال سريع، لو في وقت]* ‖ تخيّلوا ميو يساوي مية، ‖ ووثيقة طولها عشر كلمات. ‖ المقام: عشرة زائد مية، يعني مية وعشرة. ‖ فالتنعيم بيمثّل حوالي 91 في المية من التقدير. ‖ ولو الوثيقة ألف كلمة، ‖ المقام ألف زائد مية، ‖ فالتنعيم حوالي 9 في المية بس.

## الشريحة 11: Choosing between the three scorers

*[تلات بطاقات]*
خلاصة المقارنة بين التلات دوال اللي شفناهم.‖‖
*[البطاقة الأولى: TF-IDF]* ‖ «Simple and transparent»، بسيطة وشفافة. ‖ «Heuristic, weak on length»، تقديرية وضعيفة في الطول. ‖ «Useful baseline»، خط أساس مفيد.‖‖
*[البطاقة التانية: BM25]* ‖ «Strong default for text»، افتراضي قوي للنص. ‖ «Two tunable parameters»، بارامترين قابلين للضبط. ‖ «Cheap on an inverted index»، رخيصة على الفهرس المقلوب.‖‖
*[البطاقة التالتة: Language model]* ‖ «Clear probabilistic story»، قصة احتمالية واضحة. ‖ «Smoothing choice matters»، اختيار التنعيم مهم. ‖ «Natural fit for extensions»، مناسبة طبيعيًا للامتدادات.‖‖
*[أشّر على الصندوق الأصفر: Rule of thumb]* ‖ والقاعدة العملية: ‖ «In practice BM25 and well-smoothed language models ‖ perform similarly. ‖ Tune parameters on judged queries ‖ rather than trusting defaults». ‖ عمليًا، BM25 ونماذج اللغة الجيدة التنعيم ‖ بيؤدّوا بشكل متقارب. ‖ اضبطوا البارامترات على استعلامات محكوم عليها، ‖ ومتثقوش في القيم الافتراضية.

## الشريحة 12: Tuning BM25 in practice

*[أربع نقاط وصندوق]*
كيف نضبط BM25 على بياناتنا؟‖‖
*[النقطة الأولى: Start with defaults]* ‖ ابدأ بالقيم الافتراضية. ‖ «k1 near 1.2 and b near 0.75 ‖ are reasonable on many text collections». ‖ k1 حوالي 1.2 وb حوالي 0.75 ‖ معقولين في مجموعات نصية كتير.‖‖
*[النقطة التانية: Short, uniform texts]* ‖ النصوص القصيرة المتجانسة. ‖ «Titles or product names have little length variation، ‖ so a lower b often helps». ‖ العناوين وأسماء المنتجات أطوالها متقاربة، ‖ فتقليل b بيساعد غالبًا. ‖ لأن تطبيع الطول هنا ما لوش لازمة، ‖ وممكن يضر.‖‖
*[النقطة التالتة: Long, mixed documents]* ‖ الوثائق الطويلة المتنوّعة. ‖ «A higher b guards against long pages ‖ that mention everything». ‖ b أعلى بيحمي من الصفحات الطويلة ‖ اللي بتذكر كل حاجة.‖‖
*[النقطة الرابعة: Validate]* ‖ تحقّق. ‖ «Choose values by grid search on judged queries ‖ and keep a separate test set». ‖ اختار القيم بالبحث الشبكي على استعلامات محكوم عليها، ‖ واحتفظ بمجموعة اختبار منفصلة. ‖ ودي نفس فكرة تدريب نماذج تعلّم الآلة اللي عارفينها: ‖ مجموعة ضبط ومجموعة اختبار.‖‖
*[أشّر على الصندوق الأصفر: Principle]* ‖ والمبدأ: ‖ «Parameters turn assumptions about your data into numbers. ‖ They should be measured, not borrowed». ‖ البارامترات بتحوّل افتراضاتنا عن البيانات لأرقام. ‖ ولازم تتقاس، مش تتستعار.

## الشريحة 13: Key takeaways

*[أربع نقاط]*
نراجع.‖‖
*[الأولى]* ‖ مبدأ الترتيب الاحتمالي بيقول: ‖ رتّب الوثائق حسب فرصة صلتها.‖‖
*[التانية]* ‖ BM25 بتحدّ من أثر المصطلحات المتكررة، ‖ وبتخصم من الوثائق الطويلة، ‖ والاتنين بيتحكّم فيهم k1 وb.‖‖
*[التالتة]* ‖ نماذج اللغة بترتّب حسب احتمال إن الوثيقة تولّد الاستعلام.‖‖
*[الرابعة]* ‖ التنعيم بيمنع الاحتمالات الصفرية، ‖ وبيتصرّف كـ idf زائد تحكّم في الطول.‖‖
*[أشّر على اللوحة: Up next]* ‖ الوحدة الجاية: ‖ «Module 5 moves from exact words to learned meaning: ‖ neural retrieval». ‖ ننتقل من الكلمات التامة إلى المعنى المتعلّم: الاسترجاع العصبي.‖‖
*[أشّر على Check yourself]* ‖ وسؤال للتفكير: ‖ «What happens to BM25 scores if b is set to 0؟» ‖ إيه اللي بيحصل لدرجات BM25 لو b يساوي صفر؟ ‖ الإجابة اللي شرحناها في الشريحة الثامنة: ‖ مفيش تطبيع للطول خالص.‖‖
وإلى اللقاء في الوحدة الخامسة.
