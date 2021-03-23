<?php
$unit;

function open($str)
{
    return "<tr><td>$str</td>";
}

function concat($b)
{
    return function ($a) use ($b)
    {
        return $a . $b;
    };
}

function concat_curry($b)
{
    return function ($a) use ($b)
    {
        return $b . $a;
    };
}

function close($n)
{
    return "<td>$n</td></tr>";
}

function colspanHead($v)
{
    $str = "<h3>Bartender! Get me a <span>$v<span>!</h3><section><section><table><tr><th colspan='2'>RECIPE</th></tr>";
    print !empty($v) ? $str : "<h3>Bartender!</h3><section><section><table><tr><th colspan='2'>RECIPE</th></tr>";
}

function colspan($v, $k)
{
    if ($k === 'cocktail')
    {
        colspanHead($v);
    }
    else
    {
        //print "<tr><td colspan='2' class='method'>Method: </td></tr><tr><td colspan='2'>$v</td></tr>";
        print "<tr><td colspan='2' class='method'>$v</td></tr>";
    }
}

function output($o)
{
    return function ($c) use ($o)
    {
        print open($o) . close($c);
    };
}

function inc($arg)
{
    $list = array(
        'reset',
        'submit',
        'go',
        'x',
        'y'
    );
  return !empty($arg) && !in_array($arg, $list);
 // return !empty($arg);
}

function isUnit($arg){
    return $arg === 'unit';
}

