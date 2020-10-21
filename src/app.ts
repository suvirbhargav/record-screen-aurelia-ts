//import { inject } from "aurelia-framework";

import * as RecordRTC from "recordrtc";

//@inject(Element)
export class App {
  element: any;
  stopButtonStatus: boolean;
  theVideo: HTMLMediaElement; //HTMLVideoElement;
  recorder: any;
  //public clock: HTMLCanvasElement;

  constructor(element: any) {
    this.element = element;
    this.stopButtonStatus = true;
  }

  attached() {
    const mediaDevices = navigator.mediaDevices as any;
    const navigatorDevices = navigator as any;
    //const stream = await mediaDevices.getDisplayMedia();
    if (!navigatorDevices.getDisplayMedia && !mediaDevices.getDisplayMedia) {
      const error = "Your browser does NOT support the getDisplayMedia API.";
      //document.querySelector('h1').innerHTML = error;
      //this.headerRef.innerHTML = error;

      const headerRef = <HTMLInputElement>document.getElementById("headerRef");
      headerRef.innerHTML = error;

      //this.video.style.display = "none";

      const videoElement = <HTMLInputElement>(
        document.getElementById("theVideo")
      );
      videoElement.style.display = "none";

      //this.btnStartRecording.style.display = "none";
      //this.btnStopRecording.style.display = "none";

      const startElement = <HTMLInputElement>(
        document.getElementById("btnStartRecording")
      );
      startElement.style.display = "none";

      const element = <HTMLInputElement>(
        document.getElementById("btnStopRecording")
      );
      element.style.display = "none";

      throw new Error(error);
    }
  }

  addStreamStopListener(stream, callback) {
    stream.addEventListener(
      "ended",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.addEventListener(
      "inactive",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.getTracks().forEach(function (track) {
      track.addEventListener(
        "ended",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
      track.addEventListener(
        "inactive",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
    });
  }

  detached() {
    //document.removeEventListener("click", this.handleBodyClick);
  }

  invokeGetDisplayMedia(success, error) {
    /*     let displaymediastreamconstraints = {
      video: {
        displaySurface: "monitor", // monitor, window, application, browser
        logicalSurface: true,
        cursor: "always", // never, always, motion
      },
    }; */

    // above constraints are NOT supported YET
    // that's why overriding them
    const displaymediastreamconstraints = {
      video: true,
    };

    const mediaDevices = navigator.mediaDevices as any;

    const navigatorDevices = navigator as any;

    if (mediaDevices.getDisplayMedia) {
      mediaDevices
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    } else {
      navigatorDevices
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    }
  }

  captureScreen(callback) {
    this.invokeGetDisplayMedia(
      function (screen) {
        callback(screen);
      },
      function (error) {
        console.error(error);
        alert(
          "Unable to capture your screen. Please check console logs.\n" + error
        );
      }
    );
  }

  startRecording = () => {
    console.log("clicked start");
    //this.disabled = true;

    //this.btnStartRecording.disabled = true;
    const element = <HTMLInputElement>(
      document.getElementById("btnStartRecording")
    );
    element.disabled = true;

    //var localthis = this;

    this.captureScreen((screen) => {
      //this.theVideo.srcObject = screen;
      //const theVideo = <HTMLMediaElement>document.getElementById("theVideo");
      this.theVideo.srcObject = screen;

      //document.theVideo.HTMLMediaElement.srcObject = screen;

      this.recorder = RecordRTC(screen, {
        type: "video",
      });

      this.recorder.startRecording();

      // release screen on stopRecording
      this.recorder.screen = screen;

      //this.document.getElementById("btnStopRecording").stopButtonStatus = false;

      //this.stopButtonStatus = false;
      console.log("capture ...");
      //this.btnStopRecording.stopButtonStatus = true;

      this.stopButtonStatus = false;
    });
  };

  stopRecording = () => {
    console.log("clicked stop");
    //this.disabled = true;
    this.stopButtonStatus = true;
    this.recorder.stopRecording(this.stopRecordingCallback);
  };

  stopRecordingCallback = () => {
    this.theVideo.src = this.theVideo.srcObject = null;
    this.theVideo.src = URL.createObjectURL(this.recorder.getBlob());

    this.recorder.screen.stop();
    this.recorder.destroy();
    this.recorder = null;

    const element = <HTMLInputElement>(
      document.getElementById("btnStartRecording")
    );
    element.disabled = false;
  };
}
