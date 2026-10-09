# النص التفصيلي للوحدة السادسة: التقويم وأحكام الصلة (Evaluation and Relevance Judgments)

**المدة التقريبية:** حوالي 1,947 كلمة، أي نحو 16 دقيقة نطق بإيقاع هادئ (قابلة للتقسيم إلى جزأين)
**الشرائح المصاحبة:** IR_Module6_Evaluation.pptx (13 شريحة، بالإنجليزية) ·  **الأسلوب:** مصرية مهذّبة وواضحة بصوت المعلّم، والمصطلحات التقنية بالإنجليزية كما هي في الشرائح مع شرحها بالعربية
**ملحوظة:** الشرائح باتجاه اليسار لليمين، فالصندوق الأصفر على اليمين أو تحت المحتوى.
**علامات القراءة:** `‖` وقفة قصيرة · `‖‖` وقفة أطول (استنى الشريحة تتحرك) · *[بين قوسين]* تعليمات أداء، مش بتتقال

---

## الشريحة 1: Evaluation and Relevance Judgments

أهلاً بيكم في الوحدة السادسة. ‖ بنينا في الوحدات اللي فاتت نماذج كتير: ‖ البوليانى، وTF-IDF، وBM25، ونماذج اللغة، والنماذج العصبية. ‖ والسؤال اللي لازم نسأله دلوقتي: ‖ إزاي نعرف إن واحد منهم أحسن من التاني؟ ‖‖
*[أشّر على العنوان]* ‖ عنوان الوحدة: «Evaluation and Relevance Judgments»، ‖ التقويم وأحكام الصلة. ‖ وتحته: «How we know one ranking is better than another»، ‖ كيف نعرف إن ترتيبًا أفضل من ترتيب آخر. ‖‖
وده في رأيي أهم موضوع في المجال. ‖ لأن من غير قياس سليم، ‖ أي تحسين هتعمله هيبقى تخمين.

## الشريحة 2: Learning objectives

*[انتظر ظهور الأهداف]*
أربع أهداف.‖‖
*[الأول]* ‖ «Describe the test collection approach ‖ and how relevance judgments are gathered». ‖ تصف منهج مجموعة الاختبار، ‖ وكيف بتتجمع أحكام الصلة.‖‖
*[التاني]* ‖ «Compute precision at k, reciprocal rank، ‖ average precision and nDCG». ‖ تحسب الدقة عند k، والرتبة المتبادلة، ‖ ومتوسط الدقة، وnDCG.‖‖
*[التالت]* ‖ «Choose a metric that matches how users consume results». ‖ تختار مقياس يناسب طريقة استهلاك المستخدمين للنتايج.‖‖
*[الرابع]* ‖ «Recognize the limits of offline and online evaluation، ‖ including bias and significance». ‖ تعرف حدود التقويم غير المتصل والمتصل، ‖ بما فيها التحيّز والدلالة الإحصائية.

## الشريحة 3: Why evaluation comes first

*[أربع نقاط وصندوق]*
ليه بنتكلّم عن التقويم قبل ما نكمّل بناء النظم؟‖‖
*[النقطة الأولى: Opinions mislead]* ‖ الآراء بتضلّل. ‖ «A ranking that looks good on three favorite queries ‖ may be worse overall». ‖ ترتيب شكله كويس على ثلاث استعلامات مفضّلة ‖ ممكن يكون أسوأ في المجمل. ‖ كل واحد فينا بيجرّب استعلامات بيحبها. ‖ لكن النظام بيخدم ملايين الاستعلامات المختلفة.‖‖
*[النقطة التانية: Many knobs]* ‖ مفاتيح كتير. ‖ «Analysis choices, weights, k1, b and models ‖ all change results. ‖ Without measurement we tune blindly». ‖ اختيارات التحليل، والأوزان، وk1 وb، والنماذج، ‖ كلها بتغيّر النتايج. ‖ ومن غير قياس بنضبط بشكل أعمى.‖‖
*[النقطة التالتة: Need repeatability]* ‖ محتاجين تكرارية. ‖ «A fixed benchmark lets us compare changes fairly over time». ‖ مرجع ثابت بيسمح لنا نقارن التغييرات بإنصاف عبر الزمن.‖‖
*[النقطة الرابعة: Need user meaning]* ‖ محتاجين معنى للمستخدم. ‖ «Numbers must connect to what users value، ‖ or we optimize the wrong thing». ‖ الأرقام لازم تتصل بقيمة للمستخدم، ‖ وإلا بنحسّن حاجة غلط.‖‖
*[أشّر على الصندوق الأصفر: Engineering view]* ‖ والمنظور الهندسي: ‖ «Treat metrics as the loss function of the whole project. ‖ Everything in Modules 2 to 5 is tuned against them». ‖ اعتبروا المقاييس هي دالة الخسارة للمشروع كله. ‖ كل حاجة في الوحدات من التانية للخامسة بتتضبط على أساسها. ‖ وبما إنكم عارفين تعلّم الآلة، ‖ فالفكرة مألوفة: ‖ اللي بتقيسه هو اللي بتحسّنه.

