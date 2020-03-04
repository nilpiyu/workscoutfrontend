/* ----------------- Start Document ----------------- */
(function($){
    "use strict";
    var sessionInfo = JSON.parse(localStorage.getItem('sessionInfo') || "{}");
    var profileInfo = JSON.parse(localStorage.getItem('profileInfo') || false);

    // if(sessionInfo['userId']===undefined){
    //     let dshbd = $('#responsive');
    //     dshbd.children()[3].style.display = 'none'
    // }
    // if(sessionInfo['type']=='applicant'){
    //     $("#dashboard > div.dashboard-nav > div > ul:nth-child(2) > li:nth-child(1) > a").hide();
    //     $('#responsive > li:nth-child(4) > ul > li:nth-child(6)').hide();
    //     $('#responsive > li:nth-child(4) > ul > li:nth-child(5)').hide();

    // }else{
    //     $("#dashboard > div.dashboard-nav > div > ul:nth-child(2) > li:nth-child(2) > a").hide();
    // }
    $(document).ready(function(){
 //   const SERVER_IP = "3.229.152.95:3001";
     const SERVER_IP = "localhost:3001";
    const success = "successPopup";
    const error = "errorPopup";

    window.SERVER_IP = SERVER_IP;
    /*----------------------------------------------------*/
    /*  Checking if user is alreaady logged in
    /*----------------------------------------------------*/
    $('body')[0].innerHTML+='<div id="snackbar">Some text some message..</div>';
    $('body')[0].innerHTML+="<div id='popupAlert'><div class='header'><span class='data' style='display:none'>here is data</span> Confirm action </div><div class='message'>You have not purchased this CV.<br>Do you want to purchase this CV ?</div><button  class='confirm'>OK</button><button class='close'>close</button></div><div class='fill'><div class='loader'></div></div>"
   
    if(sessionInfo['type']=='recruiter'){      
        $("#target").text('Find Resume');
     } 
     else {    
        $('#target').text('Find Job');
     }

    $("#popupAlert .close").click(()=>{
        console.log("Calling");
        $("#popupAlert").removeClass('showele');
    })
    // $('#popupAlert').addClass('showele');
    class Loader{
        constructor(){
            this.tag = $('.fill');
            console.log("Loader created");
        }
        start(){
            this.tag.addClass('showele');
        }
        stop(){
            this.tag.removeClass('showele');
        }
    }
    const loader = new Loader();
    window.loader = loader;
    function popup(message, className="") {
      var x = document.getElementById("snackbar");
      x.innerText = message || 'Sample message';
      x.className = "show "+className;
      setTimeout(function(){ x.className = x.className.replace("show "+className, ""); }, 3000);
    }

    window.popup = popup;
    const REFRESH_TIME = 300;
    const nav = document.getElementById('navigation');

    var email = sessionInfo['email'] || '';
    var username = sessionInfo['name'] || '';
    var token = sessionInfo['token'] || '';
    var userId = sessionInfo['userId'] || '';
    const userType = sessionInfo['type'] || 'applicant';

    function isNumber(evt){
        // console.log("Coming");
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
        }
        return true;
    }
    var circle = document.querySelector('circle');

    function progressCircle(){

        if(!circle){
            return;
        }
        let textBlock = document.querySelector("circle + text");
        var radius = circle.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        function setProgress(percent) {

            const offset = circumference - percent / 100 * circumference;
            console.log("Coming in setProgress",circumference,offset);
            textBlock.innerHTML = percent.toFixed()+"%";
            circle.style.strokeDashoffset = offset;
        }
        window.setProgress = setProgress;

        const input = 0;
        setProgress(input);
    }
    progressCircle();
    


    if(email!="" || username!=""){
        let nameu;
        if(username === ""){
            nameu = email;
        }else{
            nameu = username;
        }
        nameu = nameu.split("@")[0];
        let tag_name = "Howdy, "+nameu+"!";
        $('#dashname').text(tag_name);
        let image = "images/resumes-list-avatar-01.png";
        if(profileInfo){
            if(profileInfo['data']['image']){
                image = "http://"+SERVER_IP+"/" +profileInfo['data']['image'];
            }else{
                image = "images/resumes-list-avatar-01.png";
            }
        }
        nav.children[1].innerHTML='<li><img style="max-width:40px;border-radius:50%;min-height:40px;" src="'+image+'" alt="img"></li><li style="margin-top: 5%;margin-right: 10px;">Welcome, '+nameu+'</li><li><button id="logout" class="logout" style="border-radius:5px">Log Out</button></li>';
    }
    nav.children[1].classList.add("showele");
    // nav.style.visibility="hidden";
    if(sessionInfo.type=='applicant'){
        $('#responsive > li:nth-child(4)')[0].remove();
        $("#pjob,#fresumes").remove();
    }
    if(userType == "applicant"){
        $(".recruiter").remove();
        $(".applicant").addClass('showele');
    }else if(userType=="recruiter"){
        $(".applicant").remove();
        $(".recruiter").addClass('showele');
        $("#pjob")[0].href="dashboard-add-job.html";
        $("#fresumes")[0].href="browse-resumes.html";
    }

    // nav.style.visibility="visible";
    $('.logout').click(function(){
            localStorage.removeItem('sessionInfo');
            localStorage.removeItem('profileInfo');
            localStorage.removeItem('resumeList');
            localStorage.removeItem("userPostedJobs");
            window.location="./index.html";
    });

    /*----------------------------------------------------------------*/
    /*  Change password                                               */
    /*----------------------------------------------------------------*/
    $("#cpass").click(e=>{
        if(!sessionInfo['userId']){
            popup("Login to update password",error);
        }
        const ops = $("#opass")[0].value;
        const nps1 = $("#npass1")[0].value;
        const nps2 = $("#npass2")[0].value;
        if(!(ops && nps1 && nps2)){
            popup('Data missing',error);
            return;
        }
        if(nps1!=nps2){
            popup('confirm new password didnt match',error);
            return;
        }
        $.ajax({
            url: "http://"+SERVER_IP+"/user/changePassword",
            type: "POST",
            dataType: "json",
            headers:{
                Authorization: "Bearer "+ sessionInfo['token'],
            },
            data:{
                _id: sessionInfo['userId'],
                password:ops,
                new_password:nps1,
            },
            error: function (err) {
                let message = err['responseJSON']['message'] || "Password update failed";
                popup(message,error);
            },
            success: function (data) { //callback   
                popup("Password updated",success);                
            },
        });

    })


    /*----------------------------------------------------------------*/
    /*  Checking if profile is alreaady saved or else getting profile */
    /*----------------------------------------------------------------*/

    var inpts = $("#profile_name,#profile_mail,#profile_number,#profile_info,#profile_title,#profile_location,#profile_url,#profile_exp,#profile_typeJob,#profile_skills,#profile_edu,#profile_curcompany,#profile_vidLink,#file");
    function updateProfile(){
        var profileInfo = JSON.parse(localStorage.getItem('profileInfo') || false);
        if(! profileInfo){
            return;
        }
        if(profileInfo['data']['userId']!=undefined &&  profileInfo['data']['userId']==sessionInfo['userId']){
            if(inpts.length>=4){
                try{
                    inpts[0].value = profileInfo['data']['fullName'] || '';
                    inpts[2].value = profileInfo['data']['phoneNumber'] || '';
                    inpts[1].value = profileInfo['data']['email'] || '';
                    inpts[3].value = profileInfo['data']['aboutMe'] || '';
                    inpts[4].value = profileInfo['data']['professionalTitle'] || '';
                    inpts[5].value = profileInfo['data']['region'] || '';
                    inpts[6].value = profileInfo['data']['url'] || '';
                    inpts[7].value = profileInfo['data']['experience'] || '';
                    inpts[8].value = profileInfo['data']['category'] || '';
                    inpts[9].value = profileInfo['data']['skills'] || '';
                    inpts[10].value = profileInfo['data']['education'] || '';
                    inpts[11].value = profileInfo['data']['companyName'] || '';
                    $('#profile_expSalPerYear')[0].value = profileInfo['data']['salaryperyear'] || '';
                    $('#profile_expSalPerHour')[0].value = profileInfo['data']['salaryperhour'] || '';

                    // inpts[12].value = profileInfo['data'][''] || '';
                    // inpts[13].value = profileInfo['data'][''] || '';
                    // inpts[14].value = profileInfo['data'][''] || '';
                    // inpts[15].value = profileInfo['data'][''] || '';
                    // inpts[16].value = profileInfo['data'][''] || '';
                }catch(err){
                    console.log();
                }
                try{
                    $("#profile_video")[0].value = profileInfo['data']['videoUrl'] || '';
                    if(profileInfo['data']['image']){
                        $("#picIsPresent")[0].href = "http://"+SERVER_IP+"/" +profileInfo['data']['image'];
                        $("#picIsPresent")[0].style.visibility = "visible";
                    }
                }catch(err){

                }
                
            }
            let atag = $('#file + a');
            if(profileInfo['data']['resume']){
                if(atag.length){
                // atag.addClass('makeVisible');
                atag.attr("href","http://"+SERVER_IP+"/"+profileInfo['data']['resume']);
                    // atag.href = ;
                }else{

                }
            }else{
                if(atag.length){
                    atag.addClass('makeHidden');
                }
            }

        }
    }
    updateProfile();


    $("#saveChanges").click(function(){
        if(sessionInfo['token']===undefined){
            popup("Login to update profile", error);
            return;
        }
        if(inpts.length == 4){
            let fullname = inpts[0].value;
            let phoneNumber = inpts[2].value;
            let email = inpts[1].value;
            let aboutme = inpts[3].value;
            let videoUrl = $("#profile_video")[0].value || '';
            let fd = new FormData();
            fd.append("fullname",fullname);
            fd.append("email",email);
            fd.append("aboutMe",aboutme);
            fd.append("phoneNumber",phoneNumber);
            fd.append("videoUrl",videoUrl);
            fd.append("userid",sessionInfo['userId']);
            fd.append("image",$("#profile_pic")[0].files[0]);

            $.ajax({
                url: "http://"+SERVER_IP+"/profile/myprofile",
                type: "POST",
                dataType: "json",
                processData: false,
                contentType: false,
                headers:{
                    Authorization: "Bearer "+ sessionInfo['token'],
                },
                data:fd,
                error: function (err) {
                    // alert('error');
                    popup("Profile Update failed",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    console.log('profile posted successfull');
                    // localStorage.setItem('profileInfo', JSON.stringify(data) );
                    console.log(data);
                    // alert('Profile Updated');
                    profileInfo['data']['fullName'] = fullname;
                    profileInfo['data']['email'] = email;
                    profileInfo['data']['aboutme'] = aboutme;
                    profileInfo['data']['phoneNumber'] = phoneNumber;
                    profileInfo['data']['videoUrl'] = videoUrl;
                    profileInfo['data']['image'] = data['image'];
                    popup("Profile Updated", success);
                    localStorage.setItem("profileInfo",JSON.stringify(profileInfo));
                    // setTimeout(()=>{window.location.reload();},3000);
                }

            });
        }
    })
    function updateProfileInfo(){
        $.ajax({
            url: "http://"+SERVER_IP+"/profile/"+sessionInfo['userId'],
            type: "GET",
            dataType: "json",
            headers:{
                Authorization: "Bearer "+sessionInfo['token'],
                // Content-Type: "application/json",
            },
            error: function (error) {
                console.log(error);
            },
            success: function (data) { //callback   
                console.log('profile got');
                console.log(data);

                var tempProfile = data;
                let appliedJobs = []
                // tempProfile['data']['jobsApplied'] = [];
                data['data']['jobsApplied'].forEach(job=>{
                    appliedJobs = appliedJobs.concat(job['jobId']);
                })
                console.log(appliedJobs);
                tempProfile['data']['jobsApplied'] = appliedJobs;
                localStorage.setItem('profileInfo', JSON.stringify(tempProfile) );
            }

        });
    }

    $("#saveResume").click(function(){
        if(sessionInfo['token']===undefined){
            // alert('Login to update profile');
            popup("Login to update profile");
            return;
        }
        if(inpts.length > 4){
            let fd = new FormData();
            let expsal = Number($("#profile_expSalPerYear")[0].value || '0')
            let expsalHour = Number($('#profile_expSalPerHour')[0].value || '0')
            fd.append("fullName",  inpts[0].value || '');
            fd.append("phoneNumber",  inpts[2].value || '');
            fd.append("email",  inpts[1].value);
            fd.append("aboutMe",  inpts[3].value);
            fd.append("professionalTitle",  inpts[4].value);
            fd.append("region",  inpts[5].value);
            fd.append("url",  inpts[6].value);
            fd.append("experience",  inpts[7].value);
            fd.append("category",  'full time');
            fd.append("skills",  inpts[9].value);
            fd.append("education",  inpts[10].value);
            fd.append("companyName",  inpts[11].value);
            fd.append("vidLink",  inpts[12].value);
            fd.append("resume",  inpts[13].files[0]);
            fd.append("userid",sessionInfo['userId']);
            fd.append("salaryperhour",expsalHour);
            fd.append("salaryperyear",expsal)

            console.log(expsal);
            console.log(expsalHour);
            console.log(fd);

            $.ajax({
                url: "http://"+SERVER_IP+"/profile/",
                type: "POST",
                dataType: "json",
                processData: false,
                contentType: false,
                headers:{
                    Authorization: "Bearer "+ sessionInfo['token'],
                },
                data: fd,
                error: function (err) {
                    console.log(err);
                    popup("Profile Update Failed", error);

                },
                success: function (data) { //callback   
                    console.log('profile posted successfull');
                    // console.log(data);
                    localStorage.setItem('profileInfo', JSON.stringify(data) );
                    // updateProfileInfo();
                    popup("Profile Updated", success);
                }

            });
        }
    })

    $('#profile_expSalPerYear,#profile_expSalPerHour').keypress(isNumber);

    if(sessionInfo['userId']!=undefined && !profileInfo){
        console.log("inside");
        updateProfileInfo();
    }

    /*-------------------------------------------------------*/
    /*  Getting Jobs and stroing them in session storage
    /*-------------------------------------------------------*/
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    var jobsInfo = JSON.parse(localStorage.getItem('jobsInfo')||"{}");
    if(! jobsInfo['jobs']){
        jobsInfo['jobs'] = [];
    }
    var jobsContainer = document.getElementsByClassName('listings-container');
    var startIndex = 0;
    const limit = 25;
    var loc = window.location.href;
    String.prototype.capitalize = function() {
        return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };

    function showJobs(jobs){
        // console.log('In showjobs');
       // alert("showjob");
        if(!loc.match("browse-jobs.html")){
            jobs=jobs.slice(0,10);
        }
        // console.log(jobs);
        if(jobsContainer.length != 0){
            jobsContainer[0].innerHTML = '';
            let container = '';
            let currentDate = new Date();
            // let sin = startIndex;
            jobs.forEach(job=>{

                let date = job['createdAt'];
                let type = job['jobType'] || "";
                let diff;
                let isNew = ""
                type = type.toLowerCase();

                if(type=='full time'){
                    type = "full-time";
                }else if(type=="part time"){
                    type = "part-time"
                }else if(type=="internship"){
                    type="internship";
                }else if(type=="freelance"){
                    type="freelance";
                }else{
                    type="contract";
                }

                if(date == undefined){
                    date = "Old";
                }else{
                    date = Date.parse(date);
                    date =new Date(date);
                    date = ((currentDate - date) / (1000 * 3600 * 24))+0.49;
                    date = Number(date.toFixed());
                    if(date<3){
                        isNew = 'new';
                    }
                    // date = date.toLocaleDateString();
                    date = String(date)+'d ago';
                    if(date == '0d ago'){
                        date = "recent";
                    }
                }
                var currency_symbols = {
                    'USD': '$', // US Dollar
                    'EUR': '€', // Euro
                    'CRC': '₡', // Costa Rican Colón
                    'GBP': '£', // British Pound Sterling
                    'ILS': '₪', // Israeli New Sheqel
                    'INR': '₹', // Indian Rupee
                    'JPY': '¥', // Japanese Yen
                    'KRW': '₩', // South Korean Won
                    'NGN': '₦', // Nigerian Naira
                    'PHP': '₱', // Philippine Peso
                    'PLN': 'zł', // Polish Zloty
                    'PYG': '₲', // Paraguayan Guarani
                    'THB': '฿', // Thai Baht
                    'UAH': '₴', // Ukrainian Hryvnia
                    'VND': '₫', // Vietnamese Dong
                };
                // if(currency_symbols[currency_name]!==undefined) {
                //     alert(currency_symbols[currency_name]);
                // }
                let stype = job['salaryType'] == "YEARLY" ? "/yr":"/hr";
                let cursymbol = job['currencysymbol']
                let msal = job['maximumsalary'];
             
                if(msal){
                    if(cursymbol=='INR' || cursymbol =='Rupees'){
                        alert("curSymbol"+ cursymbol)
                    msal = "₹ "+ Number(job['maximumsalary']).toLocaleString()+stype;
                    }else{
                        msal = "$ "+ Number(job['maximumsalary']).toLocaleString()+stype;
                    }

                }else{
                    msal = "N/A";
                }
                container = `
                <a href="job-page-alt.html?`+job['_id']+`" class="listing showele `+type+`">
                    <div class="listing-logo">
                        <img src="images/job-list-logo-01.png" alt="">
                    </div>
                    <div class="listing-title">
                        <h4>`+job['title'].capitalize()+` <span class="listing-type">`+type.capitalize()+`</span></h4>
                        <ul class="listing-icons">
                            <li><i class="ln ln-icon-Management"></i> `+job['companyName']+`</li>
                            <li><i class="ln ln-icon-Map2"></i> `+job['location']+`</li>
                            <li><i class="ln ln-icon-Money-2"></i> `+msal+` </li>
                            <li><div class="listing-date `+isNew+`">`+date+`</div></li>
                        </ul>
                    </div>
                </a>
                `;
                // setTimeout((container)=>{jobsContainer[0].innerHTML+=container;},100);
                // let ele = container;
                // setTimeout(()=>{jobsContainer[0].innerHTML+=ele;},300);

                jobsContainer[0].innerHTML+=container;

            });
            // jobsContainer[0].innerHTML=container;
        }

    }

    function updateJobsinDB(){
      //  alert("jobupdate");
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/",
                type: "GET",
                dataType: "json",
                error: function (error) {
                    console.log("errorupdate" + error);
                },
                success: function (data) { //callback   
                    console.log('Jobs are stored');
                    localStorage.setItem('last_updated',new Date());
                    localStorage.setItem('jobsInfo', JSON.stringify(data) );
                    jobsInfo = data;
                    if(!loc.match("browse-jobs.html"))
                    showJobs(data['jobs'].slice(startIndex,startIndex+limit));
                }

            });
    }

    var consideringJobs = jobsInfo['jobs'];

    // function updateConsideringJobs(){
    //     let tempJobs = jobsInfo['jobs'];
    //     if(){

    //     }
    // }
        // var a = [[12, 'AAA'], [58, 'BBB'], [28, 'CCC'],[18, 'DDD']];

    // a.sort(sortFunction);

    function ratehight(a, b) {
        if (a['maximumsalary'] === b['maximumsalary']) {
            return 0;
        }
        else {
            return (a['maximumsalary'] > b['maximumsalary']) ? -1 : 1;
        }
    }
    function ratelowt(a, b) {
        if (a['maximumsalary'] === b['maximumsalary']) {
            return 0;
        }
        else {
            return (a['maximumsalary'] < b['maximumsalary']) ? -1 : 1;
        }
    }

    function applyFilters(jobs){
        try{
            const sortFilter = $("#sortJobFilter")[0].value || 'recent';
            let anyType  = $("#check-1")[0].checked;
            let fullT = $('#check-2')[0].checked;
            let partT = $('#check-3')[0].checked;
            let intern = $('#check-4')[0].checked;
            let freelance = $('#check-5')[0].checked;
            let contract = $('#check-12')[0].checked;
            
            let filterdJobs = [];
            jobs.forEach(job=>{
                if(anyType ){
                    filterdJobs = filterdJobs.concat(job)
                    return;
                }
                if(fullT && job['jobType']=='full time' ){
                    filterdJobs = filterdJobs.concat(job)
                    return;
                }
                if(partT && job['jobType']=='part time'){
                    filterdJobs = filterdJobs.concat(job)
                    return;
    
                }
                if(intern && job['jobType']=='internship'){
                    filterdJobs = filterdJobs.concat(job)
                    return;
                }
                if(freelance && job['jobType']=='freelance'){
                    filterdJobs = filterdJobs.concat(job)
                    return;
                }
                if(contract && job['jobType']=='contract'){
                    filterdJobs = filterdJobs.concat(job)
                    return;
                }
            })
            if(sortFilter == 'recent'){
                return filterdJobs
            }else if(sortFilter == 'oldest'){
                filterdJobs.reverse();
                return filterdJobs;
            }else if(sortFilter == 'ratehigh'){
                filterdJobs.sort(ratehight);
                return filterdJobs;
            }else if(sortFilter == 'ratelow'){
                filterdJobs.sort(ratelowt);
                return filterdJobs;
            }
            return filterdJobs;
        }
        catch(err){
            return jobs;
        }
        
    }
    

    function searchJobs(keyword,location=""){
        // console.log("Coming");
        let jobsStored = jobsInfo['jobs'];
        // if( !(keyword || location)){
        //     showJobs(jobsStored.slice(0,10));
        //     return;
        // }
        keyword = keyword.toLowerCase();
        location = location.toLowerCase();
        if(jobsStored){
            let jobsFound = [];
            jobsStored.forEach(job=>{
                if(job['location'].toLowerCase().match(location)){
                    if(keyword==""){
                        jobsFound = jobsFound.concat(job);
                        return;
                    }
                    if(job['primaryResponsibilities'].toLowerCase().match(keyword)){
                        jobsFound =jobsFound.concat(job);
                        return
                    }
                    if(job['title'].toLowerCase().match(keyword)){
                        jobsFound = jobsFound.concat(job);
                        return;
                    }
                    if(job['companyName'].toLowerCase().match(keyword)){
                        jobsFound = jobsFound.concat(job);
                    }
                }
            });
            // console.log("Jobs Found are");
            consideringJobs = jobsFound;
            jobsFound = applyFilters(jobsFound);
            showJobs(jobsFound.slice(0,10));
            console.log(jobsFound);
            return jobsFound;
        }
    }
    
    let ele1 = $("#keyword,#location");
    $('#sortJobFilter').change(e=>{
        setTimeout(()=>{showJobs(applyFilters(consideringJobs));},200);
    });

    $("#check-1,#check-2,#check-3,#check-4,#check-5,#check-12").click((event)=>{
        setTimeout(()=>{showJobs(applyFilters(consideringJobs));},200);
        // setTimeout(()=>{searchJobs(ele1[0].value,ele1[1].value);},200);
    })

    ele1.keypress(e=>{
        if(e.which==13){
            let keyword = ele1[0].value ;
            let location = ele1[1].value;
            // console.log(keyword || 'N/A',location || 'N/A');
            // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
            searchJobs(keyword,location);
        }
    })
    $('#jobSearchButton1').click(e=>{
        let keyword = ele1[0].value ;
        let location = ele1[1].value;
        // console.log(keyword || 'N/A',location || 'N/A');
        // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
        searchJobs(keyword,location);
    });

    $('#advanceSearchButton').click(e=>{
       
        window.location.href = "./browse-jobs.html";
    });
    
    if(loc.match("browse-jobs.html")){
        let params = getUrlVars();
        // consideringJobs
        console.log(params);
        let keyword = params['key'] ;
        let loc = params['loc'];
        if(keyword || loc){
            consideringJobs = searchJobs(keyword,loc);
        }else{
            consideringJobs = jobsInfo['jobs'] || [];
            showJobs(consideringJobs.slice(0,limit));
        }

    }


    if(jobsInfo['count']===undefined){
        updateJobsinDB();
    }else{
        let last_updated = Date.parse(localStorage.getItem('last_updated') || '01/01/2019');
        let diff = (new Date()) - last_updated;
        console.log( diff/1000 );
        if(diff/1000 > REFRESH_TIME){
            updateJobsinDB();
        }
    }



    if(! loc.match('my-account.html')){
        if(jobsInfo['jobs'] && ! loc.match("browse-jobs.html")){
         showJobs(jobsInfo['jobs'].slice(startIndex,startIndex+limit));
        }

    }

    $(".pagination-container a").click(function(event){
        event.preventDefault();
    });

    // $(".pagination-next-prev ");
    var page=1;
    console.log(consideringJobs);
    var maxJobs = consideringJobs.length;

    $("#jobInfoTag").text("we found "+maxJobs+" jobs");


    // functions showJobsByPage(){
    //     showjobs(consideringJobs)
    // }

    $(".pagination-next-prev li:nth-child(1)").click(function(event){
        if(page>1){
            page = page - 1;
            showJobs(consideringJobs.slice( (page-1)*limit ,(page*limit) ));
            $(".pagination-container .pagination li a").text(page);
        }
    })

    $(".pagination-next-prev li:nth-child(2)").click(function(event){
        if(page*limit< maxJobs && maxJobs < (page+1)*limit ){
            showJobs(consideringJobs.slice(page*limit ,(page*limit)+limit ));
            page = page+1;
            $(".pagination-container .pagination li a").text(page);
        }
    })

    function findJobByIdinServer(jobId){
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/"+jobId,
                type: "GET",
                dataType: "json",
                error: function (error) {
                    console.log(error);
                },
                success: function (data) { //callback   
                    console.log('Got the job');
                    console.log(data);
                    addFullJobDescription(data['job']);
                    // if(jobsInfo['jobs']){
                    //     jobsInfo['jobs'] = jobsInfo['jobs'].concat();
                    // }else{

                    // }
                    // localStorage.setItem('last_updated',new Date());
                    // localStorage.setItem('jobsInfo', JSON.stringify(data) );
                    // jobsInfo = data;
                }

            });
    }

    function findJobById(jobId){
        if(jobsInfo['jobs']){
            for(let i=0;i<jobsInfo['jobs'].length;i++){
                if(jobsInfo['jobs'][i]["_id"] == jobId){
                    return jobsInfo['jobs'][i];
                }
            }
            findJobByIdinServer(jobId);
        }
        return null
    }
    
    

    var jobKeyword = document.getElementById('jobKeyword');
    var jobLocation = document.getElementById('jobLocation');
    function getSearchData(){
        if(jobKeyword){
            let data = jobKeyword.value;
            let location = jobLocation.value;
            if(data!="" || location!=""){
                searchJobs(data,location);
            }
        }
    }
    let ele = $("#jobKeyword,#jobLocation");
    ele.keypress(e=>{
        if(e.which==13){
            let keyword = ele[0].value ;
            let location = ele[1].value;
            // console.log(keyword || 'N/A',location || 'N/A');
            // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
            searchJobs(keyword,location);
        }
    })

    $('#jobSearchButton').click(getSearchData);

    /*----------------------------------------------------*/
    /*  job-page-alt.html page
    /*----------------------------------------------------*/
    // var appliedResumes = JSON.parse(localStorage.getItem('appliedResume') || '[]');
    var appliedResumes = [];
    if(profileInfo){
        // console.log(profileInfo);
        appliedResumes = profileInfo['data']['jobsApplied'] || [];
    }
    console.log(appliedResumes);
    var jobID;
    function addFullJobDescription(jobId){
        if(jobsInfo['jobs']!=undefined){
            let job = findJobById(jobId);
            if (!job){
                return;
            }
            let type = $("#jobPageh");
            let descriptor = $('#job_description');
            let nameTag =$('#companyName');
            let jobLink = $("#jobLink");
            if(jobLink.length){
                let webLink  = job['Website'] || "#";
                // if(webLink!="#"){
                //     let sc1 = webLink.substr(0,8);
                //     let sc2 = webLink.substr(0,7);

                // }
                jobLink[0].href = webLink;
            }
            if(descriptor.length){
                descriptor[0].innerText = job['description'] || "We are leading company in our field";
            }
            if(nameTag.length){
                nameTag[0].innerText = job['companyName'].capitalize();
            }
            if(type.length){
                let tag = type;
                // type[0].innerText = job['primaryResponsibilities'];
                type = job['jobType'];
                type = type.toLowerCase();

                if(type=='full time'){
                    type = "full-time";
                }else if(type=="part time"){
                    type = "part-time"
                }else if(type=="internship"){
                    type="internship";
                }else if(type=='freelance'){
                    type="freelance";
                }else{
                    type = 'contract';
                }
                // let spanJobType = $("#jobType");
                // spanJobType[0].classList.value = type;
                // spanJobType[0].innerText = type.capitalize();
                // console.log(tag);
                tag[0].innerHTML=(job['primaryResponsibilities']||'').capitalize()+'<span id="jobType" class="'+type+'">'+type.capitalize()+'</span>'

            }
            let company ;
            let lists = $('.container .list-1');
            if(lists.length>1){
                let jobResp = lists[0];
                let jobReq = lists[1];

                let innerJobResp = "<li>"+job['primaryResponsibilities'].capitalize()+"</li><li>We’re looking for associates who enjoy interacting with people and working in a fast-paced environment!</li>";
                let innerJobReq = "<li>Must be available to work required shifts including weekends, evenings and holidays.</li>";
                let requirements = job['requirements'] || "";
                requirements = requirements.split(',')
                requirements.reverse();
                requirements.forEach(req=>{
                    innerJobReq = "<li>"+req+"</li>"+innerJobReq;
                });
                jobResp.innerHTML = innerJobResp;
                jobReq.innerHTML = innerJobReq;
            }


            let jobOverview = $(".job-overview span");
            if(jobOverview.length){
                jobOverview[0].innerText = job['location'].capitalize();
                jobOverview[1].innerText = job['jobType'].capitalize();
                // jobOverview[2].innerText = job[''];
                jobOverview[3].innerText = job['maximumsalary'] || "Best-In Industry";
            }
            let ahref = $("#applied");
            let params=loc.split('?');
            if(sessionInfo['token']){
                if(appliedResumes.length){
                    for(let appl=0;appl<appliedResumes.length;appl++){
                        if(appliedResumes[appl] == jobId){
                            ahref[0].innerText = "Applied";
                            ahref[0].href="#";
                            // ahref.addClass('appliedBack');
                            ahref[0].style.background = "mediumpurple"
                            break;
                        }
                    }
                }
            } 
        }
    }
    $("#applied").click((event)=>{
        if(sessionInfo.type!='applicant'){
            popup("Recruiter can't apply jobs",error);
            event.preventDefault();

            return;
        }
        if(!sessionInfo['token']){
            popup("Login to apply, Redirecting...",error);
            setTimeout(()=>{window.location.href = "./my-account.html";},2000);
            return
        }
        if(!profileInfo){
            popup("Update your resume in profile to apply",error);
            return
        }
        alert("tick");
        // $("#applybtn").click();
       // document.getElementById("applybtn").click();
    });

    $('a.show_form').on('click', function() {
        alert("hi");
        $('#form_wrapper').show();
    });​​​​​
    $("#performApply").click((event)=>{
        event.preventDefault();
        let params=loc.split('?')
        let tags = $('#applyForm input,textarea');
        let fd = new FormData();
        fd.append("applicantName",  tags[0].value);
        fd.append("applicantEmail",  tags[1].value);
        fd.append("applicantMessage",  tags[2].value);
        fd.append('jobId', jobID);
        if(tags[3].files.length){
            fd.append("resume",  tags[3].files[0] || '');
        }else{
            popup("Upload Resume");
            return;
        }
        fd.append('applicantProfile', profileInfo['data']['_id'])
        let tempId = jobID;
        loader.start()
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/apply",
                type: "POST",
                dataType: "json",
                timeouut: 10000,
                processData: false,
                contentType: false,
                headers:{
                    Authorization: "Bearer "+ sessionInfo['token'],
                },
                data: fd,
                error: function (err) {
                    console.log(err);
                    loader.stop()
                    popup("Error occured try again later",error);

                },
                success: function (data) { //callback   
                    console.log('Applied successfully');
                    loader.stop();
                    console.log(data);
                    let ahref = $("#applied");
                    let buts = $('#small-dialog button');
                    buts[1].click();
                    popup('Job applied',success);
                    ahref[0].style.background = "mediumpurple"
                    ahref[0].innerText = "Applied";
                    appliedResumes = appliedResumes.concat(tempId);
                    profileInfo['data']['jobsApplied'] = appliedResumes;
                    localStorage.setItem('profileInfo',JSON.stringify(profileInfo))
                }

            });


        if(params.length<=1){
            return
        }
    });


    if(loc.match('job-page-alt.html')){ //only perform this while in page
        let params=loc.split('?');
        if(params.length>1){
            jobID = params[1];
            addFullJobDescription(params[1]);
        }
        $("input[type=file]").change(function(e)
            {
                console.log(e.target.files[0]);
                let filename = "Select Resume (pdf,doc)"
                try{
                    filename = e.target.files[0]['name'];
                }
                catch(err){

                }
                $(".fake-input").text(filename);
            }
        )
        if(profileInfo){
            console.log("Coming"); 
            let data = $("#applyForm input");
            console.log(data);
            data[0].value = profileInfo['data']['fullName'] || '';
            data[1].value = profileInfo['data']['email'] || '';
            // $('#applyForm a').attr('href','http://"+SERVER_IP+"/'+profileInfo['data']['resume'] || '#');
        }
        else{
            // $('#applyForm a').hide();
        }
    }

    /*----------------------------------------------------*/
    /*  Applying Jobs
    /*----------------------------------------------------*/ 





    /*----------------------------------------------------*/
    /*  Adding Jobs
    /*----------------------------------------------------*/    
    

    $("#jmaxsal,#jminsal").keypress(isNumber);

    $("#addJobTag").click(function(event){
        console.log('Coming');
        if(!sessionInfo['token']){
            popup("Login to post a job", error);
            return
        }
        // return;
        let name,mail,title,type,categories,location,jexp,tags,jobdesc,appUrl,closingDate,minRate,maxRate,minSal,maxSal,cursymbol,compName,compSite,compDesc;
        let salaryType;
        name = $("#jname")[0].value;
        mail = $("#jemail")[0].value;
        title = $("#jtitle")[0].value;
        type = $("#jtype")[0].value;
        categories = $("#jPriResp")[0].selectedOptions[0].text;
        location = $("#jloc")[0].value;
        jexp  = $("#jexp")[0].value;
        tags = $("#jtag")[0].value;
        jobdesc = $("#jdesc")[0].value;
        appUrl = $("#jappUrl")[0].value;
        closingDate = $("#jcloseDate")[0].value;
        salaryType = $("#jsaltype")[0].selectedIndex ? "HOURLY" :"YEARLY";

        minSal = $("#jminsal")[0].value;
        maxSal = $("#jmaxsal")[0].value;
        cursymbol= $("#cursymbol")[0].value;
        compName = $("#jcompname")[0].value;
        compSite = $("#jcompsite")[0].value;
        compDesc = $("#jcompdesc")[0].value;
        if(!(name && mail && title && location && compName && minSal && maxSal && cursymbol)){
            popup('Fields missing',error);
            return;
        }
        // return;
        console.log(name,mail,title,type,categories,location,jexp,tags,jobdesc,appUrl,closingDate,minSal,maxSal,cursymbol,compName,compSite,compDesc);
        event.preventDefault();
        loader.start()

        // return;
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    name : name,
                    email :mail,
                    title:title,
                    activeStatus:"yes",
                    primaryResponsibilities:categories,
                    requirements:tags,
                    description:jobdesc,
                    location:location,
                    jobType:type,
                    url:appUrl,
                    minimumrate:minRate || 0, 
                    maximumrate : maxRate || 0,
                    minimumsalary:minSal,
                    maximumsalary :maxSal,
                    currencysymbol: cursymbol || 'USD',
                    experience: jexp,
                    closeDate: closingDate,
                    // companyDetails:"fous",
                    salaryType:salaryType,
                    createdBy: sessionInfo['userId'],
                    companyName:compName,
                    Website :compSite,
                    companyDescription :compDesc,
                    userid : sessionInfo['userId'],
                },
                error: function (err) {
                    popup("Job posting failed",error);
                    loader.stop();
                    console.log(err);
                },
                success: function (data) { //callback   
                    console.log('Job posted successfull');
                    console.log(data);
                    popup("Job added successfully", success);
                    updateJobsinDB();
                    loader.stop();
                    window.location.href="dashboard-manage-jobs.html?refresh=true";
                    // localStorage.setItem('profileInfo', JSON.stringify(data) );
                }
            });
    })

    function salaryTypeUpdate() {
        if(this.selectedIndex){
            $(".spanSalary").text("Per Hour");
        }
        else{
            $(".spanSalary").text("Per Year");
        }   
 }

    $('#jsaltype').change(salaryTypeUpdate) ;


    /*----------------------------------------------------*/
    /*  Manage Jobs
    /*----------------------------------------------------*/

    let jobTable = $("#manageJobs");
    let applicationdiv = $("#applications");

    let userPostedJobs = JSON.parse(localStorage.getItem("userPostedJobs") || '{}');

    let applicantApp = [];

    function handler(){

        let type = this.dataset.type;
        let jobId = this.dataset.jobid;
        console.log(type);
        if(type == "mark-as-filled"){
            $.ajax({
                url: "http://"+SERVER_IP+"/jobs/markFilled",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    jobID: jobId,
                    filled: true,
                    
                },
                error: function (err) {
                    popup("Job Updation failed",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    console.log('Job marked filled');
                    console.log(data);
                    popup("Job marked filled", success);
                    updateUserPostedJobs();
                    // updateJobsinDB();
                    // localStorage.setItem('profileInfo', JSON.stringify(data) );
                }
            });

        }else if (type=="delete") {
            $.ajax({
                url: "http://"+SERVER_IP+"/jobs/"+jobId,
                type: "DELETE",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                error: function (err) {
                    popup("Job deletion failed",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    console.log('Job deleted');
                    console.log(data);
                    popup("Job deleted", success);
                    setTimeout(updateUserPostedJobs,1000);
                }
            });
        }
    }
    const starClasses={0:"rating no-stars",1:"rating one-stars",2:"rating two-stars",3:"rating three-stars",4:"rating four-stars",5:"rating five-stars"};
    function addApplication(appl,i){
        console.log(appl);
        let resumeLink = appl.purchased? 'http://'+SERVER_IP+"/"+appl.resume:'#' ;
        let cla = "";
        if(resumeLink=="#"){
            cla="purchase";
        }
        let appliedDate = appl.appliedOn ? (new Date(appl.appliedOn)).toDateString() :'Recent';
        let ratingStars ;

        let apl=`
                    <div class="application">
                <div class="app-content">
                    
                    <!-- Name / Avatar -->
                    <div class="info">
                        <img src="images/resumes-list-avatar-01.png" alt="">
                        <span>`+appl.applicantName+`</span>
                        <ul>
                            <li class="`+cla+`" data-id="`+appl._id+`"><a data-id="`+appl._id+`" href="`+resumeLink+`" target="_blank"><i class="fa fa-file-text"></i> Download CV</a></li>
                            
                        </ul>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="buttons">
                        <a href="#one-`+i+`" class="button gray app-link"><i class="fa fa-pencil"></i> Edit</a>
                        <a href="#two-`+i+`" class="button gray app-link"><i class="fa fa-sticky-note"></i> Add Note</a>
                        <a href="#three-`+i+`" class="button gray app-link"><i class="fa fa-plus-circle"></i> Show Details</a>
                    </div>
                    <div class="clearfix"></div>

                </div>

                <!--  Hidden Tabs -->
                <div class="app-tabs">

                    <a href="#" class="close-tab button gray"><i class="fa fa-close"></i></a>
                    
                    <!-- First Tab -->
                    <div class="app-tab-content" id="one-`+i+`">

                        <div class="select-grid">
                            <select data-placeholder="`+(appl.applicationStatus.toLowerCase().capitalize())+`" value="`+appl.applicationStatus.toLowerCase()+`" class="chosen-select-no-single">
                                <option value="new">New</option>
                                <option value="interviewed">Interviewed</option>
                                <option value="offer extended">Offer extended</option>
                                <option value="hired">Hired</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div class="select-grid">
                            <input type="text" class="min5" value=`+appl.rating+` placeholder="Rating (out of 5)">
                        </div>

                        <div class="clearfix"></div>
                        <a href="#" class="button margin-top-15 applicationChanges" data-id="`+appl._id+`" data-i='`+i+`'>Save</a>
                        <a href="#" class="button gray margin-top-15 delete-application" data-application=`+appl._id+` data-i='`+i+`'>Delete this application</a>

                    </div>
                    
                    <!-- Second Tab -->
                    <div class="app-tab-content"  id="two-`+i+`">
                        <textarea placeholder="Private note regarding this application">`+(appl.note || '')+`</textarea>
                        <a href="#" class="button margin-top-15 addnote" data-id="`+appl._id+`" data-i='`+i+`'>Add Note</a>
                    </div>
                    
                    <!-- Third Tab -->
                    <div class="app-tab-content"  id="three-`+i+`">
                        <i>Full Name:</i>
                        <span>`+appl.applicantName+`</span>

                        <i>Email:</i>
                        <span><a href="mailto:`+appl.applicantEmail+`">`+appl.applicantEmail+`</a></span>

                        <i>Message:</i>
                        <span>`+appl.applicantMessage+`</span>
                    </div>

                </div>

                <!-- Footer -->
                <div class="app-footer">

                    <div class="`+starClasses[appl.rating]+`">
                        <div class="star-rating"></div>
                        <div class="star-bg"></div>
                    </div>

                    <ul>
                        <li><i class="fa fa-file-text-o"></i>`+appl.applicationStatus+`</li>
                        <li><i class="fa fa-calendar"></i>`+ appliedDate+`</li>
                    </ul>
                    <div class="clearfix"></div>

                </div>
            </div>
        `
        // console.log(apl);
        applicationdiv[0].innerHTML+=apl;
    }

    function sortByDate(a,b){
        if (a['appliedOn'] === b['appliedOn']) {
            return 0;
        }
        else {
            return (a['appliedOn'] > b['appliedOn']) ? -1 : 1;
        }
    }
    function byName(a,b){
        if (a['applicantName'] == b['applicantName']) {
            return 0;
        }
        else {
            return (a['applicantName'] > b['applicantName']) ? -1 : 1;
        }
    }
    function byRating(a,b){
        if (a['rating'] === b['rating']) {
            return 0;
        }
        else {
            return (a['rating'] > b['rating']) ? -1 : 1;
        }
    }
    
    function applicantAdd(jobId = ''){
        let item = 1;
        let type = [];
        let applications = [];
        console.log("Job id "+jobId);
        let params = getUrlVars();
        let sortV = params['s'] || 'new';
        $('#appSort')[0].value = sortV;
        let filterV = params['f'] || 'none';
        $('#appFilter')[0].value = filterV;
        if(filterV=='offer'){
            filterV = 'offer extended';
        }
        filterV = filterV.toUpperCase();

        userPostedJobs['job'].forEach(job=>{
            if(jobId){
                if(job._id == jobId){
                    if(job.applicants.length){
                        job.applicants.forEach(applicant=>{
                            applications.push(applicant);
                            
                        })
                    }
                }
                return;
            }
            if(job.applicants.length){
                job.applicants.forEach(applicant=>{
                    applications.push(applicant);
                    
                })
            }
        });
        applicantApp = applications;
        if(sortV=='new'){
            applications.sort(sortByDate);
        }else if(sortV="name"){
            applications.sort(byName);
        }else if(sortV == 'rating'){
            applications.sort(byRating);
        }
        applications.forEach(applicant=>{
            if(filterV==applicant.applicationStatus || filterV=="NONE"){
                addApplication(applicant,item);
                type.push(applicant.applicationStatus.toLowerCase())
                item+=1;
            }
        })
        console.log(type)
        for(let i=1;i<=item;i++){
            $('#one-'+i+' > div:nth-child(1) > select').val(type[i-1]).trigger("chosen:updated");
        }
    }

    function eventHandsApp(){
        $(".applicationChanges").click((event)=>{
            event.preventDefault();
            // console.log(this);
            console.log(event.target.dataset);
            let i  = event.target.dataset.i;
            let id = event.target.dataset.id;
            console.log(id);
            let sselect = '#one-'+i+' > div:nth-child(1) > select';
            const appStatus = $(sselect)[0].value;
            console.log(appStatus);
            const ratingN = Number($('#one-'+i+' > div:nth-child(2) > input')[0].value);
            console.log(ratingN);
            $.ajax({
                url: "http://"+SERVER_IP+"/jobs/application/edit",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    applicationId: id,
                    applicationStatus: appStatus,
                    rating: ratingN,
                },
                error: function (err) {
                    popup("Application edit failed",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    popup("Successful", success);
                    updateUserPostedJobs();
                    setTimeout(()=>{window.location.reload()},2000 );
                }
            });

        })
        $('.addnote').click(e=>{
            e.preventDefault();
            console.log(event.target.dataset);
            let i  = event.target.dataset.i;
            let id = event.target.dataset.id;
            console.log(id);
            let sselect = '#two-'+i+' textarea';
            const noteDat = $(sselect)[0].value;
            $.ajax({
                url: "http://"+SERVER_IP+"/jobs/application/addNote",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    applicationId: id,
                    note : noteDat
                },
                error: function (err) {
                    popup("Failed to add note",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    popup("Note added successfully", success);
                    updateUserPostedJobs();
                    // setTimeout(()=>{window.location.reload()},2000 );
                }
            });

        })

        $('.delete-application').click(e=>{
            let id = e.target.dataset.application;
            console.log(id);
            $.ajax({
                url: "http://"+SERVER_IP+"/jobs/application/delete",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    applicationId: id,
                },
                error: function (err) {
                    popup("Failed to add note",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    popup("Deletion successful", success);
                    updateUserPostedJobs();
                    // setTimeout(()=>{window.location.reload()},2000 );
                }
            });
        });

        $(".purchase").click((event)=>{
            event.preventDefault();
            let id = event.target.dataset.id;
            $("#popupAlert .confirm")[0].dataset.id = id;
            $("#popupAlert").addClass("showele");
        });

    }



    if(applicationdiv.length){
        applicationdiv[0].innerHTML="";
        if(userPostedJobs['job'].length){
            // console.log();
            const urlVars =getUrlVars();
            applicantAdd(urlVars['id'] || '');

            eventHandsApp();

            $('#appSort,#appFilter').change(e=>{
                // console.log(e.target.value);
                let pa = getUrlVars();
                let sv=$('#appSort')[0].value;
                let fv=$('#appFilter')[0].value;
                let s="";
                let id = pa['id'];
                if(id){
                    s+= 'id='+id+'&';
                }
                s+='s='+sv+"&f="+fv;
                let u = window.location.href.split('?')[0];
                console.log(s);
                console.log(u);
                window.location.href = u+'?'+s;
                // applyAppFilnSort();
            })
            function addResumeToApplication(appId,resume){
                let found = false;
                
                for (var i = 0; i < userPostedJobs['job'].length; i++) {
                    let applications = userPostedJobs['job'][i]['applicants'];
                    for (var j = 0; j < applications.length; j++) {
                        if(applications[j]['_id']==appId){
                             // applications[i]['resume'] = resume;
                             userPostedJobs['job'][i]['applicants'][j]['purchased'] = true;
                             userPostedJobs['job'][i]['applicants'][j]['resume'] = resume;
                             localStorage.setItem("userPostedJobs",JSON.stringify(userPostedJobs));
                             found = true;
                             break;
                        }   
                    }
                    if(found){
                        break;
                    }
                }
            }

            function purchaseApplication(appId){

                if(sessionInfo['resumedownloadlimit']<1){
                    popup("You need to buy one of the package to refill your resume download limit",error);
                    setTimeout(()=>{window.location.href="./pricing-tables.html"},3000);
                    return;
                }

                $.ajax({
                    url: "http://"+SERVER_IP+"/jobs/application/purchase",
                    type: "POST",
                    dataType: "json",
                    headers:{
                        Authorization: "Bearer "+ sessionInfo['token'],
                    },
                    data: {
                        applicationId: appId,
                    },
                    error: function (err) {
                        console.log(err);
                        popup("Purchase Failed", error);

                    },
                    success: function (data) { //callback   
                        console.log('Purchased successfully');
                        console.log(data);
                        $("#popupAlert").removeClass("showele");

                        // localStorage.setItem('profileInfo', JSON.stringify(data) );
                        popup("Purchased successfully", success);
                        sessionInfo['resumedownloadlimit'] -=1;
                        localStorage.setItem("sessionInfo",JSON.stringify(sessionInfo));
                        
                        addResumeToApplication(appId,data.resume);
                        window.location.reload();
                    }

                });   
            }

            $("#popupAlert .confirm").click(ele=>{
                // console.log(this);
                console.log(ele.target.dataset);
                purchaseApplication(ele.target.dataset.id);
            })



            $(".min5").keypress(evt=>{
                 evt = (evt) ? evt : window.event;
                  var charCode = (evt.which) ? evt.which : evt.keyCode;
                  var val = evt.target.value ? true: false;
                  if(val){
                    return false;
                  }
                  if ( charCode > 31 && (charCode < 48 || charCode > 53)) {
                    return false;
                  }
                  return true;

            })
        }
    }

    function showPostedJobs(){

        if(!jobTable.length){
            return;
        }

        if(! userPostedJobs['job'])
            return;

        let innerHTML = `
        <tr>
            <th><i class="fa fa-file-text"></i> Title</th>
            <th><i class="fa fa-check-square-o"></i> Filled?</th>
            <th><i class="fa fa-calendar"></i> Date Posted</th>
            <th><i class="fa fa-calendar"></i> Date Expires</th>
            <th><i class="fa fa-user"></i> Applications</th>
            <th></th>
        </tr>
        `;

        for (var i = userPostedJobs['job'].length -1; i >=0 ; i--) {
            let jobId = userPostedJobs['job'][i]._id;
            let title = userPostedJobs['job'][i].title || "N/A";
            let filled = userPostedJobs['job'][i].filled ? '<i class="fa fa-check"></i>' : "-";
            let date_posted = Date.parse(userPostedJobs['job'][i].createdAt);
            date_posted = new Date(date_posted).toDateString();
            let date_expires  = userPostedJobs['job'][i].closeDate || "N/A";
            let applicants = userPostedJobs['job'][i]['applicants'].length;
            if(applicants){
                applicants = `<a href="dashboard-manage-applications.html?id=`+jobId+`" class="button">Show (`+applicants+`)</a>`;
            }else{
                applicants = '-'
            }
            let extras;
            if(filled=="-"){
                extras=`
                <a href="./dashboard-edit-job.html?`+jobId+`" data-type="edit" data-jobId="`+jobId+`"><i class="fa fa-pencil" ></i> Edit</a>
                <a href="#" data-type="mark-as-filled" data-jobId="`+jobId+`"><i class="fa  fa-check " ></i> Mark Filled</a>
                <a href="#" class="delete" data-type="delete" data-jobId="`+jobId+`"><i class="fa fa-remove"></i> Delete</a>
                `
            }else{
                extras=`
                <a href="#" class="delete" data-type="delete" data-jobId="`+jobId+`"><i class="fa fa-remove"></i> Delete</a>
                `
            }
            innerHTML+=`
                <tr>
                    <td class="title">`+title+`</td>
                    <td class="centered">`+filled+`</td>
                    <td>`+date_posted+`</td>
                    <td>`+date_expires+`</td>
                    <td class="centered">`+applicants+`</td>
                    <td class="action">
                        `+extras+`
                    </td>
                </tr>   
            `
        }
        jobTable[0].children[0].innerHTML = innerHTML;
        jobTable.addClass("showele");
        $('#manageJobs a').click(handler);
    }



    function updateUserPostedJobs(){
        if(! sessionInfo['userId']){
            return;
        }
        if(sessionInfo['type'] != 'recruiter'){
            return;
        }
        if(getUrlVars()['refresh']){
            loader.start();
        }
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/applications",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                error: function (error) {
                    console.log(error);
                },
                success: function (data) { //callback   
                    console.log('Posted Jobs are stored');
                    localStorage.setItem('last_updated_uj',new Date());
                    localStorage.setItem('userPostedJobs', JSON.stringify(data) );
                    loader.stop();
                    if(loc.match("dashboard-manage-jobs.html?refresh")){
                        window.location.href="dashboard-manage-jobs.html";
                    }
                    userPostedJobs = data;
                    showPostedJobs();
                    // window.location.reload();
                }

            });
    }

    if(!userPostedJobs.job){
        updateUserPostedJobs();
    }

    if(jobTable.length){
        console.log("manageJobs page");
        let dat = getUrlVars();
        console.log(dat);
        if(dat['refresh']){
            updateUserPostedJobs();
        }
        else{
            showPostedJobs();
        }

    }else{
        console.log("not in manageJobs page");
    }
    console.log(loc);

    function findUserPostedJob(jobId){
        if(!jobId){
            popup("Error no jobId found",error);
        }

        console.log(userPostedJobs);
        if(userPostedJobs['job']){
            for(let i=0;i<userPostedJobs['job'].length;i++){
                if(userPostedJobs['job'][i]["_id"] == jobId){
                    return userPostedJobs['job'][i];
                }
            }
        }
        return null

    }

    function fillJobDetails(_id){
      
        console.log(_id);
        let jobFound = findUserPostedJob(_id);
        console.log(jobFound);
       
        if(jobFound){
        $("#jname")[0].value = jobFound.name;
        $("#jemail")[0].value= jobFound.email || '';
        $("#jtitle")[0].value= jobFound.title || "";
        $("#jtype")[0].value;
        $("#jPriResp")[0].selectedOptions[0].text;
        $("#jloc")[0].value= jobFound.location || "";
        $("#jexp")[0].value= jobFound.experience || "";
        $("#jtag")[0].value= jobFound.requirements || "";
        $("#jdesc")[0].value= jobFound.description || "";
        $("#jappUrl")[0].value= jobFound.url || "";
        $("#jcloseDate")[0].value= jobFound.closeDate || "";
        $("#jsaltype")[0].selectedIndex ? "HOURLY" :"YEARLY";

        $("#jminsal")[0].value= jobFound.minimumsalary || "";
        $("#jmaxsal")[0].value= jobFound.maximumsalary || "";
        if(jobFound.currencysymbol === "Rupees"){          
          //  $("#cursymbol")[0].selectedOptions[2].text;
            
            $("#cursymbol option[value=INR]").attr('selected', 'selected'); 
            $("#cursymbol").selectmenu('refresh', true);
        }else if(jobFound.currencysymbol == "Candian Doallar"){
            $("#cursymbol option[value=CAD]").attr('selected', 'selected'); 
            $("#cursymbol").selectmenu('refresh', true);
        }else if(jobFound.currencysymbol == "US Dollar"){
            $("#cursymbol option[value=USD]").attr('selected', 'selected'); 
            $("#cursymbol").selectmenu('refresh', true);
        }else{
            $("#cursymbol")[0].value= jobFound.currencysymbol || "";
        }
        $("#cursymbol")[0].value= jobFound.currencysymbol || "";
        $("#jcompname")[0].value= jobFound.companyName || "";
        $("#jcompsite")[0].value= jobFound.Website || "";
        $("#jcompdesc")[0].value= jobFound.companyDescription || "";
        popup("Job Loaded. Start changes",success);
        }else{
            popup("This job is not posted by you", error);
        }
    }

    let jobIDUpdating ;

    $("#updateJobTag").click(function(event){
        console.log('Coming to update jobs');
        if(!sessionInfo['token']){
            popup("Login to post a job", error);
            return
        }
        // return;
        let name,mail,title,type,categories,location,jexp,tags,jobdesc,appUrl,closingDate,minRate,maxRate,minSal,maxSal,cursymbol,compName,compSite,compDesc;
        let salaryType;
        name = $("#jname")[0].value;
        mail = $("#jemail")[0].value;
        title = $("#jtitle")[0].value;
        type = $("#jtype")[0].value;
        categories = $("#jPriResp")[0].selectedOptions[0].text;
        location = $("#jloc")[0].value;
        jexp  = $("#jexp")[0].value;
        tags = $("#jtag")[0].value;
        jobdesc = $("#jdesc")[0].value;
        appUrl = $("#jappUrl")[0].value;
        closingDate = $("#jcloseDate")[0].value;
        salaryType = $("#jsaltype")[0].selectedIndex ? "HOURLY" :"YEARLY";

        minSal = $("#jminsal")[0].value;
        maxSal = $("#jmaxsal")[0].value;
        cursymbol = $("#cursymbol")[0].value;
        compName = $("#jcompname")[0].value;
        compSite = $("#jcompsite")[0].value;
        compDesc = $("#jcompdesc")[0].value;
        if(!(name && mail && title && location && compName && cursymbol)){
            popup('Fields missing',error);
            return;
        }
        // return;
        console.log(name,mail,title,type,categories,location,jexp,tags,jobdesc,appUrl,closingDate,minSal,maxSal,cursymbol,compName,compSite,compDesc);
        event.preventDefault();

        // return;
        $.ajax({
                url: "http://"+SERVER_IP+"/jobs/update",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                data: {
                    jobID: jobIDUpdating,
                    name : name,
                    email :mail,
                    title:title,
                    activeStatus:"yes",
                    primaryResponsibilities:categories,
                    requirements:tags,
                    description:jobdesc,
                    location:location,
                    jobType:type,
                    url:appUrl,
                    minimumrate:minRate || 0, 
                    maximumrate : maxRate || 0,
                    minimumsalary:minSal,
                    maximumsalary :maxSal,
                    currencysymbol: cursymbol || 'USD',
                    experience: jexp,
                    closeDate: closingDate,
                    // companyDetails:"fous",
                    salaryType:salaryType,
                    createdBy: sessionInfo['userId'],
                    companyName:compName,
                    Website :compSite,
                    companyDescription :compDesc,
                    userid : sessionInfo['userId'],
                },
                error: function (err) {
                    popup("Job Updation failed",error);
                    console.log(err);
                },
                success: function (data) { //callback   
                    console.log('Job updated successfull');
                    console.log(data);
                    popup("Job updated successfully", success);
                    updateUserPostedJobs();
                    // updateJobsinDB();
                    // localStorage.setItem('profileInfo', JSON.stringify(data) );
                }
            });
    })

    let counter = $("#resumeCount");
    if(counter.length){
        counter[0].innerText = sessionInfo['resumedownloadlimit'] || 0;
    }

    if($("#jobCounter").length){
        if(userPostedJobs['job']){
            $("#jobCounter")[0].innerText = userPostedJobs['job'].length;
         }
    }
    if($("#totalJobViews").length){
        
    }
    if($("#totalAppl").length){
        if(userPostedJobs['job']){
            let c = 0;
            userPostedJobs['job'].forEach(job=>{
                c += job['applicants'].length;
            })
            console.log(c);
            $("#totalAppl")[0].innerText = c;
        }
    }


    if(loc.match("dashboard-edit-job.html")){
        console.log("in edit job");
        let params = loc.split("?");
        if(params.length>=2 && params[1]!=""){
            jobIDUpdating =params[1]
            fillJobDetails(params[1]);
        }else{
            popup("No Job Id found",error);
        }
    }
     /*----------------------------------------------------*/
    /*  SHOWING resumes
    /*----------------------------------------------------*/


    if(loc.match("browse-resumes.html")){
        if(sessionInfo['type']!="recruiter"){
            popup("Applicants are not allowed to view resumes ",error);
            setTimeout(()=>{window.location.href="./index.html"},3000);
            return;
        }

    }

    const resumeListContainer = $("#resume-list");
    let resumeList = JSON.parse(localStorage.getItem('resumeList') || '{}')
    let searchedResumes = [];
    let filterdResumes = [];

    function showResumes(resumes){
        if(!resumeListContainer[0]){
            return;
        }
        $('#resumeCountTag').text("We've found "+filterdResumes.length+" resumes for:")
        let dat = '';
        resumes.forEach(resume=>{
         //   alert("resume"+ JSON.stringify(resume));
            if(resume['fullName'] && resume['email'] && resume['aboutMe'] && resume['skills']){
                let skills = resume.skills.split(",");
                let imgsrc = "images/resumes-list-avatar-01.png";
                if(resume.image){
                 imgsrc = "http://"+SERVER_IP+"/"+resume.image;

                }
                let skillTag=""
                skills.forEach(skill=>{
                    skillTag+= "<span>"+skill+"</span>"
                })
                let title = resume['professionalTitle'];
                if(title){
                    title = title.toLowerCase().capitalize()
                }
                dat+=`
                <li class="resumeList showele"><a href="resume-page.html?`+resume['_id']+`">
                    <img src="`+imgsrc+`" alt="">
                    <div class="resumes-list-content">
                        <h4>`+resume['fullName']+`<span>`+(title || 'N/A')+`</span></h4>
                        <span><i class="fa fa-map-marker"></i> `+(resume['region'] || 'N/A' )+`</span>
                        <span><i class="fa fa-money"></i> $`+(resume['salaryperyear'] || '10000')+` / year</span>
                        <span><i class="fa fa-money"></i> $`+(resume['salaryperhour'] || '15')+` / hr</span>
                        <p>Over 8000 hours on oDesk (only Drupal related). Highly motivated, goal-oriented, hands-on senior software engineer with extensive technical skills and over 15 years of experience in software development</p>

                        <div class="skills">
                            `+skillTag+`
                        </div>
                        <div class="clearfix"></div>

                    </div>
                    </a>
                    <div class="clearfix"></div>
                </li>

                `
            }
        })
        resumeListContainer[0].innerHTML=dat;
    }   
    function ratehigh(a, b) {
        if (a['salaryperyear'] === b['salaryperyear']) {
            return 0;
        }
        else {
            return (a['salaryperyear'] > b['salaryperyear']) ? -1 : 1;
        }
    }
    function ratelow(a, b) {
        if (a['salary'] === b['salary']) {
            return 0;
        }
        else {
            return (a['salary'] < b['salary']) ? -1 : 1;
        }
    }
    const sortFilterResumeVar = $('#sortFilterResume');
    function applySortinResumes(){
        let selectedValue = sortFilterResumeVar[0].value;
        console.log(selectedValue)
        if(selectedValue == 'recent'){
            // filterdResumes = resumeList['resumes'];
            showResumes(filterdResumes.slice(startIndex,startIndex+limit));
        }else if(selectedValue=='ratehigh'){
            // let temp = [...filterdResumes]
            filterdResumes.sort(ratehigh);
            showResumes(filterdResumes.slice(startIndex,limit));
        }else if(selectedValue=='ratelow'){
            // showResumes();
            filterdResumes.sort(ratelow);
            showResumes(filterdResumes.slice(startIndex,startIndex+limit));
        }
    }

    function getFilterSkills(){
        const skillTag = $('#rskilltag')
        let skills = []
        skillTag[0].selectedOptions
        for(let i=0;i<skillTag[0].selectedOptions.length;i++){
            // console.log(skillTag[0].selectedOptions[i]);
            skills.push(skillTag[0].selectedOptions[i].value)
        }
        // console.log(skills)
        return skills
    }

    function isPresent(selskills,rskills){

        for(let i=0;i<rskills.length;i++){
            if(selskills.indexOf(rskills[i]) != -1 ){
                return true
            }
        }
        return false
    }

    function applyResumeFilters(resumes){
        const skills = getFilterSkills();
        let anyRate = $("#check-6")[0].checked;
        let ztfRate = $("#check-7")[0].checked;
        let tffRate = $("#check-8")[0].checked;
        let fhdRate = $("#check-9")[0].checked;
        let hdthdRate = $("#check-10")[0].checked;
        let thdPRate = $("#check-11")[0].checked;
        let aresumes = []
        resumes.forEach(resume=>{
            let rskills = []
            let s=resume['skills'] || '';
            s.split(',').forEach(skill=>{
                rskills.push(skill.toLowerCase())
            })
            if( skills.length==0 || isPresent(skills,rskills)){
                let r = resume['salaryperhour'] || 15;
                if(anyRate){
                    aresumes.push(resume)
                    return;
                }
                if (ztfRate && (r>=0 && r<=25) ) {
                    aresumes.push(resume);
                    return;
                }
                if(tffRate && (r>=25 && r<=50) ){

                    aresumes.push(resume)
                    return;
                }
                if (fhdRate && (r>=50 && r<=100) ) {
                    aresumes.push(resume);
                    return;
                }
                if(hdthdRate && (r>=100 && r<=200) ){
                    aresumes.push(resume);
                    return;
                }
                if (thdPRate && (r>200) ) {
                    aresumes.push(resume);
                    return;
                }
            }
            
        })
        return aresumes;
    }

    function searchResumes(keyword='', location=''){
        let resumesStored = resumeList['resumes'];
        keyword = keyword.toLowerCase();
        location = location.toLowerCase();
        if(resumesStored){
            let resFound = [];
            resumesStored.forEach(resume=>{
                if(resume['region'] && resume['professionalTitle']){

                    if(resume['region'].toLowerCase().match(location)){
                        if(keyword==""){
                            resFound = resFound.concat(resume);
                            return;
                        }
                        if(resume['professionalTitle'].toLowerCase().match(keyword)){
                            resFound =resFound.concat(resume);
                            return
                        }
                    }
                }

            });
            searchedResumes = resFound;
            filterdResumes = resFound;
            // console.log(resFound);
            resFound = applyResumeFilters(resFound);
            showResumes(resFound.slice(0,10));
            // console.log(resFound);
            return resFound;
        }

    }
    $('#sortFilterResume').change(()=>{applySortinResumes()})
    
    let rele = $('#rkeyword,#rlocation');
    $('.filterResume').click(e=>{
        console.log('comig')
        let keyword = rele[0].value ;
        let location = rele[1].value;
        // console.log(keyword || 'N/A',location || 'N/A');
        // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
        setTimeout(()=>{searchResumes(keyword,location)},300);
    })
    rele.keypress(e=>{
        if(e.which==13){
            let keyword = rele[0].value ;
            let location = rele[1].value;
            // console.log(keyword || 'N/A',location || 'N/A');
            // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
            searchResumes(keyword,location);
        }
    })
    if(loc.match("browse-resumes.html")){
        $('input[type="checkbox"]').click(e=>{
            let keyword = rele[0].value ;
            let location = rele[1].value;
            // console.log(keyword || 'N/A',location || 'N/A');
            // $(".searcherClass")[0].href="browse-jobs.html?key="+(keyword || '')+"&loc="+(location || '')+""
            // searchResumes(keyword,location);
            setTimeout(()=>{searchResumes(keyword,location)},300);

        })
    }

   
    

    function searchResumeById(id){
        if(! id){
            return;
        }
        if(resumeList['resumes']){
            for(let i=0;i<resumeList['resumes'].length;i++){
                if(resumeList['resumes'][i]['_id']==id){
                    return resumeList['resumes'][i]
                }
            }
            return false
        }

    }

    function showResumeInFullPage(id){
        let resume = searchResumeById(id);
      
        if(resume){
            console.log("resume Found");
          //  alert("resumedetail"+ JSON.stringify(resume));
            console.log(resume);
            if(resume.image){
                let imgtag = document.querySelector(".resume-titlebar img")
                imgtag.src = "http://"+SERVER_IP+"/"+resume.image;
            }
            let resumeLink = 'http://'+SERVER_IP+"/"+resume.resume ;
            let skills = resume.skills.split(",")
            let skillTag=""
            skills.forEach(skill=>{
                skillTag+= "<span>"+skill+"</span>"
            })
            let title = resume['professionalTitle'];
            if(title){
                title = title.toLowerCase().capitalize()
            }
            let dat;
           // alert("resumecheck"+ JSON.stringify(resume));
           // alert("limit1"+ sessionInfo['resumedownloadlimit']);
            if((sessionInfo['resumedownloadlimit'] < 1) || (typeof sessionInfo['resumedownloadlimit'] === 'undefined')){               
                 dat =`
                <h4>`+resume['fullName']+`<span>`+(title || 'N/A')+`</span></h4>
                <span><i class="fa fa-map-marker"></i> `+(resume['region'] || 'N/A' )+`</span>
                <span><i class="fa fa-money"></i> $`+(resume['salaryperyear'] || '10000')+` / year</span>
                             
    
                <div class="skills">
                    `+skillTag+`
                </div>
                <div class="clearfix"></div>
                <div> <a  href="./pricing-tables.html" target="_blank"><i class="fa fa-file-text"></i> Download Resume</a></div>
                
                `
            }else{

            dat =`
            <h4>`+resume['fullName']+`<span>`+(title || 'N/A')+`</span></h4>
            <span><i class="fa fa-map-marker"></i> `+(resume['region'] || 'N/A' )+`</span>
            <span><i class="fa fa-money"></i> $`+(resume['salaryperyear'] || '10000')+` / year</span>
            <span><i class="fa fa-envelope"></i> `+(resume['email'] || '10000')+`</span>
            

            <div class="skills">
                `+skillTag+`
            </div>
            <div class="clearfix"></div>
            <div> <a  href="`+resumeLink+`" target="_blank"><i class="fa fa-file-text"></i> Download Resume</a></div>
            `}
          
            $("#resume-list2")[0].innerHTML = dat;
            $('#raboutme')[0].innerText = resume['aboutMe'];
            $("#reducation")[0].innerText= resume['education'] || "Completed Degree with 70% aggregate";
            // $('#rName')[0].innerHTML = resume['fullName']+"<span>"+resume['professionalTitle']+"</span>"

        }
    }
    function updateResumes(){
      //  alert("resumerec1");
        if(sessionInfo.type=="recruiter"){
          //  alert("resumerec" + sessionInfo['token']);
            console.log("token"+sessionInfo['token']);
            $.ajax({
                url: "http://"+SERVER_IP+"/profile/resumes",
                type: "POST",
                dataType: "json",
                headers:{
                    Authorization: "Bearer "+sessionInfo['token'],
                },
                error: function (error) {
                    console.log(error);
                },
                success: function (data) { //callback   
                    console.log('resumes are stored');
                    console.log(data);
                    // localStorage.setItem('last_updated_uj',new Date());
                    localStorage.setItem('resumeList', JSON.stringify(data) );
                    resumeList = data;
                    showResumes(data['resumes'].slice(0,10));
                }

            });
        }
    }

    if(userType==='recruiter'){
        let last_updated = Date.parse(localStorage.getItem('last_updated') || '01/01/2019');
        let diff = (new Date()) - last_updated;
        console.log( diff/1000 );
        if(diff/1000 > REFRESH_TIME){
            updateResumes();
        }
    }

    if(loc.match("resume-page.html")){
        console.log("in reusme page");
        let params= loc.split('?');
        if(params.length<2){
            popup("No Resume Id found",error);
        }else{
            let resumeId = params[1];
            showResumeInFullPage(resumeId); 
        }
        
    }
    
    function showMyResume(){
        // let resume = searchResumeById(id);
        if( ! sessionInfo.userId){
            popup("You are not logged in",error);
            return;
        }
        if(  sessionInfo.type!="applicant"){
            popup("You dont have access to this page",error);
            return;
        }
        let resume = profileInfo['data'];
        let count =0;
        Object.keys(resume).forEach(k=>{
            if(resume[k]){
                ++count;
            }
        })
        console.log( Object.keys(resume).length,count);
        setTimeout(()=>{window.setProgress((count/Object.keys(resume).length)*100)},500)
        if(resume){
            
            if(resume.image){
                let imgtag = document.querySelector(".resume-titlebar img")
                imgtag.src = "http://"+SERVER_IP+"/"+resume.image;
            }
            let skills = resume.skills.split(",")
            let skillTag=""
            skills.forEach(skill=>{
                skillTag+= "<span>"+skill+"</span>"
            })
            let title = resume['professionalTitle'];
            if(title){
                title = title.toLowerCase().capitalize()
            }
            let dat =`
            <h4>`+resume['fullName']+`<span>`+(title || 'N/A')+`</span></h4>
            <span><i class="fa fa-map-marker"></i> `+(resume['region'] || 'N/A' )+`</span>
            <span><i class="fa fa-money"></i> $`+(resume['salary'] || '10000')+` / year</span>
            <span><i class="fa fa-envelope"></i> `+(resume['email'] || '10000')+`</span>
            

            <div class="skills">
                `+skillTag+`
            </div>
            <div class="clearfix"></div>
            `
            $("#resume-list2")[0].innerHTML = dat;
            $('#raboutme')[0].innerText = resume['aboutMe'];
            $("#reducation")[0].innerText= resume['education'] || "Completed Degree with 70% aggregate";
            // $('#rName')[0].innerHTML = resume['fullName']+"<span>"+resume['professionalTitle']+"</span>"
        }
    }
    if(circle){
        showMyResume();
    }
     setInterval(()=>{updateResumes()},30000); // refresh resumes every 30 seconds

    
    if(resumeListContainer.length){
        console.log("In resumesFInd")
        resumeList = JSON.parse(localStorage.getItem('resumeList') || '{}')
        if(resumeList.resumes){
            filterdResumes = resumeList['resumes'];
            showResumes(resumeList['resumes'].slice(startIndex,limit));
        }
        else{
        updateResumes();
    }
    }


    function updater(){
    //   alert("update");
        let last_updated = Date.parse(localStorage.getItem('last_updated') || '01/01/2019');
        let diff = (new Date()) - last_updated;
        // console.log( diff/1000 );
        if(diff/1000 < REFRESH_TIME){
            // updateResumes();
            return
        }
        console.log('Updater');
        if(userType==='recruiter'){
            updateResumes();
            updateUserPostedJobs();
        }
        updateJobsinDB();
    }

  //  alert("inupdater");
    setInterval(()=>{updater()},100*100);
    if(!sessionInfo.type){
    $("#responsive > li:nth-child(4)").show();
    }

    /*----------------------------------------------------*/
    /*  Navigation
    /*----------------------------------------------------*/
    if($('header').hasClass('full-width')) {
        $('header').attr('data-full', 'yes');
    }  
    if($('header').hasClass('alternative')) {
        $('header').attr('data-alt', 'yes');
    }

    function superFishInit() {
        $('#navigation').superfish({
            delay:       300,                               // one second delay on mouseout
            animation:   {opacity:'show'},   // fade-in and slide-down animation
            speed:       200,                               // animation speed
            speedOut:    50                                 // out animation speed
        });
    }

    function menumobile(){
        var winWidth = $(window).width();
        if( winWidth < 973 ) {
            $('#navigation').removeClass('menu');
            $('#navigation li').removeClass('dropdown');
            $('header').removeClass('full-width');
            $('#navigation').superfish('destroy');
        } else {
            $('#navigation').addClass('menu');
            if($('header').data('full') === "yes" ) {
                 $('header').addClass('full-width');
            }
            superFishInit();
        }
        if( winWidth < 1272 ) {
            $('header').addClass('alternative').removeClass('full-width');
        } else {
            if($('header').data('alt') === "yes" ) {} else {
                $('header').removeClass('alternative');
            }
        }
    }

    $(window).on('load resize', function() {
        menumobile();
    });
    superFishInit();


     /*----------------------------------------------------*/
    /*  Mobile Navigation
    /*----------------------------------------------------*/
        var jPanelMenu = $.jPanelMenu({
          menu: '#responsive',
          animated: false,
          duration: 200,
          keyboardShortcuts: false,
          closeOnContentClick: true
        });


      // desktop devices
        $('.menu-trigger').click(function(){
          var jpm = $(this);

          if( jpm.hasClass('active') )
          {
            jPanelMenu.off();
            jpm.removeClass('active');
          }
          else
          {
            jPanelMenu.on();
            jPanelMenu.open();
            jpm.addClass('active');
          }
          return false;
        });


        // Removes SuperFish Styles
        $('#jPanelMenu-menu').removeClass('sf-menu');
        $('#jPanelMenu-menu li ul').removeAttr('style');


        $(window).resize(function (){
          var winWidth = $(window).width();
          var jpmactive = $('.menu-trigger');
          if(winWidth>990) {
            jPanelMenu.off();
            jpmactive.removeClass('active');
          }
        });


    /*----------------------------------------------------*/
    /*  Stacktable / Responsive Tables Plug-in
    /*----------------------------------------------------*/
    $('.responsive-table').stacktable();
    


    /*----------------------------------------------------*/
    /*  Back to Top
    /*----------------------------------------------------*/
        var pxShow = 400; // height on which the button will show
        var fadeInTime = 400; // how slow / fast you want the button to show
        var fadeOutTime = 400; // how slow / fast you want the button to hide
        var scrollSpeed = 400; // how slow / fast you want the button to scroll to top.

        $(window).scroll(function(){
          if($(window).scrollTop() >= pxShow){
            $("#backtotop").fadeIn(fadeInTime);
          } else {
            $("#backtotop").fadeOut(fadeOutTime);
          }
        });

        $('#backtotop a').click(function(){
          $('html, body').animate({scrollTop:0}, scrollSpeed);
          return false;
        });
    


    /*----------------------------------------------------*/
    /*  Showbiz Carousel
    /*----------------------------------------------------*/
        $('#job-spotlight').showbizpro({
            dragAndScroll:"off",
            visibleElementsArray:[1,1,1,1],
            carousel:"off",
            entrySizeOffset:0,
            allEntryAtOnce:"off",
            rewindFromEnd:"off",
            autoPlay:"off",
            delay:2000,
            speed:400,
            easing:'easeOut'
        });

        $('#our-clients').showbizpro({
            dragAndScroll:"off",
            visibleElementsArray:[5,4,3,1],
            carousel:"off",
            entrySizeOffset:0,
            allEntryAtOnce:"off"
        });



    /*----------------------------------------------------*/
    /*  Slick Carousel
    /*----------------------------------------------------*/
    $('.testimonial-carousel').slick({
      centerMode: true,
      centerPadding: '34%',
      slidesToShow: 1,
      dots: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            centerPadding: '10px',
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 767,
          settings: {
            centerPadding: '10px',
            slidesToShow: 1
          }
        }
      ]
    });


    /*----------------------------------------------------*/
    /*  Flip Banner
    /*----------------------------------------------------*/
    function flipBanner() {

        $('.flip-banner').prepend('<div class="flip-banner-overlay"></div>');

        $(".flip-banner").each(function() {
            var attrImage = $(this).attr('data-background');
            var attrColor = $(this).attr('data-color');
            var attrOpacity = $(this).attr('data-color-opacity');

            if(attrImage !== undefined) {
                $(this).css('background-image', 'url('+attrImage+')');
            }

            if(attrColor !== undefined) {
                $(this).find(".flip-banner-overlay").css('background-color', ''+attrColor+'');
            }

            if(attrOpacity !== undefined) {
                $(this).find(".flip-banner-overlay").css('opacity', ''+attrOpacity+'');
            }

        });
    }
    flipBanner();


    /*----------------------------------------------------*/
    /*  Image Box
    /*----------------------------------------------------*/
    $('.img-box').each(function(){
        $(this).append('<div class="img-box-background"></div>');
        $(this).children('.img-box-background').css({'background-image': 'url('+ $(this).attr('data-background-image') +')'});
    });


    /*----------------------------------------------------*/
    /*  Revolution Slider
    /*----------------------------------------------------*/
        $('.fullwidthbanner').revolution({
            delay: 9000,
            startwidth: 1180,
            startheight: 640,
            onHoverStop: "on", // Stop Banner Timet at Hover on Slide on/off
            navigationType: "none", //bullet, none
            navigationArrows: "verticalcentered", //nexttobullets, verticalcentered, none
            navigationStyle: "none", //round, square, navbar, none
            touchenabled: "on", // Enable Swipe Function : on/off
            navOffsetHorizontal: 0,
            navOffsetVertical: 20,
            stopAtSlide: -1, // Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
            stopAfterLoops: -1, // Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic
            fullWidth: "on",
        });



    /*----------------------------------------------------*/
    /*  Flexslider
    /*----------------------------------------------------*/
        $('.testimonials-slider').flexslider({
            animation: "fade",
            controlsContainer: $(".custom-controls-container"),
            customDirectionNav: $(".custom-navigation a")
        });



    /*----------------------------------------------------*/
    /*  Counters
    /*----------------------------------------------------*/

        $('.counter').counterUp({
            delay: 10,
            time: 800
        });



    /*----------------------------------------------------*/
    /*  Chosen Plugin
    /*----------------------------------------------------*/

        var config = {
          '.chosen-select'           : {disable_search_threshold: 10, width:"100%"},
          '.chosen-select-deselect'  : {allow_single_deselect:true, width:"100%"},
          '.chosen-select-no-single' : {disable_search_threshold:10, width:"100%"},
          '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
          '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
          $(selector).chosen(config[selector]);
        }


    /*----------------------------------------------------*/
    /*  Checkboxes "any" fix
    /*----------------------------------------------------*/   
        $('.checkboxes').find('input:first').addClass('first');
        $('.checkboxes input').on('change', function() {
            if($(this).hasClass('first')){
                $(this).parents('.checkboxes').find('input').prop('checked', false);
                $(this).prop('checked', true);
            } else {
                $(this).parents('.checkboxes').find('input:first').not(this).prop('checked', false);
            }
        });


    /*----------------------------------------------------*/
    /*  Magnific Popup
    /*----------------------------------------------------*/   
        
            $('body').magnificPopup({
                type: 'image',
                delegate: 'a.mfp-gallery',

                fixedContentPos: true,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: true,

                removalDelay: 0,
                mainClass: 'mfp-fade',

                gallery:{enabled:true},

                callbacks: {
                    buildControls: function() {
                        console.log('inside'); this.contentContainer.append(this.arrowLeft.add(this.arrowRight));
                    }
                }
            });


            $('.popup-with-zoom-anim').magnificPopup({
                type: 'inline',

                fixedContentPos: false,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,

                // width: "700px",
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-zoom-in'
            });


            $('.mfp-image').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-fade',
                image: {
                    verticalFit: true
                }
            });


            $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,

                fixedContentPos: false
            });


     /*---------------------------------------------------*/
    /*  Contact Form
    /*---------------------------------------------------*/
    $("#contactform .submit").click(function(e) {


      e.preventDefault();
      var user_name       = $('input[name=name]').val();
      var user_email      = $('input[name=email]').val();
      var user_comment    = $('textarea[name=comment]').val();

      //simple validation at client's end
      //we simply change border color to red if empty field using .css()
      var proceed = true;
      if(user_name===""){
          $('input[name=name]').addClass('error');
            proceed = false;
          }
          if(user_email===""){
            $('input[name=email]').addClass('error');
            proceed = false;
          }
          if(user_comment==="") {
            $('textarea[name=comment]').addClass('error');
            proceed = false;
          }

          //everything looks good! proceed...
          if(proceed) {
            $('.hide').fadeIn();
            $("#contactform .submit").fadeOut();
              //data to be sent to server
              var post_data = {'userName':user_name, 'userEmail':user_email, 'userComment':user_comment};

              //Ajax post data to server
              $.post('contact.php', post_data, function(response){
                var output;
                //load json data from server and output comment
                if(response.type == 'error')
                  {
                    output = '<div class="error">'+response.text+'</div>';
                    $('.hide').fadeOut();
                    $("#contactform .submit").fadeIn();
                  } else {

                    output = '<div class="success">'+response.text+'</div>';
                    //reset values in all input fields
                    $('#contact div input').val('');
                    $('#contact textarea').val('');
                    $('.hide').fadeOut();
                    $("#contactform .submit").fadeIn().attr("disabled", "disabled").css({'backgroundColor':'#c0c0c0', 'cursor': 'default' });
                  }

                  $("#result").hide().html(output).slideDown();
                }, 'json');
            }
      });

    //reset previously set border colors and hide all comment on .keyup()
    $("#contactform input, #contactform textarea").keyup(function() {
      $("#contactform input, #contactform textarea").removeClass('error');
      $("#result").slideUp();
    });




    /*----------------------------------------------------*/
    /*  Accordions
    /*----------------------------------------------------*/

        var $accor = $('.accordion');

         $accor.each(function() {
            $(this).addClass('ui-accordion ui-widget ui-helper-reset');
            $(this).find('h3').addClass('ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-corner-all');
            $(this).find('div').addClass('ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom');
            $(this).find("div").hide().first().show();
            $(this).find("h3").first().removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-accordion-header-active ui-state-active ui-corner-top');
            $(this).find("span").first().addClass('ui-accordion-icon-active');
        });

        var $trigger = $accor.find('h3');

        $trigger.on('click', function(e) {
            var location = $(this).parent();

            if( $(this).next().is(':hidden') ) {
                var $triggerloc = $('h3',location);
                $triggerloc.removeClass('ui-accordion-header-active ui-state-active ui-corner-top').next().slideUp(300);
                $triggerloc.find('span').removeClass('ui-accordion-icon-active');
                $(this).find('span').addClass('ui-accordion-icon-active');
                $(this).addClass('ui-accordion-header-active ui-state-active ui-corner-top').next().slideDown(300);
            }
             e.preventDefault();
        });

    

    /*----------------------------------------------------*/
    /*  Application Tabs
    /*----------------------------------------------------*/   
        // Get all the links.
        var link = $(".app-link");
        $('.close-tab').hide();

        $('.app-tabs div.app-tab-content').hide();
        // On clicking of the links do something.
        link.on('click', function(e) {

            e.preventDefault();
            $(this).parents('div.application').find('.close-tab').fadeOut();
            var a = $(this).attr("href");
            if($(this).hasClass('opened')) {
                $(this).parents('div.application').find(".app-tabs div.app-tab-content").slideUp('fast');
                $(this).parents('div.application').find('.close-tab').fadeOut(10);
                $(this).removeClass('opened');
            } else {
                $(this).parents('div.application').find(".app-link").removeClass('opened');
                $(this).addClass('opened');
                $(this).parents('div.application').find(a).slideDown('fast').removeClass('closed').addClass('opened');
                $(this).parents('div.application').find('.close-tab').fadeIn(10);
            }

            $(this).parents('div.application').find(".app-tabs div.app-tab-content").not(a).slideUp('fast').addClass('closed').removeClass('opened');
            
        });

        $('.close-tab').on('click',function(e){
            $(this).fadeOut();
            e.preventDefault();
            $(this).parents('div.application').find(".app-link").removeClass('opened');
            $(this).parents('div.application').find(".app-tabs div.app-tab-content").slideUp('fast').addClass('closed').removeClass('opened');
        });


    /*----------------------------------------------------*/
    /*  Add Resume 
    /*----------------------------------------------------*/   
        $('.box-to-clone').hide();
        $('.add-box').on('click', function(e) {
            e.preventDefault();
            var newElem = $(this).parent().find('.box-to-clone:first').clone();
            newElem.find('input').val('');
            newElem.prependTo($(this).parent()).show();
            var height = $(this).prev('.box-to-clone').outerHeight(true);
            
            $("html, body").stop().animate({ scrollTop: $(this).offset().top-height}, 600);
        });

        $('body').on('click','.remove-box', function(e) {
            e.preventDefault();
            $(this).parent().remove();
        });



    /*----------------------------------------------------*/
    /*  Tabs
    /*----------------------------------------------------*/ 
  

        var $tabsNav    = $('.tabs-nav'),
        $tabsNavLis = $tabsNav.children('li');
        // $tabContent = $('.tab-content');

        $tabsNav.each(function() {
            var $this = $(this);

            $this.next().children('.tab-content').stop(true,true).hide()
            .first().show();

            $this.children('li').first().addClass('active').stop(true,true).show();
        });

        $tabsNavLis.on('click', function(e) {
            var $this = $(this);

            $this.siblings().removeClass('active').end()
            .addClass('active');

            $this.parent().next().children('.tab-content').stop(true,true).hide()
            .siblings( $this.find('a').attr('href') ).fadeIn();

            e.preventDefault();
        });
          var hash = window.location.hash;
    var anchor = $('.tabs-nav a[href="' + hash + '"]');
    if (anchor.length === 0) {
        $(".tabs-nav li:first").addClass("active").show(); //Activate first tab
        $(".tab-content:first").show(); //Show first tab content
    } else {
        console.log(anchor);
        anchor.parent('li').click();
    }



    /*----------------------------------------------------*/
    /*  Sliding In-Out Content
    /*----------------------------------------------------*/

    $(window).bind("load resize scroll",function(e){
        var headerElem = $('.search-container');

        // flying out and fading for header content
        $(headerElem).css({  'transform': 'translateY(' + (  $(window).scrollTop() / -9 ) + 'px)', });
        // $(headerElem).css({ 'opacity': 1 - $(window).scrollTop() / 600 });  
    });



    /*----------------------------------------------------*/
    /*  Parallax
    /*----------------------------------------------------*/
    /* detect touch */
    if("ontouchstart" in window){
        document.documentElement.className = document.documentElement.className + " touch";
    }
    if(!$("html").hasClass("touch")){
        /* background fix */
        $(".parallax").css("background-attachment", "fixed");
    }

    /* fix vertical when not overflow
    call fullscreenFix() if .fullscreen content changes */
    function fullscreenFix(){
        var h = $('body').height();
        // set .fullscreen height
        $(".parallax-content").each(function(i){
            if($(this).innerHeight() > h){ $(this).closest(".fullscreen").addClass("overflow");
            }
        });
    }
    $(window).resize(fullscreenFix);
    fullscreenFix();



    /* resize background images */
    function backgroundResize(){
        var windowH = $(window).height();
        $(".background").each(function(i){
            var path = $(this);
            // variables
            var contW = path.width();
            var contH = path.height();
            var imgW = path.attr("data-img-width");
            var imgH = path.attr("data-img-height");
            var ratio = imgW / imgH;
            // overflowing difference
            var diff = parseFloat(path.attr("data-diff"));
            diff = diff ? diff : 0;
            // remaining height to have fullscreen image only on parallax
            var remainingH = 0;
            if(path.hasClass("parallax") && !$("html").hasClass("touch")){
                var maxH = contH > windowH ? contH : windowH;
                remainingH = windowH - contH;
            }
            // set img values depending on cont
            imgH = contH + remainingH + diff;
            imgW = imgH * ratio;
            // fix when too large
            if(contW > imgW){
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.data("resized-imgW", imgW);
            path.data("resized-imgH", imgH);
            path.css("background-size", imgW + "px " + imgH + "px");
        });
    }
    $(window).resize(backgroundResize);
    $(window).focus(backgroundResize);
    backgroundResize();



    /* set parallax background-position */
    function parallaxPosition(e){
        var heightWindow = $(window).height();
        var topWindow = $(window).scrollTop();
        var bottomWindow = topWindow + heightWindow;
        var currentWindow = (topWindow + bottomWindow) / 2;
        $(".parallax").each(function(i){
            var path = $(this);
            var height = path.height();
            var top = path.offset().top;
            var bottom = top + height;
            // only when in range
            if(bottomWindow > top && topWindow < bottom){
                var imgW = path.data("resized-imgW");
                var imgH = path.data("resized-imgH");
                // min when image touch top of window
                var min = 0;
                // max when image touch bottom of window
                var max = - imgH + heightWindow;
                // overflow changes parallax
                var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
                top = top - overflowH;
                bottom = bottom + overflowH;
                // value with linear interpolation
                var value = -100 + min + (max - min) * (currentWindow - top) / (bottom - top);
                // set background-position
                var orizontalPosition = path.attr("data-oriz-pos");
                orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
                $(this).css("background-position", orizontalPosition + " " + value + "px");

            }
        });
    }
    if(!$("html").hasClass("touch")){
        $(window).resize(parallaxPosition);
        //$(window).focus(parallaxPosition);
        $(window).scroll(parallaxPosition);
        parallaxPosition();
    }


    /*----------------------------------------------------*/
    /*  Sticky Header 
    /*----------------------------------------------------*/
    $(".sticky-header").clone(true).addClass('cloned').insertAfter(".sticky-header");
    $(".sticky-header.cloned.transparent #logo a img").attr("src", "images/logo.png");
    $(".sticky-header.cloned.alternative").removeClass('alternative');

    if ( $( ".sticky-header" ).length) { 
        var stickyHeader = document.querySelector(".sticky-header.cloned");

        var headroom = new Headroom(stickyHeader, {
          "offset": $(".sticky-header").height(),
          "tolerance": 0
        });
    }

    // disabling on mobile
    $(window).bind("load resize",function(e){
        $( ".sticky-header.cloned" ).removeClass('transparent alternative');

        var winWidth = $(window).width();

        if(winWidth>1290 && $(".sticky-header").length) {
            headroom.init();
            }

            else if(winWidth<1290 && $(".dashboard-header").length < 0) {
                headroom.destroy();
                $(".sticky-header.cloned").remove();
            }
    });


    /*----------------------------------------------------*/
    /*  Auto Header Padding
    /*----------------------------------------------------*/
    $(window).on('load resize', function() {
        var winWidth = $(window).width();
        if (winWidth>990) {
            var headerHeight = $(".dashboard-header").height();
            $('#dashboard').css('padding-top', headerHeight);
        } else {
            $('#dashboard').css('padding-top','0');
        }

    });

    /*----------------------------------------------------*/
    /* Dashboard Scripts
    /*----------------------------------------------------*/

    // Dashboard Nav Submenus
    $('.dashboard-nav ul li a').on('click', function(e){
        if($(this).closest("li").children("ul").length) {
            if ( $(this).closest("li").is(".active-submenu") ) {
               $('.dashboard-nav ul li').removeClass('active-submenu');
            } else {
                $('.dashboard-nav ul li').removeClass('active-submenu');
                $(this).parent('li').addClass('active-submenu');
            }
            e.preventDefault();
        }
    });

    // Dashbaord Nav Scrolling
    $(window).on('load resize', function() {
        var wrapperHeight = window.innerHeight;
        var headerHeight = $("#header-container").height();
        var winWidth = $(window).width();

        if(winWidth>992) {
            $(".dashboard-nav-inner").css('max-height', wrapperHeight-headerHeight);
        } else {
            $(".dashboard-nav-inner").css('max-height', '');
        }
    });


    // Responsive Nav Trigger
    $('.dashboard-responsive-nav-trigger').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active');

        var dashboardNavContainer = $('body').find(".dashboard-nav");

        if( $(this).hasClass('active') ){
            $(dashboardNavContainer).addClass('active');
        } else {
            $(dashboardNavContainer).removeClass('active');
        }

    });
    


// ------------------ End Document ------------------ //
});

})(this.jQuery);

  