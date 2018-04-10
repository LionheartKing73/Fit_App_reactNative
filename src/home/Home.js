import React, { Component } from 'react';

// import { Accelerometer, Gyroscope } from 'react-native-sensors';
// const accelerationObservable = new Accelerometer({
//   updateInterval: 100, // defaults to 100ms
// });

import { Text, View, StyleSheet, ScrollView, Button, Alert, Image } from 'react-native';
import { Constants, Google } from 'expo';
import {H1, H2, H3, H4, Container, Spinner} from "native-base";
import { AreaChart, LineChart, BarChart, XAxis, YAxis, PieChart, ProgressCircle } from 'react-native-svg-charts';
import googlefit from '../utils/googlefit';
import * as shape from 'd3-shape';
import firebase from 'firebase';
var config = {
    apiKey: "AIzaSyC-w1MNaDzNxltk8NMeQexzUQ1Vo1ngxsU",
    authDomain: "fitness-project-195723.firebaseio.com",
    databaseURL: "https://fitness-project-195723.firebaseio.com/",
    projectId: "fitness-project-195723",
    storageBucket: "",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);
//import Pedometer from 'react-native-pedometer';
    


        // SensorManager.startStepCounter(1000);
        // DeviceEventEmitter.addListener('StepCounter', function (data) {
             
        // });
        // SensorManager.stopStepCounter();