## الشريحة 4: The test collection (Cranfield) approach

*[أربع بطاقات مرقّمة]*
الطريقة المعيارية في التقويم اسمها منهج Cranfield، ‖ على اسم تجارب أُجريت في مدينة اسمها Cranfield في إنجلترا في الخمسينات والستينات.‖‖
*[الخطوة 1: Documents]* ‖ الوثائق. ‖ «A fixed collection that does not change between experiments». ‖ مجموعة ثابتة ما بتتغيّرش بين التجارب. ‖ ودي شرط ضروري، ‖ لأن لو الوثائق اتغيّرت، ‖ ما نقدرش نقارن.‖‖
*[الخطوة 2: Topics]* ‖ المواضيع. ‖ «A set of realistic queries، ‖ each with a description of the need». ‖ مجموعة استعلامات واقعية، ‖ ولكل واحد وصف للحاجة. ‖ والوصف مهم، ‖ لأن اللي بيحكم على الصلة لازم يعرف المستخدم كان عايز إيه.‖‖
*[الخطوة 3: Judgments]* ‖ الأحكام. ‖ «People label documents as relevant ‖ or give grades, for each topic». ‖ ناس بتعلّم الوثائق إنها ذات صلة أو لأ، ‖ أو بتدّيها درجات، لكل موضوع.‖‖
*[الخطوة 4: Metrics]* ‖ المقاييس. ‖ «Run systems, compare their ranked lists with the labels، ‖ average across topics». ‖ نشغّل النظم، ونقارن قوايمها المرتّبة بالتعليمات، ‖ ونحسب المتوسّط على المواضيع.‖‖
*[أشّر على الصندوق الأصفر: Why it works]* ‖ ولية بينجح؟ ‖ «Labels are created once and reused for every future system، ‖ so experiments are cheap, controlled and repeatable». ‖ الأحكام بتتعمل مرة واحدة ‖ وتتعاد استخدامها لكل نظام مستقبلي، ‖ فالتجارب رخيصة ومنضبطة وقابلة للتكرار.

## الشريحة 5: Getting judgments: pooling

