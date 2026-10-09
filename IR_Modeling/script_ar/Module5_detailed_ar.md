# النص التفصيلي للوحدة الخامسة: الأساليب العصبية في الاسترجاع (Neural Approaches to Retrieval)

**المدة التقريبية:** حوالي 2,117 كلمة، أي نحو 17 دقيقة نطق بإيقاع هادئ (قابلة للتقسيم إلى جزأين)
**الشرائح المصاحبة:** IR_Module5_Neural.pptx (14 شريحة، بالإنجليزية) ·  **الأسلوب:** مصرية مهذّبة وواضحة بصوت المعلّم، والمصطلحات التقنية بالإنجليزية كما هي في الشرائح مع شرحها بالعربية
**ملحوظة:** الشرائح باتجاه اليسار لليمين، فالصندوق الأصفر على اليمين أو تحت المحتوى.
**علامات القراءة:** `‖` وقفة قصيرة · `‖‖` وقفة أطول (استنى الشريحة تتحرك) · *[بين قوسين]* تعليمات أداء، مش بتتقال

---

## الشريحة 1: Neural Approaches to Retrieval

أهلاً بيكم في الوحدة الخامسة. ‖ لحد دلوقتي كل النماذج اللي اتعلّمناها، ‖ البوليانى وTF-IDF وBM25 ونماذج اللغة، ‖ بتشترك في صفة واحدة: ‖ هي بتطابق «كلمات». ‖ لو الاستعلام فيه كلمة والوثيقة فيها كلمة تانية بنفس المعنى، ‖ النموذج مش هيربطهم. ‖ النهارده هنشوف إزاي الشبكات العصبية بتحاول تحلّ المشكلة دي: ‖ بتمثّل المعنى نفسه.‖‖
*[أشّر على العنوان]* ‖ عنوان الوحدة: «Neural Approaches to Retrieval»، ‖ الأساليب العصبية في الاسترجاع. ‖ وتحته: «Dense embeddings, rerankers and hybrid search»، ‖ التضمينات الكثيفة، وإعادة الترتيب، والبحث الهجين.‖‖
وده مش موضوع الدورة دي للتحدّث عن شبكات عصبية بالتفصيل. ‖ هنركّز على إزاي بنستخدمها في الاسترجاع، ‖ ومتى بتكسب، ومتى بتخسر.

## الشريحة 2: Learning objectives

*[انتظر ظهور الأهداف]*
أربع أهداف.‖‖
*[الأول]* ‖ «Explain the vocabulary mismatch problem ‖ and why neural models address it». ‖ تشرح مشكلة عدم تطابق المفردات، ‖ وليه النماذج العصبية بتعالجها.‖‖
*[التاني]* ‖ «Describe bi-encoder (dense) retrieval ‖ and how it is trained». ‖ تصف الاسترجاع الكثيف بالمرمّز الثنائي، bi-encoder، ‖ وكيف بيتدرّب.‖‖
*[التالت]* ‖ «Contrast bi-encoders with cross-encoder rerankers ‖ and learned sparse models». ‖ تقارن بين المرمّز الثنائي والمرمّز المتقاطع، ‖ والنماذج المتناثرة المتعلّمة.‖‖
*[الرابع]* ‖ «Combine lexical and neural rankings with rank fusion». ‖ تدمج الترتيبات المعجمية والعصبية بدمج الرتب.

## الشريحة 3: Vocabulary mismatch

