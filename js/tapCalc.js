;(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory();
  } else if(typeof define === 'function' && define.amd) {
    define([], factory);
  } else if(typeof exports === 'object') {
    exports['DecimalCalc'] = factory();
  } else {
    root['DecimalCalc'] = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

	 function construct(){
		this.dataJson = {
			"LoadDir":"js/json/",
			"Normal":{
				"Metric":0,
				"SAE":0
			},
			"Repair":{
				"Metric":0,
				"SAE":0
			},
			"NSPT":{
				"File":0
			},
			"Pipe":{
				"File":0
			},
			"NPT":{
				"File":0
			},
			"NPS":{
				"File":0
			},
			"BSP":{
				"File":0
			},
			"TORQUE":{
				"SAE":0,
				"Metric":0
			},
			"TPM":{
				"File":0
			}
			
		}
	}
	
	function getJsonData(file, func,callback){
		var data = fetch( file)
      .then(function(response ){ 
			if(!response.ok){
				//func("getPage Error: " + response.status, false);
				//var oops = new responseError (response)
				return Promise.reject(response)
				//response.status
			}
			return response.json();
	  })
	  return data;
	  /*
	  .then(function(response){ 
	      func( response, callback)    
	  })
	  .catch(function(error){
	      console.log(error)
	      func("getPage Error: "+error.statusText, false)	      
	  })
		*/
	}
	
	function CalcTapSizeN(valueIn,output,selTab){
	
		valueOut = ""
		var sizeOb = /^[M|m](?<metric>\d.\d|\d*)|^(?<fracSize>\d{1,2}\/\d{1,2})|^(?<fullFracSize>(\d+) *((\d{1,2}\/\d{1,2}))?)|^(?<decimalSize>\.\d{4,})|^(?<wire>#(\d+))/
		var result=sizeOb.exec(valueIn)
		var threadOb= /(?!^[M|m](?<metric>\d.\d|\d*)|^(?<fracSize>\d{1,2}\/\d{1,2})|^(?<fullFracSize>(\d+) *((\d{1,2}\/\d{1,2}))?)|^(?<decimalSize>\.\d{4,})|^(?<wire>#(\d+))) [X|-] (\S*)/
		var threadResult = threadOb.exec(valueIn)
		//console.log(threadResult)
		threadResult =  threadResult != null ? threadResult[10] : 0;
		//console.log(threadResult[10])
		if(result != null){
			
			if(selTab === "Normal"){
				if(typeof result.groups.decimalSize != "undefined"){
					valueOut=calcDecimalSize(result.groups.decimalSize , threadResult,output)
				}else if(typeof result.groups.fullFracSize != 'undefined'){
					valueOut=calcFullFracSize(result[4],result[5],threadResult,output)
				}else if(typeof result.groups.fracSize != 'undefined'){
					valueOut=calcFracSize(result[2],threadResult,output)
				}else if(typeof result.groups.metric != 'undefined'){
					valueOut=calcMetric(result[1],threadResult,output)
				}else if(typeof result.groups.wire != 'undefined'){
					valueOut=calcScrew(result[9],threadResult,output)
				}
			}else if(selTab === "ThreadRepair"){
				 if(typeof result.groups.fullFracSize != 'undefined'){
					valueOut=calcThreadRepairFullFracSize(result[4],result[5],threadResult,output)
				}else if(typeof result.groups.fracSize != 'undefined'){
					valueOut=calcThreadRepairFracSize(result[2],threadResult,output)
				}else if(typeof result.groups.metric != 'undefined'){
					valueOut=calcThreadRepairMetric(result[1],threadResult,output)
				}else if(typeof result.groups.wire != 'undefined'){
					valueOut=calcThreadRepairScrew(result[9],threadResult,output)
				}
				//valueOut="Thread Repair";
				//
			}else if(selTab === "NSP"){
				//valueOut = "National Standard Pipe Thread";
				if(dataJson.NSPT.File == 0){
					getJsonData(dataJson.LoadDir+'nspt.json').then(function(result){
					dataJson.NSPT.File = result
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
				});
				}else {
					result=dataJson.NSPT.File
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
					valueOut = undefined
				}
					//nspt.json
			}else if(selTab === "Pipe"){
				valueOut = "Normal Pipe";
				if(typeof result.groups.decimalSize != "undefined"){
					valueOut=result.groups.decimalSize
				}else if(typeof result.groups.fullFracSize != 'undefined'){
					valueOut=result[4]+"-"+result[5]
				}else if(typeof result.groups.fracSize != 'undefined'){
					valueOut=result[2]
				}else if(typeof result.groups.metric != 'undefined'){
					valueOut=result[1]
				}else if(typeof result.groups.wire != 'undefined'){
					valueOut=result[9]
				}
				//valueOut = "National Standard Pipe Thread";
				if(dataJson.Pipe.File == 0){
					getJsonData(dataJson.LoadDir+'pipe.json').then(function(result){
					dataJson.Pipe.File = result
					//console.log(result)
					tableData(result[valueOut], [result.title,result.fields], output)
				});
				}else {
					result=dataJson.Pipe.File
					//console.log(result)
					tableData(result[valueOut], [result.title,result.fields], output)
					valueOut = undefined
				}
				
				//pipe.json
			}
			else if(selTab === "NPT"){
				valueOut = "National Pipe Thread";
				if(dataJson.NPT.File == 0){
					getJsonData(dataJson.LoadDir+'npt.json').then(function(result){
					dataJson.NPT.File = result
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
				});
				}else {
					result=dataJson.NPT.File
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
					valueOut = undefined
				}
				//npt.json
			}
			else if(selTab === "NPS"){
				valueOut = "National Pipe Standard";
				if(dataJson.NPS.File == 0){
					getJsonData(dataJson.LoadDir+'nps.json').then(function(result){
					dataJson.NPS.File = result
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
				});
				}else {
					result=dataJson.NPS.File
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
					valueOut = undefined
				}
				valueOut = undefined
				//nps.json
			}
			else if(selTab === "BSP"){
				valueOut = "Brittish Standard Pipe";
				if(dataJson.BSP.File == 0){
					getJsonData(dataJson.LoadDir+'bsp.json').then(function(result){
					dataJson.BSP.File = result
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
				});
				}else {
					result=dataJson.BSP.File
					//console.log(result)
					tableData(result.All, [result.title,result.fields], output)
					valueOut = undefined
				}
				//bsp.json
			}else if(selTab === "Torque"){
				valueOut = "Torque";
				fileValue="",filetype=""
				precurser=""
				if(typeof result.groups.decimalSize != "undefined"){
					valueOut=result.groups.decimalSize
					fileValue="torqueSAE.json"
					filetype="SAE"
				}else if(typeof result.groups.fullFracSize != 'undefined'){
					valueOut=result[4]+"-"+result[5]
					fileValue="torqueSAE.json"
					filetype="SAE"
				}else if(typeof result.groups.fracSize != 'undefined'){
					valueOut=result[2]
					fileValue="torqueSAE.json"
					filetype="SAE"
				}else if(typeof result.groups.metric != 'undefined'){
					valueOut=result[1]
					fileValue="torqueMetric.json"
					precurser="M"
					filetype="Metric"
				}else if(typeof result.groups.wire != 'undefined'){
					valueOut=result[9]
					fileValue="torqueSAE.json"
					filetype="SAE"
				}
				
				if(dataJson.TORQUE[filetype] == 0){
					getJsonData(dataJson.LoadDir+fileValue).then(function(result){
					dataJson.TORQUE[filetype] = result
					//console.log(dataJson.TORQUE)
					tableData(result[precurser+valueOut], [result.title,result.fields], output)
				});
				}else {
					result=dataJson.TORQUE[filetype]
					//console.log(dataJson.TORQUE[filetype])
					tableData(result[precurser+valueOut], [result.title,result.fields], output)
					valueOut = undefined
				}
				//torqueSAE.json
				//torqueMetric.json
			}else if(selTab === "TPM"){
				
				valueOut = "TPM CHart";
				
				valueOut =TPM(output) 
				//TMP_Chart.json
			}else if(selTab === "CT"){
				valueOut = "Conversion chart";
				//DecimalSizeChart1.json
			}
		}
		else{
			valueOut="Impropper value entered"
		}
		//result=null
		//setDispData(valueOut, output)
		if(valueOut != undefined){
		   document.getElementById(output).innerHTML=valueOut;
		}

	}
	
	function tableData(result,items,output,msg,inch){
		inch = inch != undefined?inch+" ":"";
		msg = msg != undefined ? msg : "";
		var comMsg = "<span>"+msg+"</span><table border='1'><tr>";
		//console.log(items)
		for(item in items[0]){
				//console.log(items[item])
				comMsg += "<th>"+items[0][item]+"</td>";
		}
		comMsg += "</tr>"
			
		for(var prop in result){
			comMsg += "<tr>";
			//console.log(result)
			for(item in items[1]){
				//console.log(items[1][item])
				comMsg += "<td>"+result[prop][items[1][item]]+"</td>";
			}
			comMsg += "</tr>";
			/*
				comMsg += "<tr><td>" + result[prop].Size +
						  "</td><td>" + result[prop].Threads +
						  "</td><td>" + result[prop].MM_75 +
						  "</td><td>" + inch+result[prop].SAE_75 +
						   "</td><td>" + result[prop].MM_50 +
						  "</td><td>" + inch+result[prop].SAE_50 +
						  "</td></tr>\n"
			*/
			 
		}
			comMsg += "</table>";
			//console.log(comMsg)
			setDispData(comMsg, output) ;
	}
	
	function setTPMData(result, output){
		valueOut = "<h3>Twister</h3><table><tr>";
		//var result=dataJson.TPM.File
		
		console.log(result)
		for(var prop in result.Twister.Fields){
			valueOut +="<th>"+result.Twister.Fields[prop]+"</th>";
		}
		valueOut +="</tr>";
		for(var prop in result.Twister){
			if(prop == "Fields" || prop == "Common"){
				continue;
			}
			if(prop == "33.1" || prop == "31.2"){
				propVal = "<b>"+prop+"</b>"
			}else{
				propVal = prop
			}
			valueOut += "<tr><td>" + propVal +
						  "</td><td>" + result.Twister[prop].X +
						  "</td><td>" + result.Twister[prop].Y +
						  "</td><td>" + result.Twister[prop].Belt +
						   "</td><td>" + result.Twister[prop]["Lay Length"] +
						  "</td><td>" + result.Twister[prop].Common +
						  "</td></tr>\n"
		}
			
		
		setDispData(valueOut, output)
	}
	
	function TPM(output){
		
		if(this.dataJson.TPM.File == 0){
			getJsonData(this.dataJson.LoadDir+'TPM_Chart.json').then(function(result){
			dataJson.TPM.File = result
			//console.log(this.dataJson.TPM.File)
			setTPMData(result, output)
			});
			var result=dataJson.TPM.File
		}else {
			var result=dataJson.TPM.File
			//console.log(result)
			setTPMData(result, output)
			//valueOut = undefined
		}
		

		//return valueOut
	}
	function setDispData(value,output){
		
		document.getElementById(output).innerHTML=value;
	}
	
	function calcThreadRepairFullFracSize(s,t, frac, output){
		if(this.dataJson.Repair.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'repairSAE.json').then(function(result){
				this.dataJson.Repair.SAE = result
				//console.log(s)
				tableData(result[s], [result.title,result.fields], output, "Add "+s + " to this data",s)
			});
		}else {
			//console.log(this.dataJson.SAE[s])
			tableData(this.dataJson.Repair.SAE[frac], [this.dataJson.Repair.SAE.title,this.dataJson.Repair.SAE.fields], output, "Add "+s + " to this data",s)
		}
		//repairSAE.json
		//return "Thread Repair Full Fraction Size"
		
	}
	
	function calcThreadRepairFracSize(frac,t, output){
		//repairSAE.json
		if(this.dataJson.Repair.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'repairSAE.json').then(function(result){
				this.dataJson.Repair.SAE = result
				//console.log(result)
				//console.log(result[frac])
				tableData(result[frac], [this.dataJson.Repair.SAE.title,this.dataJson.Repair.SAE.fields], output, t)
			});
		}else {
			//console.log(this.dataJson.SAE[s])
			tableData(this.dataJson.Repair.SAE[frac], [this.dataJson.Repair.SAE.title,this.dataJson.Repair.SAE.fields], output,t)
		}
		//console.log(this.dataJson.Repair.SAE)
		//return "Thread Repair Fraction"
	}
	
	function calcThreadRepairMetric(s,t, output){
		//.json
		if(this.dataJson.Repair.Metric == 0){
			getJsonData(this.dataJson.LoadDir+'repairMetric.json').then(function(result){
				this.dataJson.Repair.Metric = result
				//console.log(result)
				tableData(result["M"+s], [this.dataJson.Repair.Metric.title,this.dataJson.Repair.Metric.fields], output)
			});
		}else {
			//console.log(this.dataJson.SAE[s])
			tableData(this.dataJson.Repair.Metric["M"+s], [this.dataJson.Repair.Metric.title,this.dataJson.Repair.Metric.fields], output)
		}
		//return "Thread Repair Metric"
	}
	
	function calcThreadRepairScrew(s,t, output){
		//repairSAE.json
		if(this.dataJson.Repair.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'repairSAE.json').then(function(result){
				this.dataJson.Repair.SAE = result
				//console.log(result)
				tableData(result["#"+s], [this.dataJson.Repair.SAE.title,this.dataJson.Repair.SAE.fields], output)
			});
		}else {
			//console.log("Error")
			tableData(this.dataJson.Repair.SAE["#"+s], [this.dataJson.Repair.SAE.title,this.dataJson.Repair.SAE.fields], output)
		}
		//return "Thread Repair Screw"
	}
	
	function calcDecimalSize(s,t){
		
		return "Decimal " + s +" - " + t	;
	}
	
	function calcFullFracSize(s,frac,t,output){
		if(this.dataJson.Normal.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'standard.json').then(function(result){
				this.dataJson.Normal.SAE = result
				//console.log(frac)
				tableData(result[frac], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output, "Add "+s + " to this data",s)
			});
		}else {
			//console.log(this.dataJson.SAE[s])
			tableData(this.dataJson.Normal.SAE[frac], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output, "Add "+s + " to this data",s)
		}
		//return "Full Fraction " + s +" - " + t + " - " + frac;
	}
	
	function calcFracSize(s,t, output){
		if(this.dataJson.Normal.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'standard.json').then(function(result){
				this.dataJson.Normal.SAE = result
				//console.log(result.fields)
				tableData(result[s], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output)
			});
		}else {
			//console.log(this.dataJson.SAE[s])
			tableData(this.dataJson.Normal.SAE[s], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output)
		}
		//return "Fraction " + s +" - " + t;
	}
	
	function calcMetric(s,t,output){
		//use metric.json
		if(this.dataJson.Normal.Metric == 0){
			getJsonData(this.dataJson.LoadDir+'metric.json').then(function(result){
				this.dataJson.Normal.Metric = result
				tableData(result["M"+s], [this.dataJson.Normal.Metric.title,this.dataJson.Normal.Metric.fields], output)
			});
		}else {
			//console.log(this.dataJson.Metric["M"+s])
			tableData(this.dataJson.Normal.Metric["M"+s], [this.dataJson.Normal.Metric.title,this.dataJson.Normal.Metric.fields], output)
		}
		//return "Metric " + s +" - " + t
	}
	
	function calcScrew(s,t,output){
		
		if(this.dataJson.Normal.SAE == 0){
			getJsonData(this.dataJson.LoadDir+'standard.json').then(function(result){
				this.dataJson.Normal.SAE = result
				//console.log(result["#"+s])
				tableData(result["#"+s], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output)
			});
		}else {
			//console.log(this.dataJson.Metric["M"+s])
			tableData(this.dataJson.Normal.SAE["#"+s], [this.dataJson.Normal.SAE.title,this.dataJson.Normal.SAE.fields], output)
		}
		//return "Wire " + s +" - " + t
	}

    function TPM_Calc(x, y, output){
		var twistMultiplire={
		"Tronado":28.29,
		"Twister":48.50,
		"TwisterOld":49.61
		}
		var tornado = 28.29, twister = 48.50, twister_foot = 14.78
		var calcTor = tornado  * (y/x) 
		var calcTwist = twister * (y/x) 
		// TPI = TPM *0.0254  // Twist Per Inch
		var ot = ""
		var round = function(number, decimalPlaces){
		   decimalPlaces = decimalPlaces || 1;
		   //return parseFloat( parseFloat( number ).toFixed(decimalPlaces));
		   //return Math.round((number+Number.EPSILON)*Math.pow(10,decimalPlaces))/Math.pow(10,decimalPlaces)
		   return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces).toFixed(1)
	       }
		ot = "Using X '"+x + "' and Y '"+y+"'<br>";
		ot = ot + "\nTornado TPM = "+round(calcTor,1)+"<br>"
		ot = ot + "\nTwister TPM = "+round(calcTwist,1)+"<br>"
		document.getElementById(output).innerHTML = ot

		//return calcIt 
    }




construct();
 
  //return the public functions(ie {public: internal}
  return{
	   CalcTapSizeN: CalcTapSizeN,
	   calcDecimalSize: calcDecimalSize
         };
}));