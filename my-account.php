<!DOCTYPE html>
<!--[if IE 8 ]>
<html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!-->
<html lang="en"> <!--<![endif]-->

<!-- Mirrored from vasterad.com/themes/workscout/ by HTTrack Website Copier/3.x [XR&CO'2014], Wed, 15 Jun 2016 16:46:01 GMT -->
<head>

    <!-- Basic Page Needs
    ================================================== -->
    <meta charset="utf-8">
    <title>BridgeGap</title>

    <!-- Mobile Specific Metas
    ================================================== -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- CSS
    ================================================== -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/colors/green.css" id="colors">


    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

</head>

<body>
<div id="wrapper">


    <!-- Header
    ================================================== -->
    <header>
        <div class="container">
            <div class="sixteen columns">

                <!-- Logo -->
                <div id="logo">
                    <h1><a href="index.php"><img src="images/logo_bridge.jpg" alt="BridgeGap"/></a></h1>
                </div>

                <nav id="navigation" class="menu">


                    <ul class="float-right">
                        <li><a href="Employers"><i class="fa fa-user"></i>Employer Click here</a></li>

                    </ul>

                </nav>

                <!-- Navigation -->
                <div id="mobile-navigation">
                    <a href="#menu" class="menu-trigger"><i class="fa fa-reorder"></i> Menu</a>
                </div>

            </div>
        </div>
    </header>
    <!-- Content
    ================================================== -->
    <div id="banner_login">
        <div class="container">
            <div class="sixteen columns">
                <div class="my-account">


                    <div class="tabs-container">
                        <!-- Login -->
                        <div class="tab-content" id="signin" style="display: none;">

                            <h2 class="heading">Login</h2>

                            <form method="post" class="login">


                                <p class="form-row form-row-wide">
                                    <label for="username">Username or Email Address:</label>
                                    <input type="text" class="input-text" name="username" id="username" value=""/>
                                </p>

                                <p class="form-row form-row-wide">
                                    <label for="password">Password:</label>
                                    <input class="input-text" type="password" name="password" id="password"/>
                                </p>

                                <p class="form-row">
                                    <input type="submit" class="button btn_large" name="login" value="Login"/>

                                    <label for="rememberme" class="rememberme">
                                        <input name="rememberme" type="checkbox" id="rememberme" value="forever"/>
                                        Remember Me</label>
                                </p>

                                <p class="lost_password">
                                    <a href="#">Lost Your Password?</a>
                                </p>


                            </form>
                        </div>

                        <!-- Register -->
                        <div class="tab-content" id="signup" style="display: none;">

                            <h3 class="margin-bottom-10 margin-top-10">Register</h3>

                            <form method="post" class="register">

                                <p class="form-row form-row-wide">
                                    <label for="reg_email">Email Address:</label>
                                    <input type="email" class="input-text" name="email" id="reg_email" value=""/>
                                </p>


                                <p class="form-row form-row-wide">
                                    <label for="reg_password">Password:</label>
                                    <input type="password" class="input-text" name="password" id="reg_password"/>
                                </p>

                                <p class="form-row form-row-wide">
                                    <label for="reg_password2">Repeat Password:</label>
                                    <input type="password" class="input-text" name="password" id="reg_password2"/>
                                </p>


                                <p class="form-row">
                                    <input type="submit" class="button" name="register" value="Register"/>
                                </p>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    </div>
    <!-- Container -->


    <!-- Footer
    ================================================== -->
    <div class="margin-top-30"></div>

<?php
include "footer.php";
?>