*[جدول من ثلاث صفوف]*
نبدأ بالمشكلة اللي بتحرّك الوحدة كلها.‖‖
*[أشّر على الجدول]* ‖ الجدول فيه ثلاث أعمدة: ‖ الاستعلام، والوثيقة ذات الصلة، وما فيها من تطابق في الكلمات.‖‖
*[الصف الأول]* ‖ الاستعلام: «cheap flights to Cairo»، ‖ يعني «رحلات طيران رخيصة للقاهرة». ‖ والوثيقة ذات الصلة بتقول: ‖ «budget airfare to Egypt»، ‖ يعني «أسعار طيران اقتصادية لمصر». ‖ وعدد الكلمات المشتركة: none، ولا واحدة! ‖ cheap ≠ budget، flights ≠ airfare، Cairo ≠ Egypt.‖‖
*[الصف التاني]* ‖ «fix a flat tire»، ‖ يعني إصلاح إطار فاضي. ‖ والوثيقة: «repairing a puncture»، إصلاح ثقب. ‖ وبرضو مفيش كلمة مشتركة.‖‖
*[الصف التالت]* ‖ «heart attack symptoms»، أعراض النوبة القلبية. ‖ والوثيقة: «signs of myocardial infarction»، ‖ علامات احتشاء عضلة القلب. ‖ ودي نفس الحاجة، بالمصطلح الطبي. ‖ ولا كلمة مشتركة.‖‖
*[أشّر على الصندوق الأصفر: The problem]* ‖ والمشكلة: ‖ «Models from Modules 3 and 4 match strings. ‖ People use different words for the same idea، ‖ so relevant documents can score zero. ‖ Neural models aim to match meaning». ‖ نماذج الوحدتين التالتة والرابعة بتطابق سلاسل نصية. ‖ الناس بتستخدم كلمات مختلفة للفكرة الواحدة، ‖ فالوثائق ذات الصلة ممكن تاخد صفر. ‖ والنماذج العصبية بتهدف لمطابقة المعنى.‖‖
*[سؤال للطلاب — اسكت 5 ثواني]* ‖ فكّروا في استعلام عربي: «سيارة مستعملة». ‖ إيه الكلمات المرادفة اللي ممكن توجد في وثيقة مفيدة ومالهاش كلمة مشتركة؟ ‖‖
أمثلة: «عربية مستخدمة»، «مركبة قديمة للبيع»، «سيارات أوفر». ‖ ودي كلها في اللغة اليومية. ‖ وفي العربي المشكلة أكبر، ‖ بسبب اللهجات والفصحى والصيغ المتعددة.

## الشريحة 4: Embeddings: meaning as geometry

*[أربع نقاط وصندوق]*
الحل الأساسي اسمه التضمين، embedding.‖‖
*[النقطة الأولى: Dense vectors]* ‖ المتجهات الكثيفة. ‖ «A text encoder maps a sentence to a vector ‖ of a few hundred numbers، ‖ where every dimension is used». ‖ مرمّز نصي بيحوّل الجملة لمتجه فيه مئات الأرقام، ‖ وكل بُعد مستخدم. ‖ قارنوا ده بمتجه TF-IDF اللي كان فيه مية ألف بعد ‖ أغلبها أصفار. ‖ ده الفرق بين sparse، متناثر، وdense، كثيف.‖‖
*[النقطة التانية: Learned geometry]* ‖ الهندسة المتعلّمة. ‖ «Texts with similar meaning land close together، ‖ even with no shared words». ‖ النصوص ذات المعنى المتشابه بتقع قريبة من بعض، ‖ حتى من غير كلمات مشتركة. ‖ يعني «cheap flights» و«budget airfare» ‖ متجهاتهم قريبة، ‖ مع إن مفيش كلمة مشتركة بينهم.‖‖
*[النقطة التالتة: Same math as before]* ‖ نفس الرياضيات القديمة. ‖ «Relevance is scored by cosine similarity or a dot product، ‖ now in a learned space instead of a term space». ‖ الصلة بتتقيّم بتشابه جيب التمام أو الضرب النقطي، ‖ لكن في فضاء متعلّم بدل فضاء المصطلحات.‖‖
*[النقطة الرابعة: Transformer encoders]* ‖ مرمّزات الـ Transformer. ‖ «Context-aware neural networks produce the vectors، ‖ so a word is read in relation to its neighbors». ‖ شبكات عصبية واعية بالسياق بتنتج المتجهات، ‖ فالكلمة بتتفهم بالنسبة لجيرانها. ‖ يعني كلمة «بنك» جنب «نهر» ‖ مختلفة عن «بنك» جنب «قرض».‖‖
*[أشّر على الصندوق الأصفر: Continuity]* ‖ والاستمرارية: ‖ «The vector space idea from Module 3 survives. ‖ What changes is where the coordinates come from: ‖ learned rather than counted». ‖ فكرة الفضاء المتجهي من الوحدة التالتة لسه موجودة. ‖ اللي اتغيّر هو مصدر الإحداثيات: ‖ بقت متعلّمة بدل ما تكون معدودة.