*[أربع نقاط وصندوق]*
مشكلة: ‖ إزاي نجمع الأحكام لو المجموعة فيها ملايين الوثائق؟‖‖
*[النقطة الأولى: The scale problem]* ‖ مشكلة الحجم. ‖ «Nobody can judge every document for every query». ‖ مفيش حد يقدر يحكم على كل وثيقة لكل استعلام. ‖ لو عندنا خمسين استعلام ومليون وثيقة، ‖ يبقى خمسين مليون حكم.‖‖
*[النقطة التانية: Pooling]* ‖ التجميع، pooling. ‖ «Take the top results from several different systems، ‖ merge them into a pool and judge only that pool». ‖ ناخد أعلى النتايج من عدّة نظم مختلفة، ‖ وندمجها في «حوض»، ‖ ونحكم بس على الحوض ده. ‖ لو كل نظام رجّع عشرين، وعندنا عشر نظم، ‖ الحوض ما يزيدش عن مايتين وثيقة لكل استعلام.‖‖
*[النقطة التالتة: Assumption]* ‖ الافتراض. ‖ «Unjudged documents are treated as not relevant». ‖ الوثائق اللي ما اتحكمش عليها بتتعامل على إنها غير ذات صلة.‖‖
*[النقطة الرابعة: Risk]* ‖ والخطر. ‖ «A new system that finds relevant documents ‖ no pooled system retrieved is unfairly penalized». ‖ نظام جديد بيلاقي وثائق ذات صلة ‖ ما لقاهاش أي نظام في الحوض ‖ بيتعاقب ظلم. ‖ لأن الوثائق دي ما اتحكمش عليها، ‖ فبتتحسب غير ذات صلة، ‖ مع إنها مفيدة.‖‖
*[أشّر على الصندوق الأصفر: Mitigation]* ‖ والتخفيف. ‖ «Diverse systems in the pool reduce the bias، ‖ and graded labels capture how useful an answer is ‖ rather than only yes or no». ‖ نظم متنوعة في الحوض بتقلّل التحيّز، ‖ والتصنيف المتدرّج بيلتقط مدى فايدة الإجابة ‖ بدل «نعم أو لأ» بس.

## الشريحة 6: Rank-based metrics

*[صندوق غامق فيه معادلتين]*
دلوقتي نترجم الأحكام لأرقام. ‖ مقياسين بسيطين.‖‖
*[أشّر على المعادلة الأولى]* ‖ P at k: ‖ الدقة عند k، ‖ تساوي عدد الوثائق ذات الصلة في أعلى k، ‖ مقسوم على k. ‖ يعني لو أول عشر نتايج فيهم ستة ذات صلة، ‖ فالدقة عند 10 تساوي 0.6.‖‖
*[أشّر على المعادلة التانية]* ‖ RR: ‖ الرتبة المتبادلة، reciprocal rank، ‖ تساوي واحد على رتبة أول وثيقة ذات صلة.‖‖
*[أشّر على الرموز]* ‖ P at k: ‖ «Precision at depth k. Simple, ‖ but ignores order within the top k». ‖ دقة عند عمق k. بسيطة، ‖ لكنها بتتجاهل الترتيب جوه أعلى k. ‖ يعني ستة ذات صلة في أول عشرة ‖ نفس الدرجة لو كانوا في الأول أو في الآخر.‖‖
RR: ‖ «Reciprocal rank: rewards finding one good answer early». ‖ بتكافئ العثور على إجابة جيدة مبكّرًا.‖‖
MRR: ‖ «Mean of RR over queries»، ‖ متوسّط RR على الاستعلامات.‖‖
*[أشّر على الصندوق الأصفر: Example]* ‖ والمثال: ‖ ثلاث استعلامات، ‖ أول وثيقة ذات صلة في الرتب 1 و3 و2. ‖ RR في الثلاث: ‖ واحد، وواحد على تلاتة يعني 0.33، وواحد على اتنين يعني 0.5. ‖ المجموع 1.83، ‖ ومقسوم على 3 يعني MRR تقريبًا 0.61. ‖‖
«MRR suits lookups with a single right answer». ‖ MRR بتناسب البحث عن إجابة واحدة صحيحة، ‖ زي «عاصمة فرنسا».

## الشريحة 7: Graded relevance: nDCG

