(()=>{"use strict";class t{#t;#e;#i;#s;#h;#n;constructor(){this.#t={x:0,y:0},this.#e={x:0,y:0},this.#i={x:0,y:0},this.#s=0,this.#h={x:0,y:0},this.#n=0}setPosition(t,e){this.#t.x=t+this.#e.x/2,this.#t.y=e+this.#e.y/2}setSize(t,e){this.#e.x=t,this.#e.y=e,this.setCollisionSize(t,e)}setCollisionSize(t,e){this.#i.x=t,this.#i.y=e}setAngle(t){this.#s=t}setVelocity(t,e){this.#h.x=t,this.#h.y=e}setAngularVelocity(t){this.#n=t}setCenter(t,e){this.#t.x=t,this.#t.y=e}displace(t,e){this.#t.x+=t,this.#t.y+=e}autoMove(t){let e=this.#h.x*t,i=this.#h.y*t,s=this.#n*t;this.displace(e,i),this.rotate(s)}rotate(t){this.#s+=t}position(){return{x:this.#t.x-this.#e.x/2,y:this.#t.y-this.#e.y/2}}center(){return this.#t}edge(){return{left:this.#t.x-this.#e.x/2,right:this.#t.x+this.#e.x/2,top:this.#t.y-this.#e.y/2,bottom:this.#t.y+this.#e.y/2}}collisionEdge(){return{left:this.#t.x-this.#i.x/2,right:this.#t.x+this.#i.x/2,top:this.#t.y-this.#i.y/2,bottom:this.#t.y+this.#i.y/2}}width(){return this.#e.x}height(){return this.#e.y}collisionSize(){return this.#i}angle(){return this.#s}velocity(){return this.#h}angularVelocity(){return this.#n}}class e extends t{constructor(t){super(),this.gamePanel=t,this.maxSpeed=t.game.settings.paddleMaxSpeed}setVelocityAngle(t){t*=Math.PI/180;let e=this.maxSpeed*Math.cos(t),i=-this.maxSpeed*Math.sin(t);this.setVelocity(e,i)}stop(){this.setVelocity(0,0)}update(t){this.autoMove(t);let e=this.gamePanel.edge(),i=this.velocity();this.edge().left<e.left?(this.setPosition(e.left,this.position().y),this.setVelocity(0,i.y)):this.edge().right>e.right&&(this.setPosition(e.right-this.width(),this.position().y),this.setVelocity(0,i.y)),this.edge().top<e.top?(this.setPosition(this.position().x,e.top),this.setVelocity(i.x,0)):this.edge().bottom>e.bottom&&(this.setPosition(this.position().x,e.bottom-this.height()),this.setVelocity(i.x,0))}draw(){let t=this.gamePanel.game.ctx;t.fillStyle="#fce",t.fillRect(this.position().x,this.position().y,this.width(),this.height())}}class i{constructor(t){this.game=t,this.keyInput=new s(t),document.addEventListener("keydown",(t=>{this.keyInput.keyDown(t.key)})),document.addEventListener("keyup",(t=>{this.keyInput.keyUp(t.key)}))}}class s{constructor(t){this.game=t,this.keyHeld=[],this.conflictingKeys=[["ArrowLeft","ArrowRight"],["ArrowUp","ArrowDown"]],this.equivalentKeys={a:"ArrowLeft",d:"ArrowRight",w:"ArrowUp",s:"ArrowDown"}}keyDown(t){this.keyHeld=this.keyHeld.filter((e=>e!=t)),this.keyHeld.push(t),this.keyAction()}keyUp(t){this.keyHeld.includes(t)||console.log("Error: keyHeld does not have keys that're pressed!"),this.keyHeld.splice(this.keyHeld.indexOf(t),1),this.keyAction()}keyAction(){let t=this.keyHeld[this.keyHeld.length-1];" "===t?this.game.newGame():"Escape"===t||"p"===t?this.game.togglePaused():"="===t&&(this.game.gameState=4);let e=this.game.gamePanel.paddle,i=this.activeConflictingKeys();i.includes("ArrowLeft")?i.includes("ArrowUp")?e.setVelocityAngle(135):i.includes("ArrowDown")?e.setVelocityAngle(-135):e.setVelocityAngle(180):i.includes("ArrowRight")?i.includes("ArrowUp")?e.setVelocityAngle(45):i.includes("ArrowDown")?e.setVelocityAngle(-45):e.setVelocityAngle(0):i.includes("ArrowUp")?e.setVelocityAngle(90):i.includes("ArrowDown")?e.setVelocityAngle(-90):e.stop()}activeConflictingKeys(){let t=[],e=[...this.keyHeld],i=Array(this.conflictingKeys.length).fill(!1);for(;e.length>0;){let s=e.pop();s in this.equivalentKeys&&(s=this.equivalentKeys[s]);for(let e=0;e<this.conflictingKeys.length;e++)if(!i[e]&&this.conflictingKeys[e].includes(s)){i[e]=!0,t.push(s);break}}return t}}function h(t,e){let i=t.collisionEdge(),s=e.collisionEdge();return Math.max(i.top,s.top)<Math.min(i.bottom,s.bottom)&&Math.max(i.left,s.left)<Math.min(i.right,s.right)}class n extends t{constructor(t){super(),this.image=document.getElementById("img-ball"),this.gamePanel=t;let e=t.game.settings,{frictionFactor:i,gravityFactor:s}=t.game.difficultyFactor();this.friction=e.friction*i,this.gravity=e.gravity*s,this.bounceLoss=e.bounceLoss}update(t){this.autoMove(t);let e=this.velocity();e.x*=1-this.friction,e.y*=1-this.friction,e.y+=this.gravity*t,this.setVelocity(e.x,e.y);let i=this.center(),s=this.gamePanel.edge();e=this.velocity(),i.x<s.left&&(this.setCenter(2*s.left-i.x,i.y),this.setVelocity(-e.x*(1-this.bounceLoss),e.y)),i.x>s.right&&(this.setCenter(2*s.right-i.x,i.y),this.setVelocity(-e.x*(1-this.bounceLoss),e.y)),i.y<s.top&&(this.setCenter(i.x,2*s.top-i.y),this.setVelocity(e.x,-e.y*(1-this.bounceLoss)));let n=this.angularVelocity(),l=this.gamePanel.paddle;i=this.center(),e=this.velocity(),h(this,l)&&(this.setCenter(i.x,2*l.edge().top-i.y),this.setVelocity(.6*e.x+.4*l.velocity().x,(-e.y+1.5*l.velocity().y)*(1-this.bounceLoss)),n+=(e.x-l.velocity().x)/(this.width()/2),this.setAngularVelocity(n))}draw(){let t=this.gamePanel.game.ctx;t.translate(this.center().x,this.center().y),t.rotate(this.angle()),t.drawImage(this.image,-this.width()/2,-this.height()/2,this.width(),this.height()),t.rotate(-this.angle()),t.translate(-this.center().x,-this.center().y)}}class l extends t{constructor(t,e,i){super(),this.gamePanel=t,this.setSize(e.x,e.y),this.setPosition(i.x,i.y),this.markedForDeletion=!1,this.color="#f";for(let t=0;t<2;t++)this.color+=Math.floor(8+6*Math.random()).toString(16)}update(){if(h(this.gamePanel.ball,this)){this.markedForDeletion=!0;let t=this.gamePanel.ball.velocity();this.gamePanel.ball.setVelocity(t.x,-t.y)}}draw(){let t=this.gamePanel.game.ctx;t.fillStyle=this.color,t.fillRect(this.position().x,this.position().y,this.width(),this.height())}}function a(t){let e=[],i=t.game.settings,s=i.brickNumRowMin,h=i.brickNumRowMax,n=i.brickNumCol,a=t.width()/n,o=a/2,r=s+Math.random()*(h-s);for(let i=0;i<r;i++)for(let s=0;s<n;s++)if(Math.random()<.7){let h={x:a,y:o},n={x:t.position().x+a*s,y:t.position().y+o*i};e.push(new l(t,h,n))}return e}class o extends t{constructor(t){super(),this.game=t}draw(){let t=this.game.ctx;t.fillStyle="#000",t.fillRect(this.position().x,this.position().y,this.width(),this.height()),t.font=.05*this.height()+"px Serif",t.fillStyle="#fff",t.textAlign="center",t.fillText("Press Space To Start",this.center().x,this.center().y)}}class r extends t{constructor(t){super(),this.game=t}draw(){let t=this.game.ctx;t.fillStyle="rgba(0, 0, 0, 0.5)",t.fillRect(this.position().x,this.position().y,this.width(),this.height()),t.font=.1*this.height()+"px Serif",t.fillStyle="#fff",t.textAlign="center",t.fillText("Paused",this.center().x,this.center().y)}}class c extends t{constructor(t){super(),this.game=t}draw(){let t=this.game.ctx;t.fillStyle="rgba(240, 192, 224, 0.9)",t.fillRect(this.position().x,this.position().y,this.width(),this.height()),t.fillStyle="#fff",t.textAlign="center",t.font=.1*this.height()+"px Serif",t.fillText("You Win!",this.center().x,this.center().y),t.font=.05*this.height()+"px Serif",t.fillText("Life +1",this.center().x,this.center().y+.15*this.height()),t.fillText("Press Space To Continue",this.center().x,this.center().y+.3*this.height())}}class g extends t{constructor(t){super(),this.game=t}draw(){let t=this.game.ctx;t.fillStyle="rgba(0, 0, 0, 0.5)",t.fillRect(this.position().x,this.position().y,this.width(),this.height()),t.font=.1*this.height()+"px Serif",t.fillStyle="#fff",t.textAlign="center",t.fillText("Game Over",this.center().x,this.center().y)}}class d extends t{constructor(t){super(),this.game=t}draw(){let t=this.game.ctx,e=this.edge(),i=this.game.data,s=this.game.settings,h=this.game.gamePanel.ball,{levelFactor:n,spinFactor:l}=this.game.scoreFactor();t.fillStyle="#fff",t.font=.4*this.height()+"px Serif",t.textAlign="left",t.fillText("Level "+i.level.toString(),e.left,this.center().y),t.textAlign="center",t.fillText("Score "+Math.round(i.score).toString(),this.center().x,this.center().y),t.textAlign="right",t.fillText("Life "+i.life.toString(),e.right,this.center().y),t.font=.2*this.height()+"px Serif",t.textAlign="left",t.fillText("Gravity: "+Math.round(h.gravity/s.gravity).toString(),e.left,e.bottom-this.height()/4),t.fillText("Friction: "+Math.round(h.friction/s.friction).toString()+"  ("+h.friction.toFixed(2).toString()+")",e.left,e.bottom),t.textAlign="center",t.fillText("From Level: X "+n.toString(),this.center().x,e.bottom-this.height()/4),t.fillText("From Spin: X "+l.toString(),this.center().x,e.bottom),t.fillStyle="#f"+Math.floor((8-l)/7*15).toString(16)+Math.floor((8-l)/7*15).toString(16),t.font=.4*this.height()+"px Serif",t.textAlign="right",t.fillText("Spin: "+Math.round(Math.abs(1e3*h.angularVelocity()*60/(2*Math.PI))).toString()+" rpm",e.right,e.bottom)}}class y extends t{constructor(t){super(),this.game=t}init(t){let i=this.game.settings;this.paddle=new e(this),this.ball=new n(this),this.paddle.setSize(i.paddleWidth,i.paddleHeight),this.paddle.setCenter(this.center().x,this.edge().bottom-.02*this.height()-this.paddle.height()),this.ball.setSize(i.ballSize,i.ballSize),this.ball.setCollisionSize(1,1),this.ball.setCenter(this.paddle.center().x+1,this.paddle.edge().top),this.ball.setVelocity(0,0),this.bricks=t,this.gameObjects=[...this.bricks,this.paddle,this.ball]}update(t){this.gameObjects.forEach((e=>{e.update(t)}));let e=this.gameObjects.length;this.gameObjects=this.gameObjects.filter((t=>!t.markedForDeletion));let{levelFactor:i,spinFactor:s}=this.game.scoreFactor();this.game.data.score+=(e-this.gameObjects.length)*i*s}draw(){let t=this.game.ctx;t.fillStyle="#fff",t.fillRect(this.position().x,this.position().y,this.width(),this.height()),this.gameObjects.forEach((t=>{t.draw()}))}}let m=document.getElementById("canvas").getContext("2d"),f=new class extends t{constructor(t){super(),this.ctx=t,this.ctx.canvas.width=window.innerWidth,this.ctx.canvas.height=window.innerHeight,this.setCenter(window.innerWidth/2,window.innerHeight/2);let e=Math.min(window.innerWidth,window.innerHeight);this.setSize(e,e),this.titleScreen=new o(this),this.pauseScreen=new r(this),this.victoryScreen=new c(this),this.gameOverScreen=new g(this),this.titleScreen.setSize(this.width(),this.height()),this.pauseScreen.setSize(this.width(),this.height()),this.victoryScreen.setSize(this.width(),this.height()),this.gameOverScreen.setSize(this.width(),this.height()),this.titleScreen.setCenter(this.center().x,this.center().y),this.pauseScreen.setCenter(this.center().x,this.center().y),this.victoryScreen.setCenter(this.center().x,this.center().y),this.gameOverScreen.setCenter(this.center().x,this.center().y),this.infoPanel=new d(this),this.gamePanel=new y(this);let s=.02*e;this.infoPanel.setSize(this.width()-2*s,.15*this.height()-1.5*s),this.infoPanel.setPosition(this.position().x+s,this.position().y+s),this.gamePanel.setSize(this.width()-2*s,this.height()-this.infoPanel.height()-3*s),this.gamePanel.setPosition(this.position().x+s,this.infoPanel.edge().bottom+s),this.settings={paddleWidth:.25*this.gamePanel.width(),paddleHeight:.025*this.gamePanel.width(),paddleMaxSpeed:this.gamePanel.width()/2e3,ballSize:.08*this.gamePanel.width(),friction:5e-4,gravity:3e-4,bounceLoss:.1,brickNumRowMin:4,brickNumRowMax:10,brickNumCol:10},this.gameState=2,new i(this)}newGame(){if(1!==this.gameState&&0!==this.gameState){if(2===this.gameState||3===this.gameState)this.data={life:2,score:0,level:1},this.gamePanel.init(a(this.gamePanel));else if(4===this.gameState)this.data.life+=1,this.data.level+=1,this.gamePanel.init(a(this.gamePanel));else if(5===this.gameState){this.data.life-=1;let t=this.gamePanel.gameObjects;this.gamePanel.init(t.slice(0,t.length-2))}else console.log("Error: Unknown game state!");this.gameState=1}}update(t){1===this.gameState&&(this.gamePanel.update(t),2===this.gamePanel.gameObjects.length&&(this.gameState=4),this.gamePanel.ball.edge().top>this.gamePanel.edge().bottom&&(0===this.data.life?this.gameState=3:(this.gameState=5,this.newGame())))}draw(){this.ctx.clearRect(0,0,window.innerWidth,window.innerHeight),this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight),2===this.gameState&&this.titleScreen.draw(),1===this.gameState&&(this.infoPanel.draw(),this.gamePanel.draw()),0===this.gameState&&(this.infoPanel.draw(),this.gamePanel.draw(),this.pauseScreen.draw()),3===this.gameState&&(this.infoPanel.draw(),this.gamePanel.draw(),this.gameOverScreen.draw()),4===this.gameState&&(this.infoPanel.draw(),this.gamePanel.draw(),this.victoryScreen.draw()),5===this.gameState&&(this.infoPanel.draw(),this.gamePanel.draw())}togglePaused(){1===this.gameState?this.gameState=0:0===this.gameState&&(this.gameState=1)}scoreFactor(){let t=this.data.level,e=this.gamePanel.ball.angularVelocity(),i=Math.abs(1e3*e*60/(2*Math.PI));return{levelFactor:t,spinFactor:Math.floor(1+7*Math.log((100+i)/100)/Math.log(21))}}difficultyFactor(){return{frictionFactor:(1-Math.pow(1-this.settings.friction,this.data.level))/this.settings.friction,gravityFactor:this.data.level}}}(m),x=0;requestAnimationFrame((function t(e){let i=e-x;x=e,f.update(i),f.draw(),requestAnimationFrame(t)}))})();