export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            weight: [],
            step: [],
            calories: [],
            date: [],
            pieData: []
        }
        
        this.callback = this.callback.bind(this);
        this.getStepData = this.getStepData.bind(this);
        this.getWeightData = this.getWeightData.bind(this);
        this.getCaloriesData = this.getCaloriesData.bind(this);
        this.setStepData = this.setStepData.bind(this);
        this.setWeightData = this.setWeightData.bind(this);
        this.setCaloriesData = this.setCaloriesData.bind(this);

        
    }
    
    componentWillMount() {
        this.interval = setInterval(this.callback, 5000);
    }

    getStepData(stepData) {
        googlefit.getFitnessData(stepData).then(res => this.setStepData(res));
    }

    getWeightData(weightData) {
        googlefit.getFitnessData(weightData).then(res => this.setWeightData(res));
    }

    getCaloriesData(caloriesData) {
        googlefit.getFitnessData(caloriesData).then(res => this.setCaloriesData(res));
    }

    setStepData(res) {
        var step = JSON.parse(res);
        if (step.bucket) {
            var result = [];
            var count = step.bucket.length;
            for (let i = 0; i < count; i++) {
                if (step.bucket[i].dataset[0].point.length == 0) {
                    result[i] = 0;
                } else {
                    result[i] = step.bucket[i].dataset[0].point[0].value[0].intVal;
                }
            }
                var current_date=new Date();
                var date = [];
                for (let i=6; i>=0; i--){
                    var dt_ago=current_date-1000*60*60*24*i;
                    var Date_ago=new Date(dt_ago);
                    date[6-i]=Date_ago.getDate();
                }

                 var client_id=this.props.user.givenName+'_'+this.props.user.familyName;
                 for (let i = 0; i < count; i++) {
                    let dbCon5 = firebase.app().database().ref('/user/'+client_id+'/StepCount/data/'+date[i]);
                    dbCon5.update({
                      'stepCount': result[i]
                    });  

                }

                // let dbCon5 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"StepCount":{"data":{`;
                // for (let i = 0; i < count; i++) {
                //     if (i==0){upt_data=upt_data+`"${date[i]}":{"stepCount": "${result[i]}"}`;}else{
                //     upt_data=upt_data+`,"${date[i]}":{"stepCount": "${result[i]}"}`;}
                // }
                // var upt_data=upt_data+`}}}}`;
                // var step_Data=JSON.parse(upt_data);
                // dbCon5.update(step_Data);   
             
            // accelerationObservable
            //   .map(({ x, y, z }) => x + y + z)
            //   .filter(speed => speed > 0)
            //   .subscribe(speed => console.log(`You moved your phone with ${speed}`));
            const to_day = new Date();
             
         
            // Pedometer.startPedometerUpdatesFromDate(to_day, (motionData) => {
            //   console.log("motionData: " + motionData);
            //   this.setState(motionData);
            // });

          this.setState({step: result});
        }
        else
        {
            clearInterval(this.interval);
            // this.props.setAuth();

        }
    }

    setWeightData(res) {
        var weight = JSON.parse(res);
        if (weight.bucket) {
            var result = [];
            var count = weight.bucket.length;
            for (let i = 0; i < count; i++) {
                if (weight.bucket[i].dataset[0].point.length == 0) {
                    result[i] = 0;
                } else {
                    result[i] = weight.bucket[i].dataset[0].point[0].value[0].fpVal;
                }
            }
 
                
                var current_date=new Date();
                var date = [];
                for (let i=6; i>=0; i--){
                    var dt_ago=current_date-1000*60*60*24*i;
                    var Date_ago=new Date(dt_ago);
                    date[6-i]=Date_ago.getDate();
                }

  
                var prev5_date_ob=new Date(current_date-1000*60*60*24*7);
                var prev5_date=prev5_date_ob.getDate();

                var prev5_weight=110;
               
                if (result[0]==0){result[0]=prev5_weight};
                for (let i = 1; i < count; i++) {
                    if (result[i]==0){result[i]=result[i-1]};
                }        
                      
                 
                var client_id=this.props.user.givenName+'_'+this.props.user.familyName;
                // let dbCon3 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"Weight":{"data":{`;
                // for (let i = 0; i < count; i++) {
                //     if (i==0){upt_data=upt_data+`"${date[i]}":{"weight": "${result[i]}"}`;}else{
                //     upt_data=upt_data+`,"${date[i]}":{"weight": "${result[i]}"}`;}
                // }
                // var upt_data=upt_data+`}}}}`;
                // var weight_Data=JSON.parse(upt_data);
                // dbCon3.update(weight_Data);   


                // let dbCon4 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"HeartRate":{"data":{`;
                // for (let i = 0; i < count; i++) {
                //     var heart=75-Math.round(Math.random()*10);
                //     if (i==0){upt_data=upt_data+`"${date[i]}":{"heartRate": "${heart}"}`;}else{
                //     upt_data=upt_data+`,"${date[i]}":{"heartRate": "${heart}"}`;}
                // }
                // var upt_data=upt_data+`}}}}`;
                // var Heart_Data=JSON.parse(upt_data);
                // dbCon4.update(Heart_Data);   


                for (let i = 0; i < count; i++) {
                    let dbCon3 = firebase.app().database().ref('/user/'+client_id+'/Weight/data/'+date[i]);
                    dbCon3.update({
                      'weight': result[i]
                    });  

                    var heart=75-Math.round(Math.random()*10); 
                    let dbCon4 = firebase.app().database().ref('/user/'+client_id+'/HeartRate/data/'+date[i]);
                    dbCon4.update({
                      'heartRate': heart
                    });  
                }

      

            this.setState({weight: result});
        }
        else
        {
            clearInterval(this.interval);
            // this.props.setAuth();
        }
    }

    setCaloriesData(res) {
        var calories = JSON.parse(res);
        if (calories.bucket) {
            var result = [];
            var count = calories.bucket.length;
            for (let i = 0; i < count; i++) {
                if (calories.bucket[i].dataset[0].point.length == 0) {
                    result[i] = 0;
                } else {
                    result[i] = calories.bucket[i].dataset[0].point[0].value[0].fpVal;
                }
            }
            this.setState({calories: result});
                 
                var current_date=new Date();
                var date = [];
                for (let i=6; i>=0; i--){
                    var dt_ago=current_date-1000*60*60*24*i;
                    var Date_ago=new Date(dt_ago);
                    date[6-i]=Date_ago.getDate();
                }

                var client_id=this.props.user.givenName+'_'+this.props.user.familyName;
                
                // let dbCon1 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"CaloriesIn":{"data":{`;
                // for (let i = 0; i < count; i++) {
                //     var in_result=3600-result[i];
                //     if (i==0){upt_data=upt_data+`"${date[i]}":{"calorie": "${in_result}"}`;}else{
                //     upt_data=upt_data+`,"${date[i]}":{"calorie": "${in_result}"}`;}
                // }
                // var upt_data=upt_data+`}}}}`;
                // var calIn_Data=JSON.parse(upt_data);
                // dbCon1.update(calIn_Data);  

                // let dbCon2 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"CaloriesOut":{"data":{`;
                // for (let i = 0; i < count; i++) {
                //     if (i==0){upt_data=upt_data+`"${date[i]}":{"calorie": "${result[i]}"}`;}else{
                //     upt_data=upt_data+`,"${date[i]}":{"calorie": "${result[i]}"}`;}
                // }
                // var upt_data=upt_data+`}}}}`;
                // var calOut_Data=JSON.parse(upt_data);
                // dbCon2.update(calOut_Data);  

                for (i=0;i<count;i++){
                    let dbCon = firebase.app().database().ref('/user/'+client_id+'/CaloriesIn/data/'+date[i]);
                    dbCon.update({
                      'calorie':3600-result[i]
                    });
                    let dbCon1 = firebase.app().database().ref('/user/'+client_id+'/CaloriesOut/data/'+date[i]);
                    dbCon1.update({
                        calorie:result[i]
                      });
                }

     //////////////  Made user account ///////////////
                // let dbCon1 = firebase.app().database().ref('/user');
                // var upt_data=`{"${client_id}":{"CaloriesIn":{"data":{`;
                // for (let i = 0; i < 32; i++) {
                //     var in_result=3600;
                //     if (i==0){upt_data=upt_data+`"${i}":{"calorie": 3600}`;}else{
                //     upt_data=upt_data+`,"${i}":{"calorie":3600}`;}
                // }
                // upt_data=upt_data+`}}`;

                // upt_data=upt_data+`,"CaloriesOut":{"data":{`;
                // for (let i = 0; i < 32; i++) {
                //     if (i==0){upt_data=upt_data+`"${i}":{"calorie": 0}`;}else{
                //     upt_data=upt_data+`,"${i}":{"calorie": 0}`;}
                // }
                // upt_data=upt_data+`}}`;


                // upt_data=upt_data+`,"Weight":{"data":{`;
                // for (let i = 0; i < 31; i++) {
                //     if (i==0){upt_data=upt_data+`"${i}":{"weight": 120}`;}else{
                //     upt_data=upt_data+`,"${i}":{"weight": 120}`;}
                // }
                // upt_data=upt_data+`}}`;
                 
                // upt_data=upt_data+`,"HeartRate":{"data":{`;
                // for (let i = 0; i < 32; i++) {
                //     var heart=75-Math.round(Math.random()*10);
                //     if (i==0){upt_data=upt_data+`"${i}":{"heartRate": "${heart}"}`;}else{
                //     upt_data=upt_data+`,"${i}":{"heartRate": "${heart}"}`;}
                // }
                // upt_data=upt_data+`}}`;
                 
                // upt_data=upt_data+`,"StepCount":{"data":{`;
                // for (let i = 0; i < 32; i++) {
                //     if (i==0){upt_data=upt_data+`"${i}":{"stepCount":0}`;}else{
                //     upt_data=upt_data+`,"${i}":{"stepCount": 0}`;}
                // }
                // upt_data=upt_data+`}}`;
                

                // upt_data=upt_data+`}}`;   
                // console.log(upt_data);             
                // var all_Data=JSON.parse(upt_data);
                // dbCon1.update(all_Data);  
//////////////////////////////////////////////////////////////////////////

            const randomColor = [ 'rgba(24,53,57,0.8)', '#00CC80' ];
            var pie_data = [ 3600 - result[6], result[6] ];
            var pieData = pie_data
                .filter(value => value > 0)
                .map((value, index) => ({
                    value,
                    color: randomColor[index],
                    key: `pie-${index}`,
                    onPress: () => console.log(`${index} slice pressed`),
                }));
            this.setState({pieData: pieData});
        }
        else
        {
            clearInterval(this.interval);
            // this.props.setAuth();
        }
    }

    callback () {

        var weeks = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        var date = new Date();
        var xlabels = [];
        for (let i=6; i>=0; i--){
            day = date.getDay()-i-1 ;
            if (day < 0) day = day + 7;
            // xlabels[6 - i] = weeks[day] + ' ' + (date.getDate()-i);
            xlabels[6 - i] = date.getDate()-i;
        }
        this.setState({date: xlabels});

        var current = new Date();
        var year = current.getFullYear();
        var month = current.getMonth();
        var date = current.getDate();
        var endTimeMillis = new Date(year, month, (date+1)).getTime();
        var startTimeMillis = endTimeMillis - 604800000;

        var stepData = {
            'accessToken': this.props.accessToken,
            'dataTypeName': 'com.google.step_count.delta',
            'startTimeMillis': startTimeMillis,
            "endTimeMillis": endTimeMillis
        };

        var weightData = {
            'accessToken': this.props.accessToken,
            'dataTypeName': 'com.google.weight',
            'startTimeMillis': startTimeMillis,
            "endTimeMillis": endTimeMillis
        };

        var caloriesData = {
            'accessToken': this.props.accessToken,
            'dataTypeName': 'com.google.calories.expended',
            'startTimeMillis': startTimeMillis,
            "endTimeMillis": endTimeMillis
        };

        this.getStepData(stepData);
        this.getWeightData(weightData);
        this.getCaloriesData(caloriesData);
    }

    render() {
        
        return (
            <ScrollView>
                <View style={styles.outer_bg}>
                    <View style={styles.container}>
                        <Text style={styles.today}> Today </Text>
                        <H3 style={styles.paragraph}> Physical Activity </H3>
                        <Text style={styles.small}><Text style={styles.number}>{this.state.step[6]}</Text><Text style={{fontSize: 20}}>/</Text><Text style={{color: '#fff'}}>{this.state.step[5]}</Text> yesterday</Text>
                        <H3 style={styles.paragraph}> Weight </H3>
                        <View style={ { width: 250, height: 200, flexDirection: 'row' } }>
                            <YAxis
                                style={ { height: 200, width: 40, } }
                                // dataPoints={ [0,10,20,30,40,50,60,70,80,90,100,110,120] }
                                dataPoints={ [0,20,40,60,80,100,120,140,160] }
                                contentInset={ { top: 20, bottom: 15 } }
                                labelStyle={ { color: '#34AB75' } }
                                formatLabel={ value => `${value}` }
                            />
                            <LineChart
                                style={ { width: 210, height: 200 } }
                                dataPoints={ this.state.weight }
                                fillColor={ 'purple' }
                                shadowOffset={0}
                                svg={ {
                                    stroke: '#2F976B',
                                } }
                                shadowSvg={ {
                                    stroke: 'rgba(47, 151, 107, 0.2)',
                                    strokeWidth: 0,
                                } }
                                contentInset={ { top: 20, left: 5, right: 10, bottom: 10 } }
                                curve={shape.curveLinear}
                                gridMax={160}
                                gridMin={0}
                            />
                            </View>
                        <XAxis
                            style={ { height: 10, width: '100%', paddingVertical: 0 } }
                            values={ this.state.weight }
                            formatLabel={ (value, index) => this.state.date[index] }
                            chartType={ XAxis.Type.LINE }
                            labelStyle={ { color: '#34AB75' } }
                            contentInset={ { top: 0, left: 40, right: 15, bottom: 60 } }
                            
                        />
                        <View style={styles.line}>
                        </View>
                        <H3 style={styles.paragraph_box_in}> Last 7 days step count </H3>
                        <View style={ { width: 250, height: 200, flexDirection: 'row' } }>
                            <YAxis
                                style={ { height: 200, width: 50, } }
                                dataPoints={ this.state.step }
                                contentInset={ { top: 20, bottom: 15 } }
                                labelStyle={ { color: '#34AB75' } }
                                formatLabel={ value => `${value}` }
                            />
                            <BarChart
                                style={ { width: 250, height: 200, flex: 1 } }
                                data={ [
                                    {
                                        values: this.state.step,
                                        positive: {
                                            fill: 'rgba(24,53,57,0.8)',
                                            stroke: '#34AB75'
                                            // other react-native-svg supported props
                                        },
                                        negative: {
                                            fill: 'rgba(24,53,57,0.8)',
                                            stroke: '#34AB75'
                                            // other react-native-svg supported props
                                        },
                                    },
                                ] }
                                contentInset={ { top: 30, left: -10, bottom: 10 } }
                                spacing= {0.35}
                            />
                        </View>
                        <XAxis
                            style={ { height: 10, width: '100%', paddingVertical: 0 } }
                            values={ this.state.step }
                            formatLabel={ (value, index) => this.state.date[index] }
                            chartType={ XAxis.Type.BAR }
                            labelStyle={ { color: '#34AB75' } }
                            contentInset={ { top: 0, left: 40, right: 0, bottom: 100 } }
                            
                        />
                        <H3 style={styles.paragraph_box_in}> 3600 Calories </H3>
                        <PieChart
                            style={ { width: 200, height: 160, } }
                            data={ this.state.pieData }
                            innerRadius='0%'
                            svg={ {
                                stroke: '#13715A',
                                strokeWidth: 2
                            } }
                        />
                    </View>               
                </View>

                <View style={styles.outer_bg}>
                    <View style={styles.container}>
                        <H2 style={styles.paragraph}> Exercise Target </H2>
                        <ProgressCircle
                            style={ { width: 250, height: 200, } }
                            progress={ 0.7 }
                            progressColor={'#34AB75'}
                        />
                        <Text style={styles.number_in}>402</Text>
                        <Text style={{ color: '#787F87', fontSize: 12, marginTop: -136, paddingBottom: 100 }}>Total Tasks</Text>
                        <View style={styles.container_flex_2}>
                            <View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.number}>263</Text>
                                <Text style={{ color: '#34AB75', fontSize: 12, marginTop: 0, paddingBottom: 0 }}>Active Tasks</Text>
                            </View>
                            <View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={styles.number}>139</Text>
                                <Text style={{ color: '#F3C031', fontSize: 12, marginTop: 0, paddingBottom: 0 }}>Pending Tasks</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.outer_bg}>
                    <View style={styles.container}>
                        <H2 style={styles.paragraph}> Daily Calories Out </H2>
                        <View style={ { width: 250, height: 200, flexDirection: 'row' } }>
                            <YAxis
                                style={ { height: 200, width: 50, } }
                                dataPoints={ this.state.calories }
                                contentInset={ { top: 20, bottom: 5 } }
                                labelStyle={ { color: '#34AB75' } }
                                formatLabel={ value => `${value}` }
                            />
                            <BarChart
                                style={ { width: 210, height: 200 } }
                                data={ [
                                    {
                                        values: this.state.calories,
                                        positive: {
                                            fill: 'rgba(24,53,57,0.8)',
                                            stroke: '#34AB75'
                                            // other react-native-svg supported props
                                        },
                                        negative: {
                                            fill: 'rgba(24,53,57,0.8)',
                                            stroke: '#34AB75'
                                            // other react-native-svg supported props
                                        },
                                    },
                                ] }
                                contentInset={ { top: 30, left: -10, bottom: 0 } }
                                spacing= {0.35}
                            />
                        </View>
                        <XAxis
                            style={ { height: 20, width: '100%', paddingVertical: 0, paddingTop: 10 } }
                            values={ this.state.calories }
                            formatLabel={ (value, index) => this.state.date[index] }
                            chartType={ XAxis.Type.BAR }
                            labelStyle={ { color: '#34AB75' } }
                            contentInset={ { top: -20, left: 40, right: 5, bottom: 60 } }
                            
                        />
                        <Text style={{ color: '#F3C031', fontSize: 12, paddingTop: 30, paddingBottom: 10 }}>- Wait Time Today (ms) -</Text>
                    </View>
                </View>

                <View style={styles.outer_bg}>
                    <View style={styles.container}>
                        <H2 style={styles.paragraph}> Heart Rate </H2>
                        <Image source={require('../../assets/impulse.png')} style={{ width: 100, height: 80, marginTop: -20 }} />
                    </View>
                </View>

            </ScrollView>
            
        );
    }
}

