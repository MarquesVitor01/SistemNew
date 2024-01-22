import React from "react";
import './testemunho.css'
function Testemunho(){
    return <section className="testemunho" id="testemunho">
        <div className="container">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
  <ol className="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div className="carousel-inner testemunho">
    <div className="carousel-item active box">
      <img className="d-block w-100 " src="https://www.limely.co.uk/wp-content/uploads/google-streetview-camera.jpg" alt="Primeiro Slide"/>
    </div>
    <div className="carousel-item box">
      <img className="d-block w-100" src="http://4.bp.blogspot.com/-u9p2Yo4ZKL4/WN1Wl-ah2qI/AAAAAAAACt4/OyEfGFfl7jkIn5d1IaTprZFqgD18cLy-ACK4B/s1600/360-photos.PNG" alt="Segundo Slide"/>
    </div>
    <div className="carousel-item box">
      <img className="d-block w-100" src="https://www.allinallnews.com/wp-content/uploads/2015/05/Google-Maps.png" alt="Terceiro Slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Anterior</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Próximo</span>
  </a>
</div>
        </div>
    </section>
}
export default Testemunho;