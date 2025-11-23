#### GStreamer

```shell
gst-launch-1.0 videotestsrc ! video/x-raw,width=640,height=480,format=I420 ! vp8enc error-resilient=partitions keyframe-max-dist=10 auto-alt-ref=true cpu-used=5 deadline=1 ! rtpvp8pay ! udpsink host=127.0.0.1 port=5004
```

#### ffmpeg

```shell
ffmpeg -re -f lavfi -i testsrc=size=640x480:rate=30 -vcodec libvpx -cpu-used 5 -deadline 1 -g 10 -error-resilient 1 -auto-alt-ref 1 -f rtp rtp://127.0.0.1:5004?pkt_size=1200
```

gst-launch-1.0 videotestsrc ! video/x-raw,width=1920,height=1080,format=I420 ! mpph264enc ! rtph264pay config-interval=-1 ! udpsink host=172.20.10.3 port=5004

gst-launch-1.0 videotestsrc ! video/x-raw,width=1920,height=1080,format=I420 ! x264enc ! rtph264pay config-interval=-1 ! udpsink host=172.20.10.3 port=5004