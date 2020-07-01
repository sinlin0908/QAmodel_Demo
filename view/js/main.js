{
  let data = {
    loading: false,
    isSpeaking: false,
    isListening: false,
    input: {
      paragraph: "",
      question: ""
    },
    news: [],
    answer: "",
    imgPath: {
      stop: "../img/close.png",
      playing: "../img/animate.gif"
    },
    imgSrc: "../img/close.png",
    requestAnswerURL: "https://140.123.97.121:8080/answer",
    requestNewsUrl: "https://140.123.97.121:3002/paragraphs",
    speechRecognizer: null,
    synth: null,
  };

  function createSpeechRecognizer() {
    let SpeechRecognizer = null;
    let speechRecognizer = null;
    let listenButton = document.querySelector(".listener-btn");

    try {
      SpeechRecognizer = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognizer = new SpeechRecognizer();
      speechRecognizer.lang = "zh-TW";
      speechRecognizer.continuous = false;
      speechRecognizer.interimResults = false;

    } catch (e) {
      console.log(e);
    }

    return speechRecognizer;
  }

  function createSpeechSynthesis() {
    const synth = window.speechSynthesis;

    window.addEventListener("beforeunload", event => {
      synth.cancel();
    });

    return synth;
  }

  new Vue({
    el: "#app",
    data: data,
    mounted() {
      axios
        .get(this.requestNewsUrl)
        .then(response => {
          let data = response.data['paragraphs'];
          this.news = data.map(oneNews => {
            let {
              title,
              content
            } = oneNews;
            return {
              title: title,
              content: content.replace(/\s/g, '')
            }
          });
        })
        .catch(err => {
          console.log(err);
        });

      this.speechRecognizer = createSpeechRecognizer();
      this.speechRecognizer.addEventListener("end", (event) => {
        this.isListening = false;
      });

      this.speechRecognizer.addEventListener("error", event => {
        console.log(event);
        this.isListening = false;
      });

      this.speechRecognizer.addEventListener("start", event => {
        this.speechRecognizer.stop();
        this.isListening = true;
      });

      this.speechRecognizer.addEventListener("result", event => {
        let result = event.results[0][0].transcript;
        this.input.question = result;
      })


      this.synth = createSpeechSynthesis();

    },
    methods: {
      speakParagraph() {
        if (this.synth.speaking) {
          this.isSpeaking = !this.synth.speaking;
          this.synth.cancel();
        } else {
          this.speak(this.input.paragraph, {
            onstart: this.startSpeakHandler,
            onend: this.endSpeakHandler
          });
        }
      },
      startSpeakHandler() {
        this.isSpeaking = true;
        this.playAnimationHandler();
      },
      endSpeakHandler() {
        this.isSpeaking = false;
        this.stopAnimationHandler();
      },
      listenQuestion() {
        this.speechRecognizer.start();
      },
      submitQuery() {
        let {
          paragraph,
          question
        } = this.input;

        if (!paragraph || !question) {
          return;
        }
        this.loading = true;
        try {
          axios
            .post(this.requestAnswerURL, {
              paragraph: paragraph,
              question: question
            })
            .then(res => {
              this.loading = false;
              this.answer = res.data.answer.replace(/\s/g, '');
              this.speakAnswer();
            })
            .catch(err => {
              console.log(err);
            });
        } catch (e) {
          console.log("catch", e);
        }
      },
      playAnimationHandler() {
        this.imgSrc = this.imgPath.playing;
      },
      stopAnimationHandler() {
        this.imgSrc = this.imgPath.stop;
      },
      speak(content, parameter) {

        if (!content) {
          return;
        }
        let utter = new SpeechSynthesisUtterance();
        utter.rate = 1.5;
        utter.pitch = 1;
        utter.addEventListener("start", parameter.onstart);
        utter.addEventListener("end", parameter.onend);

        utter.text = content;
        this.synth.cancel();
        this.synth.speak(utter);
      },
      speakAnswer() {
        this.speak(this.answer, {
          onstart: this.playAnimationHandler,
          onend: this.stopAnimationHandler
        });
      }
    }
  });
}