## الشريحة 5: Scoring with embeddings (toy 2-D example)

*[جدول من أربع صفوف]*
نشوف مثال لعبة بُعدين فقط، ‖ عشان نفهم الفكرة بالأرقام. ‖ في الواقع التضمينات بتبقى بمئات الأبعاد.‖‖
*[الصف الأول: Query]* ‖ الاستعلام: متجه (0.8، 0.6). ‖ ده المرجع.‖‖
*[الصف التاني: Doc A]* ‖ الوثيقة A: «budget airfare»، ‖ ومتجهها (0.6، 0.8). ‖ الـ cosine: ‖ 0.8 ضرب 0.6، زائد 0.6 ضرب 0.8، ‖ يعني 0.48 زائد 0.48، يساوي 0.96. ‖‖
*[الصف التالت: Doc B]* ‖ الوثيقة B: «airline rules»، ‖ ومتجهها (1.0، 0.0). ‖ الـ cosine: ‖ 0.8 ضرب 1، زائد صفر، يساوي 0.8.‖‖
*[الصف الرابع: Doc C]* ‖ الوثيقة C: «pasta recipe»، ‖ ومتجهها (0.0، سالب 1.0). ‖ الـ cosine: ‖ صفر زائد 0.6 ضرب سالب 1، يساوي سالب 0.6. ‖ يعني اتجاه عكسي تقريبًا.‖‖
*[أشّر على الصندوق الأصفر: Reading it]* ‖ وتفسير الجدول: ‖ «Vectors are unit length here, ‖ so the dot product equals cosine». ‖ المتجهات هنا طولها واحد، ‖ فالضرب النقطي يساوي الـ cosine. ‖ «Doc A shares no words with the query ‖ but sits closest in meaning space». ‖ الوثيقة A ما بتتشاركش كلمات مع الاستعلام ‖ لكنها الأقرب في فضاء المعنى. ‖ «Real embeddings use hundreds of dimensions». ‖ والتضمينات الحقيقية بمئات الأبعاد.‖‖
*[سؤال للطلاب — اسكت 5 ثواني]* ‖ ترتيب الوثائق الثلاث حسب الدرجة؟ ‖‖
الإجابة: A أولًا بـ 0.96، ‖ بعدها B بـ 0.8، ‖ وأخيرًا C بـ سالب 0.6. ‖ ولاحظوا إن A جت الأولى مع إنها ما بتتشاركش ولا كلمة مع الاستعلام، ‖ وده بالظبط اللي كان نظام الكلمات هيفوّته.

## الشريحة 6: Bi-encoder architecture

*[رسم من صفّين من صناديق]*
إزاي بيتبني النظام اللي بيستخدم التضمينات؟ ‖ ببنية اسمها bi-encoder، ‖ يعني «مرمّز ثنائي».‖‖
*[أشّر على الصف الأول: OFFLINE]* ‖ الصف الأول: «OFFLINE: encode every document once»، ‖ يعني ترميز كل وثيقة مرة واحدة. ‖ الوثيقة، ‖ بتدخل على المرمّز، يعني الشبكة العصبية، ‖ والناتج متجه بنخزّنه في «فهرس متجهات»، vector index.‖‖
*[أشّر على الصف التاني: ONLINE]* ‖ والصف التاني: ‖ «ONLINE: encode the query and search»، ‖ ترميز الاستعلام والبحث. ‖ الاستعلام يدخل على نفس الشبكة، ‖ والناتج متجه، ‖ ونبحث عن أقرب الجيران، nearest neighbors، ‖ يعني الوثائق الأقرب في الفضاء.‖‖
*[أشّر على الصندوق الأصفر: Why two separate encodings?]* ‖ ولية ترميزين منفصلين؟ ‖ «Document vectors do not depend on the query، ‖ so they can be precomputed. ‖ At query time only one encoding ‖ and one similarity search are needed». ‖ متجهات الوثائق مش بتعتمد على الاستعلام، ‖ فبنقدر نحسبها مسبقًا. ‖ ووقت الاستعلام، محتاجين ترميز واحد وبحث تشابه واحد. ‖ لو كنّا بنركّب الاستعلام مع كل وثيقة، ‖ كنّا هنحتاج تشغيل الشبكة مليار مرة. ‖ وده السبب إن bi-encoder يصلح للمجموعات الكبيرة.

