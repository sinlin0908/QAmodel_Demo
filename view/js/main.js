{
  let data = {
    loading: false,
    input: {
      paragraph: "",
      question: "",
    },
    answer: "",
    imgPath: {
      stop: "../img/close.png",
      playing: "../img/animate.gif"
    },
    imgSrc: "../img/close.png"
  };

  new Vue({
    el: "#app",
    data: data,
    methods: {
      submitQuery() {
        let {
          paragraph,
          question
        } = this.input;

        if (!paragraph || !question) {
          return;
        }
        this.loading = true;

        axios.post("http://localhost:8100/answer", {
          paragraph: paragraph,
          question: question
        }).then((res) => {
          this.loading = false;
          console.log(res.data);

          /**
           * show answer
           */
          this.answer = res.data.answer;

          /**
           * play animation and TTS
           */

          this.speakAnswer();

        }).catch((err) => {
          console.log(err);
        });

      },
      playAnimation() {
        console.log("play animation...");
        this.imgSrc = this.imgPath.playing;

      },
      stopAnimation() {
        console.log("stop animation...");
        this.imgSrc = this.imgPath.stop;
      },
      speakAnswer() {
        console.log(`speak answer: ${this.answer}`);

        responsiveVoice.cancel();

        let parameter = {
          onstart: this.playAnimation,
          onend: this.stopAnimation
        };

        if (responsiveVoice.voiceSupport()) {
          responsiveVoice.speak(this.answer, "Chinese Female", parameter);
        } else {
          console.log("voice GG...");
        }
      }
    }
  });
}