*[صندوق غامق فيه معادلتين]*
لما الصلة متدرّجة، ‖ يعني فيه وثايق ممتازة ووثايق جيدة ووثايق مقبولة، ‖ بنستخدم مقياس أدق: nDCG.‖‖
*[أشّر على المعادلة الأولى: DCG]* ‖ DCG، ‖ الكسب التراكمي المخفّض، ‖ يساوي مجموع، على المواضع i، ‖ لدرجة صلة الوثيقة في الموضع i، ‖ مقسومة على لوغاريتم i زائد واحد بالأساس اتنين.‖‖
*[أشّر على المعادلة التانية: nDCG]* ‖ وnDCG ‖ يساوي DCG على IDCG.‖‖
*[أشّر على الرموز]* ‖ rel i: ‖ «Gain (relevance grade) ‖ of the result at position i». ‖ الكسب، أو درجة الصلة، ‖ للنتيجة في الموضع i.‖‖
اللوغاريتم: ‖ «Discount: lower positions count less، ‖ since users read top results most». ‖ الخصم: المواضع الأدنى بتُحسب أقل، ‖ لأن المستخدمين بيقروا النتايج العليا أكتر.‖‖
IDCG: ‖ «DCG of the ideal ordering، ‖ so scores fall between 0 and 1». ‖ الـ DCG للترتيب المثالي، ‖ علشان الدرجات تبقى بين صفر وواحد.‖‖
*[أشّر على الصندوق الأصفر: Why normalize?]* ‖ ولية بنطبّع؟ ‖ «Different queries have different best possible scores. ‖ Dividing by the ideal ordering makes queries comparable ‖ and averageable». ‖ الاستعلامات المختلفة ليها أفضل درجات ممكنة مختلفة. ‖ والقسمة على الترتيب المثالي ‖ بتخلّي الاستعلامات قابلة للمقارنة والتوسيط.

## الشريحة 8: nDCG worked example

*[جدول فيه ثلاث صفوف]*
نطبّق المعادلة على مثال.‖‖
*[أشّر على الصف الأول]* ‖ الصف الأول: درجات النتايج المرجّعة بالترتيب. ‖ الموضع 1 درجته 3، ‖ والموضع 2 درجته 2، ‖ والموضع 3 درجته صفر، ‖ والموضع 4 درجته 1.‖‖
*[أشّر على الصف التاني]* ‖ الصف التاني: الكسب المخفّض. ‖ في الموضع 1: ‖ 3 على لوغاريتم 2 بأساس 2، يعني على 1، يساوي 3. ‖ في الموضع 2: ‖ 2 على لوغاريتم 3 بأساس 2، يعني على 1.585، يساوي 1.26. ‖ في الموضع 3: صفر. ‖ في الموضع 4: ‖ 1 على لوغاريتم 5 بأساس 2، يعني على 2.32، يساوي 0.43. ‖ المجموع: 3 زائد 1.26 زائد صفر زائد 0.43، ‖ يساوي 4.69.‖‖
*[أشّر على الصف التالت]* ‖ الصف التالت: الترتيب المثالي، ‖ يعني ترتيب الدرجات تنازليًا: 3 و2 و1 و0. ‖ الكسب المخفّض: ‖ الموضع 1: 3. ‖ الموضع 2: 1.26. ‖ الموضع 3: ‖ 1 على لوغاريتم 4 بأساس 2، يعني على 2، يساوي 0.5. ‖ الموضع 4: صفر. ‖ المجموع: 4.76.‖‖
*[أشّر على الصندوق الأصفر: Result]* ‖ والنتيجة: ‖ nDCG يساوي 4.69 على 4.76، يعني 0.99. ‖ «The only mistake is that the grade 1 document ‖ is below the grade 0 document، ‖ a small penalty because it sits low in the list». ‖ الغلطة الوحيدة إن وثيقة الدرجة 1 ‖ جت تحت وثيقة الدرجة صفر، ‖ وعقوبتها صغيرة لأنها في آخر القايمة. ‖ لو الغلطة كانت في الموضع الأول ‖ كانت العقوبة أكبر بكتير.

## الشريحة 9: Average precision