## الشريحة 7: Training with contrastive learning

*[صندوق غامق فيه معادلة]*
وإزاي الشبكة بتتعلّم تحط المتجهات في الأماكن الصحيحة؟ ‖ بالتعلّم التبايني، contrastive learning.‖‖
*[أشّر على المعادلة]* ‖ الخسارة L ‖ تساوي سالب لوغاريتم، ‖ بسط: e أُس s بين q وd موجب، مقسوم على tau. ‖ ومقام: مجموع e أُس s بين q وd، مقسوم على tau، ‖ على كل الوثائق في المجموعة المقارَنة. ‖‖
*[أشّر على الرموز]* ‖ s(q,d): ‖ التشابه بين متجه الاستعلام ومتجه الوثيقة.‖‖
d موجب: ‖ «A document known to be relevant to the query»، ‖ وثيقة معروف إنها ذات صلة.‖‖
tau: ‖ «Temperature: sharpness of the softmax over candidates»، ‖ درجة الحرارة: حدّة الـ softmax على المرشّحين.‖‖
والمجموع: ‖ «Sum over the positive and a set of negative documents»، ‖ مجموع على الوثيقة الموجبة ومجموعة وثائق سالبة.‖‖
*[أشّر على الصندوق الأصفر: Intuition]* ‖ والحدس: ‖ «Raise the score of the relevant document ‖ relative to the others». ‖ ارفع درجة الوثيقة ذات الصلة ‖ بالنسبة لباقي الوثائق. ‖ لأن الخسارة بتصغر لما البسط يكبر بالنسبة للمقام. ‖‖
«Hard negatives، ‖ documents that look relevant but are not، ‖ teach the model the most». ‖ والسوالب الصعبة، ‖ وثائق شكلها ذات صلة لكنها ليست كذلك، ‖ بتعلّم النموذج أكتر من أي حاجة. ‖ لو السوالب كلها عشوائية، زي وصفة طبخ لاستعلام طيران، ‖ النموذج بيتعلّم بسهولة ومش بيتحسّن. ‖ لكن لو السالب «وثيقة عن طيران ولكن مش اللي يريده المستخدم»، ‖ هنا النموذج بيتعلّم التمييز الدقيق.

## الشريحة 8: Where training data comes from

