import{af as s,ag as t,ah as h,b2 as l,j as d,Q as o}from"./index-e32c25e6.js";const y=r=>{let e=class extends r{initialize(){this.handles.add(l(()=>this.layer,"refresh",i=>{this.doRefresh(i.dataChanged).catch(a=>{d(a)||o.getLogger(this.declaredClass).error(a)})}),"RefreshableLayerView")}};return s([t()],e.prototype,"layer",void 0),e=s([h("esri.layers.mixins.RefreshableLayerView")],e),e};export{y as i};