*[صندوق غامق فيه معادلة]*
مقياس تالت مهم: ‖ متوسط الدقة، Average Precision.‖‖
*[أشّر على المعادلة]* ‖ AP تساوي واحد على R، ‖ مضروبة في مجموع P at k ضرب rel عند k. ‖ يعني: ‖ في كل موضع k فيه وثيقة ذات صلة، ‖ نحسب الدقة عند k، ‖ ونحسب متوسّطها على كل الوثائق ذات الصلة.‖‖
*[أشّر على الرموز]* ‖ R: ‖ «Number of relevant documents for the query»، ‖ عدد الوثائق ذات الصلة للاستعلام.‖‖
P at k: ‖ «Precision at each rank k ‖ where a relevant document appears»، ‖ الدقة عند كل رتبة k ‖ تظهر فيها وثيقة ذات صلة.‖‖
MAP: ‖ «Mean of AP across all queries»، ‖ متوسّط AP على كل الاستعلامات.‖‖
*[أشّر على الصندوق الأصفر: Example]* ‖ والمثال: ‖ ثلاث وثائق ذات صلة تظهر في الرتب 1 و3 و5، ‖ وR يساوي 3. ‖ الدقة عند الرتبة 1: واحد على واحد. ‖ الدقة عند الرتبة 3: اتنين على تلاتة، يعني 0.67. ‖ الدقة عند الرتبة 5: تلاتة على خمسة، يعني 0.60. ‖ AP تساوي واحد زائد 0.67 زائد 0.60، مقسوم على 3، ‖ يعني حوالي 0.76. ‖‖
والفكرة: ‖ «Missing relevant documents lowers AP، ‖ so it rewards both early and complete retrieval». ‖ غياب وثائق ذات صلة بيخفّض AP، ‖ فهي بتكافئ الاسترجاع المبكّر والكامل مع بعض.

## الشريحة 10: Choosing a metric

*[تلات بطاقات]*
مقياس واحد مش بيناسب كل حاجة. ‖ ودي الشريحة اللي بتساعدنا نختار.‖‖
*[البطاقة الأولى: Known-item or QA]* ‖ البحث عن عنصر معروف، أو الأسئلة والأجوبة. ‖ «One right answer»، إجابة صحيحة واحدة. ‖ «Use MRR or success at k»، ‖ استخدم MRR أو نسبة النجاح عند k.‖‖
*[البطاقة التانية: Browse and research]* ‖ التصفّح والبحث. ‖ «Many partly useful results»، ‖ نتايج كتيرة مفيدة جزئيًا. ‖ «Use nDCG or average precision»، ‖ استخدم nDCG أو متوسّط الدقة.‖‖
*[البطاقة التالتة: Recall-critical]* ‖ الاستدعاء حاسم. ‖ «Legal or patent search»، البحث القانوني أو عن براءات الاختراع. ‖ «Use recall at depth and cost of review»، ‖ استخدم الاستدعاء عند عمق معيّن وتكلفة المراجعة. ‖ لأن تفويت وثيقة واحدة ممكن يكلّف قضية.‖‖
*[أشّر على الصندوق الأصفر: Principle]* ‖ والمبدأ: ‖ «A metric encodes an assumption about the user. ‖ Pick the one whose assumption matches the product». ‖ المقياس بيشفّر افتراضًا عن المستخدم. ‖ اختار اللي افتراضه يطابق المنتج.

## الشريحة 11: Online evaluation and its biases

*[أربع نقاط]*
كل اللي فات تقويم «غير متصل»، offline. ‖ لكن فيه تقويم «متصل»، online، ‖ بيتم على مستخدمين حقيقيين.‖‖
*[النقطة الأولى: A/B tests]* ‖ اختبارات A/B. ‖ «Show two systems to different users ‖ and compare behavior such as clicks، ‖ reformulations and task completion». ‖ نعرض نظامين لمستخدمين مختلفين، ‖ ونقارن السلوك، زي النقرات، ‖ وإعادة صياغة الاستعلام، وإتمام المهمة.‖‖
*[النقطة التانية: Position bias]* ‖ تحيّز الموضع. ‖ «Users click top results more regardless of quality، ‖ so raw clicks overstate the top». ‖ المستخدمين بيضغطوا على النتايج العليا أكتر بغضّ النظر عن الجودة، ‖ فالنقرات الخام بتبالغ في قيمة الأعلى.‖‖
*[النقطة التالتة: Clicks are not relevance]* ‖ النقرة مش صلة. ‖ «Attractive snippets earn clicks، ‖ and good answers shown in snippets earn none». ‖ المقتطفات الجذّابة بتكسب نقرات، ‖ والإجابات الجيدة المعروضة في المقتطف نفسه ما بتكسبش أي نقرة. ‖ لو المستخدم لقى الإجابة في المقتطف وما ضغطش، ‖ هل ده فشل؟ لأ، نجاح!‖‖
*[النقطة الرابعة: Interleaving]* ‖ الدمج المتشابك. ‖ «Mix results from two rankers into one list ‖ and see which gets credit، ‖ which needs fewer users». ‖ نمزج نتايج مرتّبين في قايمة واحدة، ‖ ونشوف أيهم بياخد الفضل، ‖ وده بيحتاج مستخدمين أقل.