*[أربع بطاقات مرقّمة]*
التعلّم محتاج بيانات. ‖ منين بنجيبها؟‖‖
*[البطاقة 1: Human judgments]* ‖ الأحكام البشرية. ‖ «Accurate but expensive. ‖ Used for fine-tuning and evaluation». ‖ دقيقة لكن مكلفة. ‖ بنستخدمها للضبط الدقيق والتقويم.‖‖
*[البطاقة 2: Click logs]* ‖ سجلات النقرات. ‖ «Plentiful, but clicks reflect ‖ position and presentation bias». ‖ كتيرة، لكن النقرات بتعكس تحيّز الموضع والعرض. ‖ الناس بتضغط على أول نتيجة حتى لو مش أحسن واحدة.‖‖
*[البطاقة 3: Synthetic pairs]* ‖ أزواج اصطناعية. ‖ «Generate queries from documents، ‖ or mine titles and anchor text». ‖ نولّد استعلامات من الوثائق، ‖ أو نستخرج العناوين ونصوص الروابط. ‖ يعني العنوان بيشبه استعلام، ‖ والمقال بيشبه الوثيقة ذات الصلة.‖‖
*[البطاقة 4: Negatives]* ‖ السوالب. ‖ «Sample from lexical top results ‖ to find convincing wrong answers». ‖ نختار من أعلى نتايج البحث بالكلمات، ‖ عشان نلاقي إجابات غلط مقنعة.‖‖
*[أشّر على الصندوق الأصفر: Caution]* ‖ والتحذير: ‖ «Whatever the source، ‖ the model learns that source's notion of relevance، ‖ and may fail on very different domains». ‖ مهما كان المصدر، ‖ النموذج بيتعلّم مفهوم الصلة بتاع المصدر ده، ‖ وممكن يفشل في مجالات مختلفة جدًا. ‖ نموذج اتدرّب على أسئلة ويب عامة ‖ مش هيفهم بالضرورة مصطلحات قانونية.

## الشريحة 9: Cross-encoders and rerankers

*[بطاقتين وصندوق]*
في ثاني نوع من المرمّزات.‖‖
*[البطاقة الأولى: Bi-encoder]* ‖ المرمّز الثنائي: ‖ «Query and document encoded apart»، ‖ الاستعلام والوثيقة بيتشفّروا منفصلين. ‖ «Precomputed vectors»، متجهات محسوبة مسبقًا. ‖ «Fast, good recall»، سريع وبيدّي استدعاء كويس.‖‖
*[البطاقة التانية: Cross-encoder]* ‖ المرمّز المتقاطع: ‖ «Query and document read together»، ‖ الاستعلام والوثيقة بيتقروا مع بعض. ‖ «Sees word interactions»، ‖ بيشوف التفاعلات بين الكلمات. ‖ «Accurate but one pass per pair»، ‖ دقيق لكن بيحتاج مرور كامل لكل زوج. ‖ الشبكة بتاخد الاستعلام والوثيقة ملصوقين ورا بعض، ‖ وبتطلّع درجة واحدة. ‖ فهي بتشوف كل كلمة في الاستعلام ‖ وكل كلمة في الوثيقة وعلاقتهم.‖‖
*[أشّر على الصندوق الأصفر: Resulting architecture]* ‖ والبنية الناتجة: ‖ «Scoring a billion documents ‖ with a cross-encoder is infeasible. ‖ So retrieve a few hundred candidates cheaply، ‖ then rerank them with the expensive model». ‖ تقييم مليار وثيقة بمرمّز متقاطع مستحيل. ‖ فنسترجع بضع مئات من المرشّحين بتكلفة قليلة، ‖ وبعدين نعيد ترتيبهم بالنموذج المكلف. ‖ وده بالظبط الـ funnel اللي هنشوفه في الوحدة السابعة.

## الشريحة 10: Learned sparse retrieval

*[أربع نقاط وصندوق]*
في نوع تالت ذكي، ‖ بيمزج الفكرتين.‖‖
*[النقطة الأولى: Idea]* ‖ الفكرة. ‖ «A neural model predicts which terms describe a document، ‖ including words it never contains، ‖ and assigns weights». ‖ نموذج عصبي بيتنبّأ بالمصطلحات اللي بتوصف الوثيقة، ‖ بما فيها كلمات الوثيقة ما بتحتويهاش، ‖ وبيدّيها أوزان. ‖ يعني وثيقة عن «airfare» ممكن النموذج يضيف لها «flights» و«tickets».‖‖
*[النقطة التانية: Result]* ‖ النتيجة. ‖ «A sparse vector over the vocabulary ‖ that works with the inverted index from Module 2». ‖ متجه متناثر على المفردات، ‖ بيشتغل مع الفهرس المقلوب من الوحدة التانية.‖‖
*[النقطة التالتة: Benefits]* ‖ الفوايد. ‖ «Fast lookups, term-level explanations ‖ and handling of synonyms». ‖ بحث سريع، وتفسيرات على مستوى المصطلح، ‖ ومعالجة للمترادفات.‖‖
*[النقطة الرابعة: Costs]* ‖ التكاليف. ‖ «Larger postings lists ‖ and a model pass over every document at index time». ‖ قوايم أطول، ‖ ومرور النموذج على كل وثيقة وقت الفهرسة.‖‖
*[أشّر على الصندوق الأصفر: Best of both]* ‖ والخلاصة: ‖ «It is a bridge: neural understanding ‖ delivered through the same index structures ‖ and query processing as Modules 2 to 4». ‖ هي جسر: ‖ فهم عصبي مُقدّم عبر نفس هياكل الفهرس ‖ ومعالجة الاستعلام من الوحدات التانية للرابعة.

