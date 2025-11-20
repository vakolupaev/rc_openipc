import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { listen } from '@tauri-apps/api/event';
import { useEffect } from "react";

function App() {
  useEffect(() => {
    let pc = new RTCPeerConnection({
      iceServers: []
    })
    let log = msg => {
      document.getElementById('div').innerHTML += msg + '<br>'
    }

    pc.ontrack = function (event) {
      var el = document.createElement(event.track.kind)
      el.srcObject = event.streams[0]
      el.autoplay = true
      el.controls = true

      document.getElementById('remoteVideos').appendChild(el)
    }

    pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
    pc.onicecandidate = event => {
      if (event.candidate === null) {
        invoke('set_local_session_description_webview', { local_session_description_webview: btoa(JSON.stringify(pc.localDescription)) })
        document.getElementById('localSessionDescription').value = btoa(JSON.stringify(pc.localDescription))
      }
    }

    // Offer to receive 1 audio, and 2 video tracks
    // pc.addTransceiver('audio', {'direction': 'recvonly'})
    pc.addTransceiver('video', {'direction': 'recvonly'})
    // pc.addTransceiver('video', {'direction': 'recvonly'})
    pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log)

    let sd = "";

    let unlisten = listen('new-remote_session_description', (event) => {
      sd = event.payload;
      document.getElementById('remoteSessionDescription').value = event.payload;

      if (sd !== '') {
        setTimeout(() => {
          try {
            pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
          } catch (e) {
            alert(e)
          }
        },0)
      } else {
        return alert('Session Description must not be empty')
      }
      
    });
  })

  return (
    <>
      {/* <div id="remoteVideos"></div> */}
    </>
  );
}

export default App;
