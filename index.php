<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1" name="viewport">
    <title>Welcome</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/fonts.css">
           	<script>
	   document.cookie='resolution='+Math.max(screen.width,screen.height)+'; path=/'; 
	</script>
    <script src="js/matchMedia.js"></script>
    <script src="js/modernizr.js"></script>
    <script src="js/ajax.js"></script>
</head>
<body id="home">
        <header>
<section>
<h1>Welcome <span>to the</span> Little <em>Cocktail</em> <span>Site</span></h1>
<h2><em>What's it going to be...</em></h2></section>
    <ul><li><a href="c1"></a></li><li><a href="c5"></a></li><li><a href="c3"></a></li><li><a href="c6"></a></li><li><a href="c4"></a></li><li><a href="c2"></a></li></ul></header>
<div class="wrapper">

    <main>
        <div>
        <div class="placeholder"><img src="img/fc.jpg" id="base"/></div>
        <section id="controls" class="static">
            <button id="backbutton"></button>
            <button id="playbutton"></button>
            <button id="forwardbutton"></button>
        </section>
            </div>
      

        <?php
include 'response.php';
?>
        </main>
    <footer>
  <div class="arrow-down"></div>
  <p><a href="http://www.hearst.com/">&copy;2015 Hearst Communications, Inc.</a> All Rights Reserved
  </p></footer></div>
    <script src="js/viewportSize.js"></script>
    <script src="js/shims.js"></script>
    <script src="js/underscore.js"></script>
    <script src="js/classlist.js"></script>
    <script src="js/basicIterator.js"></script>
    <script src="js/global.js"></script>
          <script>
        var hijax = window.speakEasy.Hijax(),
            c = speakEasy.Util.$('response');
              console.log(speakEasy.Util.getBody())
              
        hijax.setContainer(document.forms[0]);
        hijax.setCanvas(c);
        hijax.setUrl('response.php');
        hijax.setCallback(_.partial(speakEasy.Util.addClass, 'response', speakEasy.Util.getBody));
        hijax.captureData();
    </script>

    <!--<script src="js/slideshow.js"></script>-->
    </body>
</html>

<!--

\n\s+
(^[^<]+?)\n
//no para tag
\n\s*(?=[A-Z])\n

//opening tag only
(?)\n\s*(?=<)

\n ]+>([^<]+)
//replace end of sentence with ...
(?<=\.)(?<=\))?\s
//copy option value to option
(?<=")(.+)">
$1">$1
//add trailing slash to root directories
(?<="../c\d)(?!\/)

-->
