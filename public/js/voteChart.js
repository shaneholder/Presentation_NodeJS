
$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                events: {
                    load: function() {                        
                        var socket = io.connect();
                            series = this.series[0],
                            voteYes = {
                                "y": 0,
                                "name": "Yes",
                                "color:": "#00FF00"
                            },
                            voteNo = {
                                "y": 0,
                                "name": "No",
                                "color:": "#FF0000"                                
                            },
                            votePizza = {
                                "y": 0,
                                "name": "Just here for pizza.",
                                "color:": "#FFFF00"
                            }
                        socket.on('vote', function (data){
                            if (data.vote === 'yes') {
                                voteYes.y = voteYes.y + 1;
                            } else if (data.vote === 'no') {
                                voteNo.y = voteNo.y + 1;
                            } else {
                                votePizza.y = votePizza.y + 1;
                            }
                            series.setData([voteYes, voteNo, votePizza]);
                            console.log(series);
                            console.log(data);
                        });
                    }
                }
            },
            title: {
                text: 'Have you heard of NodeJS?'
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Yes',   0],
                    ['No',       0],                    
                    ['Just here for pizza.',   0]
                ]
            }]
        });
    });
    
});