## الشريحة 11: Hybrid search with rank fusion

*[صندوق غامق فيه معادلة]*
وإزاي ندمج ترتيبين مختلفين، ‖ واحد معجمي وواحد عصبي؟ ‖ بطريقة بسيطة وقوية اسمها دمج الرتب المتبادلة، ‖ Reciprocal Rank Fusion، واختصارها RRF.‖‖
*[أشّر على المعادلة]* ‖ RRF للوثيقة d ‖ تساوي مجموع واحد على: ‖ k زائد رتبة الوثيقة d في المرتّب رقم i.‖‖
*[أشّر على الرموز]* ‖ rank i of d: ‖ «Position of document d in ranker i»، ‖ موضع الوثيقة d في المرتّب رقم i.‖‖
k: ‖ «Constant، often around 60، ‖ damping the advantage of the very top ranks»، ‖ ثابت، غالبًا حوالي ستين، ‖ بيخفّف أفضلية المراتب الأولى جدًا.‖‖
والمجموع: ‖ «Sum over rankers, such as lexical and dense»، ‖ مجموع على المرتّبات، زي المعجمي والكثيف.‖‖
*[أشّر على الصندوق الأصفر: Example]* ‖ والمثال: ‖ وثيقة رتبتها الأولى في BM25، والتالتة عند النموذج الكثيف. ‖ درجتها: ‖ واحد على 61، زائد واحد على 63. ‖ يعني حوالي 0.0164 زائد 0.0159، ‖ يساوي 0.0323. ‖‖
«Documents liked by both lists rise». ‖ الوثائق اللي بتعجب القايمتين بتطلع. ‖ «Using ranks avoids comparing incompatible score scales». ‖ واستخدام الرتب بيتفادى مقارنة مقاييس درجات مش متوافقة. ‖ لأن درجة BM25 ممكن تبقى 18.4، ‖ ودرجة cosine 0.83، ‖ ومش منطقي نجمعهم. ‖ لكن الرتبة في الحالتين رقم صحيح قابل للمقارنة.

## الشريحة 12: Choosing an approach

*[تلات بطاقات]*
متى نستخدم إيه؟‖‖
*[البطاقة الأولى: Lexical]* ‖ المعجمي. ‖ «Exact names, codes, rare terms»، ‖ ممتاز للأسماء الدقيقة والأكواد والمصطلحات النادرة. ‖ «No training needed»، ما يحتاجش تدريب. ‖ «Misses paraphrases»، بيفوّت إعادة الصياغة.‖‖
*[البطاقة التانية: Dense]* ‖ الكثيف. ‖ «Paraphrase and concept matching»، ‖ مطابقة إعادة الصياغة والمفاهيم. ‖ «Needs training and vector search»، ‖ يحتاج تدريب وبحث متجهات. ‖ «Weak on exact identifiers»، ‖ ضعيف في المعرّفات الدقيقة، زي رقم موديل أو كود.‖‖
*[البطاقة التالتة: Hybrid + rerank]* ‖ الهجين مع إعادة الترتيب. ‖ «Covers both strengths»، بيغطّي نقاط القوة في الاتنين. ‖ «More components to run»، فيه مكوّنات أكتر للتشغيل. ‖ «Common production design»، تصميم إنتاجي شائع.‖‖
*[أشّر على الصندوق الأصفر: Advice]* ‖ والنصيحة: ‖ «Neural models are not strictly better. ‖ Evaluate on your own queries ‖ and keep a strong lexical baseline». ‖ النماذج العصبية مش دايمًا أحسن. ‖ قيّم على استعلاماتك أنت، ‖ واحتفظ بخط أساس معجمي قوي.