const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];

const bar_data = [ 50, 10, 40, 95, 85, 91, 35, 53 ];

const barData = [
    {
        values: bar_data,
        positive: {
            fill: 'rgba(24,53,57,0.8)',
            stroke: '#34AB75'
            // other react-native-svg supported props
        },
        negative: {
            fill: 'rgba(24,53,57,0.8)',
            stroke: '#34AB75'
            // other react-native-svg supported props
        },
    },
];

const randomColor = [ 'transparent', '#00CC80' ];

const pie_data = [ 50, 100 ];

const pieData = pie_data
    .filter(value => value > 0)
    .map((value, index) => ({
        value,
        color: randomColor[index],
        key: `pie-${index}`,
        onPress: () => console.log(`${index} slice pressed`),
    }));

const styles = StyleSheet.create({
    outer_bg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#13212A',
    },
    container: {
        width: '85%',
        padding: 24,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: Constants.statusBarHeight,
        backgroundColor: '#152630',
    },
    container_flex_2: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    today: {
        color: '#34AB75',
        fontSize: 34,
    },
    paragraph: {
      margin: 24,
      textAlign: 'center',
      color: '#34AB75',
    },
    paragraph_box_in: {
        margin: 24,
        textAlign: 'center',
        color: '#34AB75',
        marginTop: 24,
        paddingTop: 24
      },
    coming: {
        margin: 24,
        textAlign: 'center',
        color: '#A98F39',
    },
    number: {
        color: '#fff',
        fontSize: 34,
    },
    number_in: {
        color: '#fff',
        fontSize: 34,
        marginTop: -130,
        paddingBottom: 130,
    },
    small: {
        color: '#34AB75',
        fontSize: 12,
    },
    chart: {
        width: 250,
        height: 200,
    },
    line: {
        width: '100%',
        height: 1,
        borderBottomWidth: 1,
        borderColor: '#2F976B', 
        paddingTop: 24,
        paddingBottom: 24
    },
});