## الشريحة 12: Pitfalls in practice

*[أربع نقاط وصندوق]*
وفي الآخر، أخطاء شايعة في التقويم.‖‖
*[النقطة الأولى: Significance]* ‖ الدلالة الإحصائية. ‖ «Differences between systems are averages over queries. ‖ Use paired tests at query level ‖ to see whether a gain is more than noise». ‖ الفروق بين النظم متوسطات على استعلامات. ‖ استخدم اختبارات مزدوجة على مستوى الاستعلام ‖ لتعرف هل المكسب أكتر من مجرد ضجيج.‖‖
*[النقطة التانية: Overfitting]* ‖ الإفراط في الملاءمة. ‖ «Tuning repeatedly on one set of topics ‖ fits its quirks. Hold out separate topics». ‖ الضبط المتكرر على مجموعة مواضيع واحدة ‖ بيتعلّم خصوصياتها. ‖ احتفظ بمواضيع منفصلة للاختبار.‖‖
*[النقطة التالتة: Metric mismatch]* ‖ عدم تطابق المقياس. ‖ «A model that wins on nDCG ‖ may still feel worse if it ignores freshness or diversity». ‖ نموذج بيكسب في nDCG ‖ ممكن يحسّسك إنه أسوأ لو تجاهل الحداثة أو التنوّع.‖‖
*[النقطة الرابعة: Segment checks]* ‖ فحص الشرايح. ‖ «An average can hide failures ‖ on rare or sensitive queries». ‖ المتوسط ممكن يخفي إخفاقات ‖ على استعلامات نادرة أو حسّاسة.‖‖
*[أشّر على الصندوق الأصفر: Good habit]* ‖ والعادة الجيدة: ‖ «Report effect sizes and confidence along with the mean، ‖ and review actual failures by hand». ‖ سجّل حجم الأثر ومستوى الثقة مع المتوسط، ‖ وراجع الإخفاقات الفعلية بإيدك. ‖ الأرقام بتقولك «فين» المشكلة، ‖ لكن العين بتقولك «ليه».

## الشريحة 13: Key takeaways

*[أربع نقاط]*
نراجع.‖‖
*[الأولى]* ‖ مجموعات الاختبار بتدّي مقارنات قابلة للتكرار ‖ بالوثائق والمواضيع والأحكام.‖‖
*[التانية]* ‖ التجميع بيخلّي الحكم ممكن اقتصاديًا، ‖ لكن ممكن يقلّل تقدير نتايج النظم الجديدة.‖‖
*[التالتة]* ‖ MRR مناسبة للمهام ذات الإجابة الواحدة. ‖ وnDCG بتتعامل مع الصلة المتدرّجة وخصم الموضع.‖‖
*[الرابعة]* ‖ اجمع بين المقاييس غير المتصلة والاختبارات المتصلة، ‖ وتحقّق من الدلالة والتحيّز.‖‖
*[أشّر على اللوحة: Up next]* ‖ الوحدة الجاية والأخيرة: ‖ «Module 7 assembles retrieval and ranking ‖ into a production system»، ‖ يعني نجمّع الاسترجاع والترتيب في نظام إنتاجي.‖‖
*[أشّر على Check yourself]* ‖ وسؤال: ‖ «Why is nDCG divided by the ideal DCG؟» ‖ ليه nDCG بتتقسم على الـ DCG المثالي؟ ‖ علشان الاستعلامات تبقى قابلة للمقارنة.‖‖
وإلى اللقاء في الوحدة الأخيرة.
