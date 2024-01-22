import React from "react";
import Menu from "./Componentes/menu"
import Banner from "./Componentes/banner"
import Features from "./Componentes/features"
import Testemunho from "./Componentes/testemunho"
import Precos from "./Componentes/precos"
import Footer from "./Componentes/footer"
function Site(){
    return <div>
       <Menu />
       <Banner />
       <Features />
       <Testemunho />
       {/* <Precos /> */}
       <Footer />
    </div>
}
export default Site;