## الشريحة 13: Limits and risks

*[أربع نقاط وصندوق]*
وفي الآخر لازم نتكلم عن المخاطر.‖‖
*[النقطة الأولى: Domain shift]* ‖ تحوّل المجال. ‖ «A model trained on one domain can fail on another، ‖ such as legal or medical text». ‖ نموذج اتدرّب على مجال ممكن يفشل في تاني، ‖ زي النص القانوني أو الطبي.‖‖
*[النقطة التانية: Opaque scores]* ‖ درجات غامضة. ‖ «It is hard to explain why a vector is close، ‖ unlike a matched term». ‖ صعب نفسّر ليه المتجه قريب، ‖ على عكس المصطلح المتطابق. ‖ لو سألك مدير «ليه الوثيقة دي في الأول؟»، ‖ في BM25 تقوله «بسبب الكلمات دي». ‖ لكن في النموذج العصبي: «لأن المتجهين قريبين».‖‖
*[النقطة التالتة: Cost]* ‖ التكلفة. ‖ «Encoding documents, storing vectors ‖ and serving models add compute and memory». ‖ ترميز الوثائق، وتخزين المتجهات، وتشغيل النماذج، ‖ بتزوّد الحوسبة والذاكرة.‖‖
*[النقطة الرابعة: Exactness]* ‖ الدقة اللفظية. ‖ «Identifiers, rare names and numbers ‖ are often matched better by lexical methods». ‖ المعرّفات والأسماء النادرة والأرقام ‖ غالبًا بتتطابق أحسن بالطرق المعجمية.‖‖
*[أشّر على الصندوق الأصفر: Safeguard]* ‖ والحماية: ‖ «Always compare against a tuned BM25 baseline ‖ on your own judged queries ‖ before adopting a neural component». ‖ قارن دايمًا مع BM25 مضبوط، ‖ على استعلاماتك المحكوم عليها، ‖ قبل ما تعتمد أي مكوّن عصبي.

## الشريحة 14: Key takeaways

*[أربع نقاط]*
نراجع.‖‖
*[الأولى]* ‖ عدم تطابق المفردات بيحدّ من أي نموذج بيطابق سلاسل نصية.‖‖
*[التانية]* ‖ المرمّز الثنائي بيشفّر النصوص باستقلال، ‖ فبيتيح متجهات محسوبة مسبقًا وبحث سريع.‖‖
*[التالتة]* ‖ التعلّم التبايني بيقرّب الأزواج ذات الصلة ‖ وبيبعّد السوالب الصعبة.‖‖
*[الرابعة]* ‖ المرمّز المتقاطع بيعيد ترتيب قايمة قصيرة، ‖ والدمج الهجين بيجمع قوة المعجمي والكثيف.‖‖
*[أشّر على اللوحة: Up next]* ‖ الوحدة الجاية: ‖ «Module 6 shows how to measure ‖ whether any of these models is actually better». ‖ الوحدة السادسة بتورّينا إزاي نقيس ‖ هل أي نموذج منهم أحسن فعلًا.‖‖
*[أشّر على Check yourself]* ‖ وسؤال: ‖ «Why is a cross-encoder used only after a first-stage retriever؟» ‖ ليه المرمّز المتقاطع بيتستخدم بعد مسترجع المرحلة الأولى بس؟ ‖ الإجابة: ‖ بسبب تكلفته، ‖ لأنه بيحتاج مرور كامل لكل زوج. ‖‖
وإلى اللقاء في الوحدة السادسة.
