import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';


import { AgoraClient, ClientEvent, NgxAgoraService, Stream, StreamEvent } from 'ngx-agora';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


 localCallId = 'agora_local';
 remoteCalls: string[] = [];

 config = {
    mode: "live",
    codec: "h264",   
    AppID: "ca684964104241ffadd816aad17be4b8" 
 }

  private client: AgoraClient;
  private localStream: Stream;
  private uid: number;

  constructor( private ngxAgoraService: NgxAgoraService,) {

    this.uid = Math.floor(Math.random() * 100);
    //console.log(this.uid)
    //console.log(this.localStream);

    

  }


PushToconsole(){
  console.log(this.ngxAgoraService.audioDevices)
  console.log(this.ngxAgoraService.videoDevices)
  console.log(this.remoteCalls);
}


ngOnInit() {

    console.log("1. Create Client");
    this.client = this.ngxAgoraService.createClient(this.config);

    console.log("2. Assign Client Handlers");
    this.assignClientHandlers();

    console.log("3. Create Stream");
    this.localStream = this.ngxAgoraService.createStream({ streamID: this.uid, audio: true, video: true, screen: false });

    console.log("4. Assign Local Stream Handlers");
    this.assignLocalStreamHandlers();

    // // Join and publish methods added in this step
    console.log("5. Join & Publish Triggers");    
    this.initLocalStream(() => this.join(uid => this.publish(), error => console.error(error)));
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(onSuccess?: (uid: number | string) => void, onFailure?: (error: Error) => void): void {
    this.client.join(null, 'sugan@108', this.uid, onSuccess, onFailure);
  
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void { 
    this.client.publish(this.localStream, err => console.log('Publish local stream error: ' + err));
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, evt => {
      console.log('Publish local stream successfully');
    });

    this.client.on(ClientEvent.Error, error => {
      console.log('Got error msg:', error.reason);
      if (error.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.client.renewChannelKey(
          '',
          () => console.log('Renewed the channel key successfully.'),
          renewError => console.error('Renew channel key failed: ', renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, evt => {
      console.log("-- Remote Stream Added");
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true }, err => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, evt => {
      console.log("-- Remote Stream Subcribed");
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, evt => {
      console.log("-- Remote Stream Removed");
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, evt => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call !== `${this.getRemoteId(stream)}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log('accessAllowed');
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log('accessDenied');
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      err => console.error('getUserMedia failed', err)
    );
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }  

private leave() {
  this.client.stopLiveStreaming;
  
    this.client.leave(() => {
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
  
  
  } 
  
private joinAgain(){

    console.log("5. Join & Publish Triggers");    
    this.join(uid => this.publish(), error => console.error(error));

}  
  }