if (isset($_POST['action']) and $_POST['action'] == 'go')
{
?>
<div id="response">
        <aside><img src="img/cocktail_book.jpg"></aside>
            <p>Sometime in 1997 a friend, recently returned from Cuba, dropped by, told of his travels and raved about the cocktails imbibed at the famous “La Floradita” bar in Havana. The search term ‘Floridita’ led us to a great little site hosted at www.hotwired.com/cocktail. Classic cocktails were beginning to enjoy something of a <a href="https://www.berkeleyside.com/2017/09/15/west-coast-cocktail-revival-started-emeryville-thanks-man">renaissance</a>, not least due to the efforts of<a href="http://frodelius.com/goodspiritsnews/paulharrington.html"> Paul Harrington</a>, who had penned a series of articles for hotwired and was practising what he preached at the <a href="https://www.townhouseemeryville.com">Townhouse Bar &#38; Grill</a> in Emeryville, CA.</p><p>There was enough material to justify the publication of a companion book <a href="https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2" title="by Paul Harrington and Laura Moorhead. Illustrations by Douglas Bowman.">“Cocktail”</a> which appeared the following year. The hardcover book is a treasure trove and truly deserved better than being pawed over in the kitchen at party time. A bar-friendly digest was in order. Inspired by the wonderful <a href="https://dribbble.com/shots/18495-Frisco">illustrations</a> in “Cocktail”, I got to down to some weekend photoshopping, sneaked in a cheeky print run and produced a comb-bound booklet, or three, of, chiefly, classic cocktail recipes.</p><p>When I enrolled in a web design refresher course many years later I decided to re-purpose the booklet as my chosen personal project. By this time the original hotwired site was long gone, but an archive of sorts was maintained by enthusiasts at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. I was able to grab some copy and complete my project.</p><p>Several years on from that project I discovered the Chanticleer archive was no longer to be found. Shame. However, all is not lost. Quoted searches from passages of the book will still fetch up Harrington’s original copy in various sites, often uncredited. There are a few discrepancies between the web articles and the printed version so the text on this site is a facsimile of the published book. My copy did survive, it is pictured left. You can still pick up a <a href= "https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2--">copy</a> on Amazon, albeit for the price of a very good single malt. I do aspire to get the thing into a database at some point, although it may very well drive me to drink. Speaking of which...
            </p>              
    <?php
    /*We present the result in a table so first have to hang-on to the VALUE of the ingredient, store in a closure and on the next pass invoke the table row with the VALUE of the measure. This in itself is a composite of number and unit, two more closures.
    The design of the form has the unit choice (oz/ml) coming AFTER the base spirit but BEFORE the other ingredients
    so we hang on to the ingredient name in $curry and then add the value of the unit on the next pass. The value of this (oz/ml) is set for the remaining ingredients.
    */
    $res = $_POST;
    $output = NULL;
    $partial = NULL;
    $curry = NULL;

    foreach ($_POST as $k => $v)
    {
        $v = str_replace('_', ' ', $v);
        if ($k === 'cocktail')
        {
            colspan($v, $k);
            continue;
        }
        if (isUnit($k))
        {
            $partial = concat($v);
            if (isset($curry) && isset($output))
            {
                $output($curry($v));
                $output = NULL;
            }
            continue;
        }

        if (inc($v) && inc($k))
        {
            if ($k === 'prep')
            {
                colspan($v, $k);
            }
            /* BIT clunky AJAX passing "on" checkbox value regardless of checked status. Setting string to false/true in ajax.js line 68 as tmp solution */
             elseif($k === 'dash' && $v !== 'false'){
                output('dash')('bitters');
                $output = NULL;
            }
            
            elseif (isset($output))
            {
                if (!isset($curry))
                {
                    $curry = concat_curry($v);
                    continue;
                }
                $v = isset($partial) ? $partial($v) : $v;
                $output($v);
                $output = NULL;
            }
            else
            {
                $output = output($v);
            }
        } //!empty        
    } //foreach
    echo '</table></section><a><img src="img/cbook.jpg"></a></section><div class="esquire"><a href="https://www.amazon.co.uk/Esquire-Drinks-Opinionated-Irreverent-Drinking/dp/1588162052"><img src="img/esquire.jpg"></a></div><p>I should point out that the “RULES” are taken from another marvellous book by a more establshed writer on the subject.</p></div>';
} //isset
else
{ ?>
    <div>
        <div class="placeholder"><img src="img/fc.jpg" id="base"/></div>
        <section id="controls" class="static">
            <button id="backbutton"></button>
            <button id="playbutton"></button>
            <button id="forwardbutton"></button>
        </section>
            </div>
<div id="response">
      <form  action="." method="post">
        <fieldset><legend>or  mix your own...</legend></fieldset>
        <ul>
            <li><label for="cocktail">Name</label><input type="text" name="cocktail" id="cocktail" placeholder="Quarantini">
            <li id="reset"><input type="reset" name="reset" value="X" title="Reset the form"></li>
            <li><label for="spirit">Base Spirit</label><select name="spirit" id="spirit">
                <option value="">Your poison...</option>
                <option value="Gin">Gin</option>
                <option value="Vodka">Vodka</option>
                <option value="Tequila">Tequila</option>
                <option value="Light_Rum">Light Rum</option>
                <option value="Dark_Rum">Dark Rum</option>
                <option value="Rye">Rye</option>
                <option value="Bourbon">Bourbon</option>
                <option value="Scotch">Scotch</option>
                <option value="Brandy">Brandy</option>
            </select></li>
            <li><label for="m1">Measure</label><input type="number" step=".25" name="m1" id="m1"></li>
            <li class="unit"><label>Units:</label><label for="oz" title="Specify all measures in ounces">oz</label><input type="radio" name="unit" id="oz" value="oz"><label for="ml" title="Specify all measures in milliliters">ml</label><input type="radio" name="unit" id="ml" value="ml" checked></li>
        </ul>
        <fieldset class="ingredients"><legend><b><em>Further Ingredients</em></b></legend>
            <ul> <li><label for="i2">Second</label><input type="text" name="second" id="i2"></li><li><label for="m2">Measure</label><input type="number" step="any" name="m2" id="m2"></li>
                <li><label for="i3">Third</label><input type="text" name="third"  id="i3"></li><li><label for="m3">Measure</label><input type="number" step="any" name="m3" id="m3"></li>
                <li><label for="i4">Fourth</label><input type="text" name="fourth" id="i4"></li><li><label for="m4">Measure</label><input type="number" step="any" name="m4" id="m4"></li>
            </ul></fieldset>
        <ul>
            <li><label for="dash">Add Bitters:</label><input type="checkbox" name="dash" id="dash"></li></ul>
      <ul><li><label for="prep">Preparation:</label><textarea id="prep" maxlength="400" placeholder="To prepare: first off, plenty of ice!" cols="30" rows="5" name="prep"></textarea></li></ul>
        <!--<ul><li><label for="email">Email:</label><input type="email" name="email" id="email" ></li></ul>-->
<!--required aria-required ="true" -->
        <ul><li><input type="hidden" name="action" value="go">
            <label><input type="submit">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.5 113.5">
    <defs>
        <filter id="shadow">
            <feDropShadow dx="2" dy="2" flood-color="black" flood-opacity="0.5" stdDeviation="3"/>
        </filter>
        <clipPath id="mepath">
            <ellipse cx="70.648" cy="56.611" rx="69.655" ry="55.198"/>
        </clipPath>
        <clipPath id="stroke">
            <path d="M22.277,68.695c-0.146,1.092-0.182,1.639-0.583,1.639c-0.218,0-0.364-0.146-0.364-0.51c0-0.51,0.364-2.368,0.364-5.573
		c0-3.314-0.218-5.062-0.218-5.317c0-0.364,0.109-0.583,0.328-0.583c0.255,0,0.401,0.255,0.474,0.802l0.328,2.586
		c2.513,2.914,5.864,4.443,9.543,4.443c3.824,0,5.9-1.529,5.9-3.86c0-3.133-2.659-3.861-7.904-4.809
		c-2.549-0.437-4.698-0.728-6.337-2.222c-1.42-1.274-2.186-3.096-2.186-5.354c0-5.099,3.497-8.377,9.251-8.377
		c2.294,0,4.589,0.51,6.92,1.42l0.328-1.493c0.219-1.093,0.292-1.639,0.656-1.639c0.218,0,0.328,0.182,0.328,0.51
		c0,0.292-0.583,2.659-0.583,7.758c0,0.4,0.073,0.837,0.073,1.202c0,0.437-0.109,0.656-0.328,0.656
		c-0.328,0-0.438-0.292-0.474-0.838l-0.182-2.003c-2.258-2.186-5.208-3.314-8.56-3.314c-3.751,0-6.046,1.821-6.046,4.225
		c0,0.983,0.4,1.858,1.129,2.44c1.749,1.384,4.371,1.384,7.758,1.931c4.99,0.801,7.576,3.46,7.576,7.648
		c0,5.281-3.606,8.523-9.798,8.523c-2.185,0-4.625-0.547-7.139-1.712L22.277,68.695z M42.42,56.712H41c-1.312,0-1.894,0-1.894-0.437
		c0-0.438,0.546-0.365,1.603-0.511c3.132-0.474,4.735-1.311,5.172-1.311s0.474,0.073,0.474,0.509v7.795
		c0,2.695,0.182,3.824,2.294,3.824c1.566,0,2.95-0.474,4.517-1.42v-5.5c0-0.983-0.037-1.967-0.219-2.95h-1.42
		c-1.311,0-1.894,0-1.894-0.437c0-0.438,0.546-0.365,1.603-0.511c3.132-0.474,4.735-1.311,5.172-1.311s0.474,0.073,0.474,0.509
		v7.868c0,0.291,0,0.582,0,0.91c0,1.02,0.036,2.04,0.218,3.096c1.894,0.328,2.805,0.547,2.805,0.947
		c0,0.255-0.146,0.328-0.546,0.328c-0.546,0-1.821-0.219-3.751-0.219c-0.692,0-1.494,0.036-2.44,0.109v-1.821
		c-3.242,1.53-5.609,2.222-6.993,2.222c-2.987,0-3.533-1.529-3.533-4.662v-4.079C42.638,58.679,42.602,57.695,42.42,56.712z
		 M62.052,67.857c-1.93,0-3.168,0.255-3.715,0.255c-0.401,0-0.583-0.109-0.583-0.364c0-0.4,0.911-0.583,2.805-0.947
		c0.182-1.057,0.219-2.112,0.219-3.132c0-0.328,0-0.619,0-0.911V45.093c0-0.364,0-0.692,0-1.02c0-3.46-0.073-4.771-1.494-4.771
		c-0.619,0-1.129,0.146-1.457,0.146c-0.146,0-0.255-0.109-0.255-0.328c0-0.437,0.765-0.474,2.003-0.838
		c2.586-0.729,4.043-1.457,4.625-1.457c0.219,0,0.255,0.146,0.255,0.51c0,0.109,0,0.218,0,0.328v19.414
		c2.04-1.603,3.824-2.44,5.718-2.44c3.278,0,5.463,2.294,5.463,6.046c0,4.662-2.805,7.722-6.666,7.722
		c-1.675,0-3.242-0.583-4.662-1.676v1.239C63.436,67.894,62.708,67.857,62.052,67.857z M64.492,65.636
		c1.312,1.201,2.477,1.82,3.497,1.82c2.186,0,3.788-2.148,3.788-5.863c0-3.314-1.42-5.173-3.679-5.173
		c-1.202,0-2.368,0.619-3.606,1.821V65.636z M81.538,62.831c0,0.291,0,0.582,0,0.91c0,1.02,0.037,2.04,0.219,3.096
		c1.348,0.364,2.004,0.619,2.004,0.947c0,0.255-0.183,0.328-0.583,0.328c-0.438,0-1.748-0.219-3.897-0.219
		c-2.112,0-3.46,0.219-3.934,0.219c-0.401,0-0.547-0.073-0.547-0.328c0-0.4,0.911-0.619,2.805-0.947
		c0.183-1.056,0.219-2.076,0.219-3.096c0-0.328,0-0.619,0-0.91v-3.169c0-0.983-0.036-1.967-0.219-2.95h-1.42
		c-1.312,0-1.895,0-1.895-0.437c0-0.438,0.547-0.365,1.603-0.511c3.133-0.474,4.735-1.311,5.173-1.311
		c0.437,0,0.473,0.073,0.473,0.509v1.895c3.06-1.42,5.282-2.222,6.702-2.222c1.785,0,2.986,0.838,3.278,2.331
		c3.169-1.529,5.391-2.331,6.774-2.331c2.914,0,3.46,1.565,3.46,4.698v3.497c0,1.348,0,2.658,0.255,4.006
		c1.895,0.328,2.805,0.547,2.805,0.947c0,0.255-0.182,0.328-0.583,0.328c-0.473,0-1.784-0.219-3.896-0.219
		c-2.149,0-3.461,0.219-3.897,0.219c-0.4,0-0.583-0.073-0.583-0.328c0-0.328,0.655-0.583,1.967-0.947
		c0.255-1.348,0.255-2.658,0.255-4.006v-2.55c0-2.622-0.219-3.824-2.222-3.824c-1.238,0-2.586,0.51-4.188,1.457v4.917
		c0,0.291,0,0.582,0,0.91c0,1.02,0.036,2.04,0.219,3.096c1.348,0.364,2.003,0.619,2.003,0.947c0,0.255-0.182,0.328-0.583,0.328
		c-0.582,0-1.748-0.219-3.496-0.219s-2.95,0.219-3.497,0.219c-0.4,0-0.582-0.073-0.582-0.328c0-0.328,0.691-0.583,2.003-0.947
		c0.182-1.056,0.219-2.076,0.219-3.096c0-0.328,0-0.619,0-0.91v-2.55c0-2.622-0.219-3.824-2.222-3.824
		c-1.239,0-2.586,0.51-4.189,1.457V62.831z M109.803,63.741c0,1.02,0.037,2.04,0.219,3.096c1.895,0.328,2.805,0.547,2.805,0.947
		c0,0.255-0.146,0.328-0.546,0.328c-0.292,0-1.749-0.219-4.335-0.219s-4.043,0.219-4.334,0.219c-0.4,0-0.546-0.073-0.546-0.328
		c0-0.4,0.91-0.619,2.804-0.947c0.183-1.056,0.219-2.076,0.219-3.096c0-0.328,0-0.619,0-0.91v-3.169c0-0.983-0.036-1.967-0.219-2.95
		h-1.42c-1.312,0-1.895,0-1.895-0.437c0-0.438,0.547-0.365,1.603-0.511c3.133-0.474,4.735-1.311,5.173-1.311
		c0.437,0,0.473,0.073,0.473,0.509v7.868C109.803,63.122,109.803,63.413,109.803,63.741z M107.581,45.457
		c1.202,0,2.222,1.056,2.222,2.258c0,1.275-0.983,2.294-2.222,2.294s-2.258-1.02-2.258-2.294
		C105.323,46.513,106.38,45.457,107.581,45.457z M111.115,56.42v-1.492c0.801,0.108,1.639,0.145,2.622,0.218l0.109-5.463
		c1.129-0.692,2.367-1.457,3.751-2.258l-0.109,7.722h2.04c0.328,0,1.166-0.036,2.514-0.218v1.492
		c-1.421-0.182-2.259-0.254-2.514-0.254h-2.076l-0.072,5.718c0,0.182,0,0.328,0,0.474c0,2.695,0.327,3.934,2.112,3.934
		c1.529,0,2.513-1.129,2.986-1.129c0.255,0,0.4,0.109,0.4,0.327c0,0.802-2.804,2.914-5.682,2.914c-2.914,0-3.569-1.566-3.569-4.917
		c0-0.182,0-0.4,0-0.583l0.109-6.737C112.79,56.238,111.916,56.311,111.115,56.42z"/>
        </clipPath>
    </defs>
    <g>
        <g clip-path="url(#mepath)">
            <image  width="774" height="734" id="button" xlink:href="button.jpg"  transform="matrix(0.2162 0 0 0.2162 -11.7319 -26.0098)">
            </image>
        </g>
        <g>
            <g clip-path="url(#stroke)">
                <image  width="774" height="734" id="button" xlink:href="button2.jpg"  transform="matrix(0.2162 0 0 0.2162 -11.7319 -26.0098)">
                </image>
            </g>
        </g>
    </g>
                </svg></label>
            <input id="lemon" type="image" src="img/button.png" alt="Submit" value="Submit"/>
            <!--<input type="submit" name="submit" value="Submit">--></li></ul>
        </form></div>
<?php
}