//Desarrollo de las visualizaciones
import * as d3 from 'd3';
//import { numberWithCommas2 } from './helpers';
//import { getInTooltip, getOutTooltip, positionTooltip } from './modules/tooltip';
import { setChartHeight } from '../modules/height';
import { setChartCanvas, setChartCanvasImage } from '../modules/canvas-image';
import { setRRSSLinks } from '../modules/rrss';
import { setFixedIframeUrl } from './chart_helpers';

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42',
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0',
COLOR_GREY_1 = '#D6D6D6', 
COLOR_GREY_2 = '#A3A3A3',
COLOR_ANAG__PRIM_1 = '#BA9D5F', 
COLOR_ANAG_PRIM_2 = '#9E6C51',
COLOR_ANAG_PRIM_3 = '#9E3515',
COLOR_ANAG_COMP_1 = '#1C5A5E';

export function initChart(iframe) {
    //Lectura de datos
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiazCSIC/informe_perfil_mayores_2022_economia_3_2/main/data/brecha_genero_pensiones_europa_v2.csv', function(error,data) {
        if (error) throw error;

        // sort data
        data.sort(function(b, a) {
            return +a.Value - +b.Value;
        });

        //Desarrollo del gráfico
        let currentType = 'viz';

        let margin = {top: 10, right: 10, bottom: 30, left: 95},
            width = document.getElementById('viz').clientWidth - margin.left - margin.right,
            height = document.getElementById('viz').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#viz")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        let x = d3.scaleLinear()
        .domain([ 0, 50 ])
        .range([ 0, width]); 

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.GEO; }))
        .padding(0.25);

        svg.append("g")
            .call(d3.axisLeft(y));

        function initViz() {
            // Bars
            svg.selectAll("bars")
                .data(data)
                .enter()
                .append("rect")
                .attr('class', 'prueba')
                .attr("fill", function(d) {
                    if (d.GEO == 'Spain' || d.GEO == 'UE-27') {
                        return COLOR_ANAG_2;
                    } else {
                        return COLOR_PRIMARY_1;
                    }
                })
                .attr("y", function(d) { return y(d.GEO); })
                .attr("height", y.bandwidth())
                .attr("x", function(d) { return x(0); })            
                .attr("width", function(d) { return 0; })
                .transition()
                .duration(2000)
                .attr("width", function(d) { return x(+d.Value); })
        }

        function animateChart() {
            svg.selectAll(".prueba")
                .attr("fill", function(d) {
                    if (d.GEO == 'Spain' || d.GEO == 'UE-27') {
                        return COLOR_ANAG_2;
                    } else {
                        return COLOR_PRIMARY_1;
                    }
                })
                .attr("x", function(d) { return x(d.GEO); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(0); })            
                .attr("height", function(d) { return 0; })
                .transition()
                .duration(2000)            
                .attr("y", function(d) { return y(+d.Value); })            
                .attr("height", function(d) { return height - y(+d.Value); });        
        }

        ///// CAMBIO
        function setChart(type) {
            if(type != currentType) {
                if(type == 'viz') {
                    //Cambiamos color botón
                    document.getElementById('data_map').classList.remove('active');
                    document.getElementById('data_viz').classList.add('active');
                    //Cambiamos gráfico
                    document.getElementById('map').classList.remove('active');
                    document.getElementById('viz').classList.add('active');
                } else {
                    //Cambiamos color botón
                    document.getElementById('data_map').classList.add('active');
                    document.getElementById('data_viz').classList.remove('active');
                    //Cambiamos gráfico
                    document.getElementById('viz').classList.remove('active');
                    document.getElementById('map').classList.add('active');
                }
            }            
        }

        /////
        /////
        // Resto - Chart
        /////
        /////
        initViz();

        document.getElementById('data_viz').addEventListener('click', function() {            
            //Cambiamos gráfico
            setChart('viz');
            //Cambiamos valor actual
            currentType = 'viz';
        });

        document.getElementById('data_map').addEventListener('click', function() {
            //Cambiamos gráfico
            setChart('map');
            //Cambiamos valor actual
            currentType = 'map';
        });

        //Animación del gráfico
        document.getElementById('replay').addEventListener('click', function() {
            animateChart();
        });

        //////
        ///// Resto
        //////

        //Iframe
        setFixedIframeUrl('informe_perfil_mayores_2022_economia_3_2','brecha_genero_pensiones');

        //Redes sociales > Antes tenemos que indicar cuál sería el texto a enviar
        setRRSSLinks('brecha_genero_pensiones');

        //Captura de pantalla de la visualización
        setChartCanvas();      

        let pngDownload = document.getElementById('pngImage');

        pngDownload.addEventListener('click', function(){
            setChartCanvasImage('brecha_genero_pensiones');
        });

        //Altura del frame
        setChartHeight(iframe);        
    });

    
}