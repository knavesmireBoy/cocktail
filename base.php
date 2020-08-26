<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Footer</title>
    <style>
        body {
            color: white;
            font-style: italic;
            font: 1em/1.2 Cochin, serif;
            background: black;
        }
        em {color: gold}
        h2 {text-align: center;}
    </style>

</head>
<body id="result">
<?php
if (isset($_POST['action']) and $_POST['action'] == 'go') {
    ?>
    <h2><em>Your Favourite Cocktail is...</em></h2>
    <?php
    $res = $_POST;
    function inc($arg)
    {
        return $arg AND ($arg != 'Submit' AND $arg != 'on' AND $arg != 'go');
    }

    function rep($arg)
    {
        return str_replace('_', ' ', $arg);
    }

    foreach ($res as $k => $v) {
        $k = ucfirst($k);
        $v = rep($v);
        if (inc($v)) {
            print "<p><em> $k: </em>$v </p>";
        }
    }
}
else {
    //header('Location: index.html');
}
?>
</body>
</html>