<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from '@tauri-apps/api/event';

  let pc = new RTCPeerConnection({
    iceServers: []
  })

  pc.ontrack = event => {
    let el: HTMLVideoElement = document.getElementById("vid") as HTMLVideoElement;
    el!.srcObject = event.streams[0]
  }
  
  pc.onicecandidate = event => {
    if (event.candidate === null) {

      invoke('set_local_session_description_webview', { local_session_description_webview: btoa(JSON.stringify(pc.localDescription)) })
    }
  }

  listen('new-remote_session_description', (event: {payload: string}) => {
    let sd = event.payload;
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

  pc.addTransceiver('video', {'direction': 'recvonly'})
  pc.createOffer().then(d => pc.setLocalDescription(d))

</script>

<video id="vid" autoplay>
  <track kind="captions">
</video>

<style>

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}

</style>
