---
layout: default_blog
title: "Portfolio Moving Average Optimization"
date: 2015-04-04
---


<br>
<br>


<html>
<head>

<meta charset="utf-8" />
<title>Moving Average Optimization (Brute Force)</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>



<!-- Custom stylesheet, it must be in the same directory as the html file -->
<!-- <link rel="stylesheet" href="custom.css"> -->

<!-- Loading mathjax macro -->
<!-- Load mathjax -->
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
    <!-- MathJax configuration -->
    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        tex2jax: {
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            processEscapes: true,
            processEnvironments: true
        },
        // Center justify equations in code and markdown cells. Elsewhere
        // we use CSS to left justify single line equations in code cells.
        displayAlign: 'center',
        "HTML-CSS": {
            styles: {'.MathJax_Display': {"margin": 0}},
            linebreaks: { automatic: true }
        }
    });
    </script>
    <!-- End of mathjax configuration -->

</head>
<body>
  <div tabindex="-1" id="notebook" class="border-box-sizing">
    <div class="container" id="notebook-container">

<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<h1 id="moving-average-n-analysis">Moving Average N Analysis</h1>
<p><br></p>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[2]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># IMPORTS</span>
<span class="kn">from</span> <span class="nn">pandas.io.data</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">pandas</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">pandas.tools.plotting</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">import</span> <span class="nn">matplotlib.pyplot</span> <span class="kn">as</span> <span class="nn">plt</span>
<span class="kn">import</span> <span class="nn">plotly.plotly</span> <span class="kn">as</span> <span class="nn">py</span>
<span class="kn">from</span> <span class="nn">plotly.graph_objs</span> <span class="kn">import</span> <span class="o">*</span>
<span class="kn">from</span> <span class="nn">scipy</span> <span class="kn">import</span> <span class="n">stats</span>
<span class="kn">import</span> <span class="nn">math</span>

<span class="kn">import</span> <span class="nn">io</span><span class="o">,</span> <span class="nn">os</span><span class="o">,</span> <span class="nn">sys</span><span class="o">,</span> <span class="nn">types</span>
<span class="kn">from</span> <span class="nn">IPython.nbformat</span> <span class="kn">import</span> <span class="n">current</span>
<span class="kn">from</span> <span class="nn">IPython.core.interactiveshell</span> <span class="kn">import</span> <span class="n">InteractiveShell</span>

<span class="o">%</span><span class="k">run</span> <span class="n">Portfolio_Moving_Averages_Functions</span><span class="o">-</span><span class="n">Old</span><span class="o">.</span><span class="n">ipynb</span>

<span class="o">%</span><span class="k">matplotlib</span> <span class="n">inline</span>
<span class="n">plt</span><span class="o">.</span><span class="n">rcParams</span><span class="p">[</span><span class="s">&#39;figure.figsize&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="mi">16</span><span class="p">,</span> <span class="mi">12</span>  <span class="c"># that&#39;s default image size for this </span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br><br></p>
<h1 id="crossover-analysis">Crossover Analysis</h1>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[3]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">symbols</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VXX&#39;</span><span class="p">,</span> <span class="s">&#39;SSO&#39;</span><span class="p">,</span> <span class="s">&#39;SDS&#39;</span><span class="p">]</span>
<span class="n">VXX</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;VXX&#39;</span><span class="p">]</span> <span class="c"># volatility index</span>
<span class="n">SSO</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SSO&#39;</span><span class="p">]</span> <span class="c"># 2x bull run s&amp;p</span>
<span class="n">SDS</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SDS&#39;</span><span class="p">]</span> <span class="c"># 2x bear (inv) run s&amp;p</span>

<span class="n">SPX</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;SPX&#39;</span><span class="p">]</span>     <span class="c"># s&amp;p real index</span>

<span class="n">GSPC</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;^GSPC&#39;</span><span class="p">]</span>  <span class="c"># s&amp;p index</span>
<span class="n">IXIC</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;^IXIC&#39;</span><span class="p">]</span>  <span class="c"># nasdaq composite </span>
<span class="n">DJI</span> <span class="o">=</span> <span class="p">[</span><span class="s">&#39;DJIA&#39;</span><span class="p">]</span>    <span class="c"># dow jones industrial avg</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[58]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="k">def</span> <span class="nf">crossover_brute_force_analysis</span><span class="p">(</span><span class="n">curTicker</span><span class="p">):</span>

    <span class="c"># setup dictionary for comparison purposes</span>
    <span class="n">all_runs</span> <span class="o">=</span> <span class="p">{}</span>

    <span class="c"># create list of window combinations to test for best performance</span>
    <span class="n">short_window</span> <span class="o">=</span> <span class="p">[</span><span class="mi">10</span><span class="p">,</span> <span class="mi">15</span><span class="p">,</span> <span class="mi">20</span><span class="p">,</span> <span class="mi">30</span><span class="p">,</span> <span class="mi">40</span><span class="p">,</span> <span class="mi">50</span><span class="p">,</span> <span class="mi">60</span><span class="p">,</span> <span class="mi">80</span><span class="p">,</span> <span class="mi">100</span><span class="p">]</span>
    <span class="n">long_window</span> <span class="o">=</span> <span class="p">[</span><span class="mi">30</span><span class="p">,</span> <span class="mi">50</span><span class="p">,</span> <span class="mi">75</span><span class="p">,</span> <span class="mi">125</span><span class="p">,</span> <span class="mi">200</span><span class="p">,</span> <span class="mi">250</span><span class="p">,</span> <span class="mi">300</span><span class="p">]</span>


    <span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="n">short_window</span><span class="p">:</span>

        <span class="k">for</span> <span class="n">j</span> <span class="ow">in</span> <span class="n">long_window</span><span class="p">:</span>

            <span class="c"># check to make sure the short window is less than the long window</span>
            <span class="k">if</span> <span class="n">i</span> <span class="o">&lt;</span> <span class="n">j</span><span class="p">:</span>

                <span class="c"># save the windows for later analysis</span>
                <span class="n">N</span> <span class="o">=</span> <span class="p">[</span><span class="n">i</span><span class="p">,</span><span class="n">j</span><span class="p">]</span>

                <span class="c"># initialize dictionary for entry</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)]</span> <span class="o">=</span> <span class="p">{}</span>

                <span class="c"># calculate results</span>
                <span class="n">stockDF</span><span class="p">,</span> <span class="n">tkrInfo</span><span class="p">,</span> <span class="n">plot_data</span> <span class="o">=</span> <span class="n">crossover_calculation</span><span class="p">(</span><span class="n">curTicker</span><span class="p">,</span> <span class="n">N</span><span class="o">=</span><span class="p">[</span><span class="n">i</span><span class="p">,</span><span class="n">j</span><span class="p">])</span>

                <span class="c"># store results for later analysis</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;basic&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="n">tkrInfo</span><span class="p">[</span><span class="n">curTicker</span><span class="p">[</span><span class="mi">0</span><span class="p">]][</span><span class="s">&#39;fvb&#39;</span><span class="p">]</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;crossover&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="n">tkrInfo</span><span class="p">[</span><span class="n">curTicker</span><span class="p">[</span><span class="mi">0</span><span class="p">]][</span><span class="s">&#39;fva&#39;</span><span class="p">]</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;net_result&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;crossover&#39;</span><span class="p">]</span> <span class="o">-</span> <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;basic&#39;</span><span class="p">]</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;N&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="p">[</span><span class="n">i</span><span class="p">,</span><span class="n">j</span><span class="p">]</span>
                <span class="n">all_runs</span><span class="p">[</span><span class="nb">str</span><span class="p">(</span><span class="n">N</span><span class="p">)][</span><span class="s">&#39;ticker&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="n">curTicker</span>

                
    <span class="k">return</span> <span class="n">all_runs</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h2 id="analyze-with-each-index-">Analyze With Each Index:</h2>
<p><br></p>
<h3 id="gspc-s-p-">GSPC (S&amp;P)</h3>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[59]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">gspc_runs</span> <span class="o">=</span> <span class="n">crossover_brute_force_analysis</span><span class="p">(</span><span class="n">GSPC</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-01-25 00:00:00
Account Value: 10000
    Buy Price: 1357.51
    Num Shares: 7.0
    Remaining Value: 497.43
Sell Date: 
2001-02-16 00:00:00
    Sell Price: 1301.53
    Updated Value: 9608.14

-------------------------

Buy Date: 
2001-04-19 00:00:00
Account Value: 9608.14
    Buy Price: 1253.69
    Num Shares: 7.0
    Remaining Value: 832.31
Sell Date: 
2001-06-08 00:00:00
    Sell Price: 1264.96
    Updated Value: 9687.03

-------------------------

Buy Date: 
2001-08-13 00:00:00
Account Value: 9687.03
    Buy Price: 1191.29
    Num Shares: 8.0
    Remaining Value: 156.71
Sell Date: 
2001-08-15 00:00:00
    Sell Price: 1178.02
    Updated Value: 9580.87

-------------------------

Buy Date: 
2001-10-16 00:00:00
Account Value: 9580.87
    Buy Price: 1097.54
    Num Shares: 8.0
    Remaining Value: 800.55
Sell Date: 
2001-12-20 00:00:00
    Sell Price: 1139.93
    Updated Value: 9919.99

-------------------------

Buy Date: 
2001-12-31 00:00:00
Account Value: 9919.99
    Buy Price: 1148.08
    Num Shares: 8.0
    Remaining Value: 735.35
Sell Date: 
2002-01-23 00:00:00
    Sell Price: 1128.18
    Updated Value: 9760.79

-------------------------

Buy Date: 
2002-03-06 00:00:00
Account Value: 9760.79
    Buy Price: 1162.77
    Num Shares: 8.0
    Remaining Value: 458.63
Sell Date: 
2002-04-05 00:00:00
    Sell Price: 1122.73
    Updated Value: 9440.47

-------------------------

Buy Date: 
2002-05-28 00:00:00
Account Value: 9440.47
    Buy Price: 1074.55
    Num Shares: 8.0
    Remaining Value: 844.07
Sell Date: 
2002-06-03 00:00:00
    Sell Price: 1040.68
    Updated Value: 9169.51

-------------------------

Buy Date: 
2002-08-19 00:00:00
Account Value: 9169.51
    Buy Price: 950.7
    Num Shares: 9.0
    Remaining Value: 613.21
Sell Date: 
2002-09-11 00:00:00
    Sell Price: 909.45
    Updated Value: 8798.26

-------------------------

Buy Date: 
2002-10-23 00:00:00
Account Value: 8798.26
    Buy Price: 896.14
    Num Shares: 9.0
    Remaining Value: 733.0
Sell Date: 
2002-12-16 00:00:00
    Sell Price: 910.4
    Updated Value: 8926.6

-------------------------

Buy Date: 
2003-01-13 00:00:00
Account Value: 8926.6
    Buy Price: 926.26
    Num Shares: 9.0
    Remaining Value: 590.26
Sell Date: 
2003-01-28 00:00:00
    Sell Price: 858.54
    Updated Value: 8317.12

-------------------------

Buy Date: 
2003-03-21 00:00:00
Account Value: 8317.12
    Buy Price: 895.79
    Num Shares: 9.0
    Remaining Value: 255.01
Sell Date: 
2003-07-23 00:00:00
    Sell Price: 988.61
    Updated Value: 9152.5

-------------------------

Buy Date: 
2003-07-24 00:00:00
Account Value: 9152.5
    Buy Price: 981.6
    Num Shares: 9.0
    Remaining Value: 318.1
Sell Date: 
2003-07-25 00:00:00
    Sell Price: 998.68
    Updated Value: 9306.22

-------------------------

Buy Date: 
2003-08-04 00:00:00
Account Value: 9306.22
    Buy Price: 982.82
    Num Shares: 9.0
    Remaining Value: 460.84
Sell Date: 
2003-08-05 00:00:00
    Sell Price: 965.46
    Updated Value: 9149.98

-------------------------

Buy Date: 
2003-08-21 00:00:00
Account Value: 9149.98
    Buy Price: 1003.27
    Num Shares: 9.0
    Remaining Value: 120.55
Sell Date: 
2003-10-03 00:00:00
    Sell Price: 1029.85
    Updated Value: 9389.2

-------------------------

Buy Date: 
2003-10-13 00:00:00
Account Value: 9389.2
    Buy Price: 1045.35
    Num Shares: 8.0
    Remaining Value: 1026.4
Sell Date: 
2003-11-28 00:00:00
    Sell Price: 1058.2
    Updated Value: 9492.0

-------------------------

Buy Date: 
2003-12-02 00:00:00
Account Value: 9492.0
    Buy Price: 1066.62
    Num Shares: 8.0
    Remaining Value: 959.04
Sell Date: 
2004-03-15 00:00:00
    Sell Price: 1104.49
    Updated Value: 9794.96

-------------------------

Buy Date: 
2004-04-12 00:00:00
Account Value: 9794.96
    Buy Price: 1145.2
    Num Shares: 8.0
    Remaining Value: 633.36
Sell Date: 
2004-05-06 00:00:00
    Sell Price: 1113.99
    Updated Value: 9545.28

-------------------------

Buy Date: 
2004-06-04 00:00:00
Account Value: 9545.28
    Buy Price: 1122.5
    Num Shares: 8.0
    Remaining Value: 565.28
Sell Date: 
2004-07-12 00:00:00
    Sell Price: 1114.35
    Updated Value: 9480.08

-------------------------

Buy Date: 
2004-08-27 00:00:00
Account Value: 9480.08
    Buy Price: 1107.77
    Num Shares: 8.0
    Remaining Value: 617.92
Sell Date: 
2004-10-20 00:00:00
    Sell Price: 1103.66
    Updated Value: 9447.2

-------------------------

Buy Date: 
2004-11-04 00:00:00
Account Value: 9447.2
    Buy Price: 1161.67
    Num Shares: 8.0
    Remaining Value: 153.84
Sell Date: 
2005-01-13 00:00:00
    Sell Price: 1177.45
    Updated Value: 9573.44

-------------------------

Buy Date: 
2005-02-10 00:00:00
Account Value: 9573.44
    Buy Price: 1197.01
    Num Shares: 7.0
    Remaining Value: 1194.37
Sell Date: 
2005-03-21 00:00:00
    Sell Price: 1183.78
    Updated Value: 9480.83

-------------------------

Buy Date: 
2005-05-13 00:00:00
Account Value: 9480.83
    Buy Price: 1154.05
    Num Shares: 8.0
    Remaining Value: 248.43
Sell Date: 
2005-07-06 00:00:00
    Sell Price: 1194.94
    Updated Value: 9807.95

-------------------------

Buy Date: 
2005-07-14 00:00:00
Account Value: 9807.95
    Buy Price: 1226.5
    Num Shares: 7.0
    Remaining Value: 1222.45
Sell Date: 
2005-08-18 00:00:00
    Sell Price: 1219.02
    Updated Value: 9755.59

-------------------------

Buy Date: 
2005-09-14 00:00:00
Account Value: 9755.59
    Buy Price: 1227.16
    Num Shares: 7.0
    Remaining Value: 1165.47
Sell Date: 
2005-09-30 00:00:00
    Sell Price: 1228.81
    Updated Value: 9767.14

-------------------------

Buy Date: 
2005-11-07 00:00:00
Account Value: 9767.14
    Buy Price: 1222.81
    Num Shares: 7.0
    Remaining Value: 1207.47
Sell Date: 
2006-02-02 00:00:00
    Sell Price: 1270.84
    Updated Value: 10103.35

-------------------------

Buy Date: 
2006-02-03 00:00:00
Account Value: 10103.35
    Buy Price: 1264.03
    Num Shares: 7.0
    Remaining Value: 1255.14
Sell Date: 
2006-02-10 00:00:00
    Sell Price: 1266.99
    Updated Value: 10124.07

-------------------------

Buy Date: 
2006-02-24 00:00:00
Account Value: 10124.07
    Buy Price: 1289.43
    Num Shares: 7.0
    Remaining Value: 1098.06
Sell Date: 
2006-04-20 00:00:00
    Sell Price: 1311.46
    Updated Value: 10278.28

-------------------------

Buy Date: 
2006-04-27 00:00:00
Account Value: 10278.28
    Buy Price: 1309.72
    Num Shares: 7.0
    Remaining Value: 1110.24
Sell Date: 
2006-05-22 00:00:00
    Sell Price: 1262.07
    Updated Value: 9944.73

-------------------------

Buy Date: 
2006-07-10 00:00:00
Account Value: 9944.73
    Buy Price: 1267.34
    Num Shares: 7.0
    Remaining Value: 1073.35
Sell Date: 
2006-07-24 00:00:00
    Sell Price: 1260.91
    Updated Value: 9899.72

-------------------------

Buy Date: 
2006-07-31 00:00:00
Account Value: 9899.72
    Buy Price: 1276.66
    Num Shares: 7.0
    Remaining Value: 963.1
Sell Date: 
2007-03-05 00:00:00
    Sell Price: 1374.12
    Updated Value: 10581.94

-------------------------

Buy Date: 
2007-03-30 00:00:00
Account Value: 10581.94
    Buy Price: 1420.86
    Num Shares: 7.0
    Remaining Value: 635.92
Sell Date: 
2007-06-18 00:00:00
    Sell Price: 1531.05
    Updated Value: 11353.27

-------------------------

Buy Date: 
2007-06-26 00:00:00
Account Value: 11353.27
    Buy Price: 1492.89
    Num Shares: 7.0
    Remaining Value: 903.04
Sell Date: 
2007-06-28 00:00:00
    Sell Price: 1505.71
    Updated Value: 11443.01

-------------------------

Buy Date: 
2007-07-12 00:00:00
Account Value: 11443.01
    Buy Price: 1547.7
    Num Shares: 7.0
    Remaining Value: 609.11
Sell Date: 
2007-08-01 00:00:00
    Sell Price: 1465.81
    Updated Value: 10869.78

-------------------------

Buy Date: 
2007-09-05 00:00:00
Account Value: 10869.78
    Buy Price: 1472.29
    Num Shares: 7.0
    Remaining Value: 563.75
Sell Date: 
2007-10-26 00:00:00
    Sell Price: 1535.28
    Updated Value: 11310.71

-------------------------

Buy Date: 
2007-12-11 00:00:00
Account Value: 11310.71
    Buy Price: 1477.65
    Num Shares: 7.0
    Remaining Value: 967.16
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 1390.19
    Updated Value: 10698.49

-------------------------

Buy Date: 
2008-02-26 00:00:00
Account Value: 10698.49
    Buy Price: 1381.29
    Num Shares: 7.0
    Remaining Value: 1029.46
Sell Date: 
2008-03-07 00:00:00
    Sell Price: 1293.37
    Updated Value: 10083.05

-------------------------

Buy Date: 
2008-04-03 00:00:00
Account Value: 10083.05
    Buy Price: 1369.31
    Num Shares: 7.0
    Remaining Value: 497.88
Sell Date: 
2008-06-03 00:00:00
    Sell Price: 1377.65
    Updated Value: 10141.43

-------------------------

Buy Date: 
2008-08-07 00:00:00
Account Value: 10141.43
    Buy Price: 1266.07
    Num Shares: 8.0
    Remaining Value: 12.87
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 1267.79
    Updated Value: 10155.19

-------------------------

Buy Date: 
2008-12-17 00:00:00
Account Value: 10155.19
    Buy Price: 904.42
    Num Shares: 11.0
    Remaining Value: 206.57
Sell Date: 
2009-01-20 00:00:00
    Sell Price: 805.22
    Updated Value: 9063.99

-------------------------

Buy Date: 
2009-03-25 00:00:00
Account Value: 9063.99
    Buy Price: 813.88
    Num Shares: 11.0
    Remaining Value: 111.31
Sell Date: 
2009-06-26 00:00:00
    Sell Price: 918.9
    Updated Value: 10219.21

-------------------------

Buy Date: 
2009-07-23 00:00:00
Account Value: 10219.21
    Buy Price: 976.29
    Num Shares: 10.0
    Remaining Value: 456.31
Sell Date: 
2009-11-05 00:00:00
    Sell Price: 1066.63
    Updated Value: 11122.61

-------------------------

Buy Date: 
2009-11-16 00:00:00
Account Value: 11122.61
    Buy Price: 1109.3
    Num Shares: 10.0
    Remaining Value: 29.61
Sell Date: 
2010-01-29 00:00:00
    Sell Price: 1073.87
    Updated Value: 10768.31

-------------------------

Buy Date: 
2010-03-01 00:00:00
Account Value: 10768.31
    Buy Price: 1115.71
    Num Shares: 9.0
    Remaining Value: 726.92
Sell Date: 
2010-05-07 00:00:00
    Sell Price: 1110.88
    Updated Value: 10724.84

-------------------------

Buy Date: 
2010-06-23 00:00:00
Account Value: 10724.84
    Buy Price: 1092.04
    Num Shares: 9.0
    Remaining Value: 896.48
Sell Date: 
2010-07-02 00:00:00
    Sell Price: 1022.58
    Updated Value: 10099.7

-------------------------

Buy Date: 
2010-07-21 00:00:00
Account Value: 10099.7
    Buy Price: 1069.59
    Num Shares: 9.0
    Remaining Value: 473.39
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 1071.69
    Updated Value: 10118.6

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 10118.6
    Buy Price: 1125.07
    Num Shares: 8.0
    Remaining Value: 1118.04
Sell Date: 
2010-11-29 00:00:00
    Sell Price: 1187.76
    Updated Value: 10620.12

-------------------------

Buy Date: 
2010-12-08 00:00:00
Account Value: 10620.12
    Buy Price: 1228.28
    Num Shares: 8.0
    Remaining Value: 793.88
Sell Date: 
2011-03-14 00:00:00
    Sell Price: 1296.39
    Updated Value: 11165.0

-------------------------

Buy Date: 
2011-04-04 00:00:00
Account Value: 11165.0
    Buy Price: 1332.87
    Num Shares: 8.0
    Remaining Value: 502.04
Sell Date: 
2011-05-25 00:00:00
    Sell Price: 1320.47
    Updated Value: 11065.8

-------------------------

Buy Date: 
2011-07-07 00:00:00
Account Value: 11065.8
    Buy Price: 1353.22
    Num Shares: 8.0
    Remaining Value: 240.04
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 1200.07
    Updated Value: 9840.6

-------------------------

Buy Date: 
2011-09-12 00:00:00
Account Value: 9840.6
    Buy Price: 1162.27
    Num Shares: 8.0
    Remaining Value: 542.44
Sell Date: 
2011-09-30 00:00:00
    Sell Price: 1131.42
    Updated Value: 9593.8

-------------------------

Buy Date: 
2011-10-18 00:00:00
Account Value: 9593.8
    Buy Price: 1225.38
    Num Shares: 7.0
    Remaining Value: 1016.14
Sell Date: 
2011-11-23 00:00:00
    Sell Price: 1161.79
    Updated Value: 9148.67

-------------------------

Buy Date: 
2011-12-12 00:00:00
Account Value: 9148.67
    Buy Price: 1236.47
    Num Shares: 7.0
    Remaining Value: 493.38
Sell Date: 
2012-04-17 00:00:00
    Sell Price: 1390.78
    Updated Value: 10228.84

-------------------------

Buy Date: 
2012-05-08 00:00:00
Account Value: 10228.84
    Buy Price: 1363.72
    Num Shares: 7.0
    Remaining Value: 682.8
Sell Date: 
2012-05-10 00:00:00
    Sell Price: 1357.99
    Updated Value: 10188.73

-------------------------

Buy Date: 
2012-06-20 00:00:00
Account Value: 10188.73
    Buy Price: 1355.69
    Num Shares: 7.0
    Remaining Value: 698.9
Sell Date: 
2012-10-18 00:00:00
    Sell Price: 1457.34
    Updated Value: 10900.28

-------------------------

Buy Date: 
2012-12-05 00:00:00
Account Value: 10900.28
    Buy Price: 1409.28
    Num Shares: 7.0
    Remaining Value: 1035.32
Sell Date: 
2013-06-12 00:00:00
    Sell Price: 1612.52
    Updated Value: 12322.96

-------------------------

Buy Date: 
2013-07-12 00:00:00
Account Value: 12322.96
    Buy Price: 1680.19
    Num Shares: 7.0
    Remaining Value: 561.63
Sell Date: 
2013-08-20 00:00:00
    Sell Price: 1652.35
    Updated Value: 12128.08

-------------------------

Buy Date: 
2013-09-17 00:00:00
Account Value: 12128.08
    Buy Price: 1704.76
    Num Shares: 7.0
    Remaining Value: 194.76
Sell Date: 
2013-10-15 00:00:00
    Sell Price: 1698.06
    Updated Value: 12081.18

-------------------------

Buy Date: 
2013-10-22 00:00:00
Account Value: 12081.18
    Buy Price: 1754.67
    Num Shares: 6.0
    Remaining Value: 1553.16
Sell Date: 
2013-12-24 00:00:00
    Sell Price: 1833.32
    Updated Value: 12553.08

-------------------------

Buy Date: 
2013-12-26 00:00:00
Account Value: 12553.08
    Buy Price: 1842.02
    Num Shares: 6.0
    Remaining Value: 1500.96
Sell Date: 
2014-01-30 00:00:00
    Sell Price: 1794.19
    Updated Value: 12266.1

-------------------------

Buy Date: 
2014-02-21 00:00:00
Account Value: 12266.1
    Buy Price: 1836.25
    Num Shares: 6.0
    Remaining Value: 1248.6
Sell Date: 
2014-04-15 00:00:00
    Sell Price: 1842.98
    Updated Value: 12306.48

-------------------------

Buy Date: 
2014-04-29 00:00:00
Account Value: 12306.48
    Buy Price: 1878.33
    Num Shares: 6.0
    Remaining Value: 1036.5
Sell Date: 
2014-08-05 00:00:00
    Sell Price: 1920.21
    Updated Value: 12557.76

-------------------------

Buy Date: 
2014-08-25 00:00:00
Account Value: 12557.76
    Buy Price: 1997.92
    Num Shares: 6.0
    Remaining Value: 570.24
Sell Date: 
2014-09-30 00:00:00
    Sell Price: 1972.29
    Updated Value: 12403.98

-------------------------

Buy Date: 
2014-10-31 00:00:00
Account Value: 12403.98
    Buy Price: 2018.05
    Num Shares: 6.0
    Remaining Value: 295.68
Sell Date: 
2014-12-17 00:00:00
    Sell Price: 2012.89
    Updated Value: 12373.02

-------------------------

Buy Date: 
2014-12-31 00:00:00
Account Value: 12373.02
    Buy Price: 2058.9
    Num Shares: 6.0
    Remaining Value: 19.62
Sell Date: 
2015-01-13 00:00:00
    Sell Price: 2023.03
    Updated Value: 12157.8

-------------------------

Buy Date: 
2015-02-12 00:00:00
Account Value: 12157.8
    Buy Price: 2088.48
    Num Shares: 5.0
    Remaining Value: 1715.4
Sell Date: 
2015-03-17 00:00:00
    Sell Price: 2074.28
    Updated Value: 12086.8


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 12086.8





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-26 00:00:00
Account Value: 10000
    Buy Price: 1234.52
    Num Shares: 8.0
    Remaining Value: 123.84
Sell Date: 
2001-06-21 00:00:00
    Sell Price: 1237.04
    Updated Value: 10020.16

-------------------------

Buy Date: 
2001-11-06 00:00:00
Account Value: 10020.16
    Buy Price: 1118.86
    Num Shares: 8.0
    Remaining Value: 1069.28
Sell Date: 
2002-01-23 00:00:00
    Sell Price: 1128.18
    Updated Value: 10094.72

-------------------------

Buy Date: 
2002-03-11 00:00:00
Account Value: 10094.72
    Buy Price: 1168.26
    Num Shares: 8.0
    Remaining Value: 748.64
Sell Date: 
2002-04-16 00:00:00
    Sell Price: 1128.37
    Updated Value: 9775.6

-------------------------

Buy Date: 
2002-08-27 00:00:00
Account Value: 9775.6
    Buy Price: 934.82
    Num Shares: 10.0
    Remaining Value: 427.4
Sell Date: 
2002-09-11 00:00:00
    Sell Price: 909.45
    Updated Value: 9521.9

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 9521.9
    Buy Price: 890.23
    Num Shares: 10.0
    Remaining Value: 619.6
Sell Date: 
2002-12-24 00:00:00
    Sell Price: 892.47
    Updated Value: 9544.3

-------------------------

Buy Date: 
2003-01-13 00:00:00
Account Value: 9544.3
    Buy Price: 926.26
    Num Shares: 10.0
    Remaining Value: 281.7
Sell Date: 
2003-01-27 00:00:00
    Sell Price: 847.48
    Updated Value: 8756.5

-------------------------

Buy Date: 
2003-03-26 00:00:00
Account Value: 8756.5
    Buy Price: 869.95
    Num Shares: 10.0
    Remaining Value: 57.0
Sell Date: 
2003-08-07 00:00:00
    Sell Price: 974.12
    Updated Value: 9798.2

-------------------------

Buy Date: 
2003-08-22 00:00:00
Account Value: 9798.2
    Buy Price: 993.06
    Num Shares: 9.0
    Remaining Value: 860.66
Sell Date: 
2004-03-17 00:00:00
    Sell Price: 1123.75
    Updated Value: 10974.41

-------------------------

Buy Date: 
2004-04-13 00:00:00
Account Value: 10974.41
    Buy Price: 1129.44
    Num Shares: 9.0
    Remaining Value: 809.45
Sell Date: 
2004-04-21 00:00:00
    Sell Price: 1124.09
    Updated Value: 10926.26

-------------------------

Buy Date: 
2004-06-09 00:00:00
Account Value: 10926.26
    Buy Price: 1131.33
    Num Shares: 9.0
    Remaining Value: 744.29
Sell Date: 
2004-07-19 00:00:00
    Sell Price: 1100.9
    Updated Value: 10652.39

-------------------------

Buy Date: 
2004-09-07 00:00:00
Account Value: 10652.39
    Buy Price: 1121.3
    Num Shares: 9.0
    Remaining Value: 560.69
Sell Date: 
2004-10-25 00:00:00
    Sell Price: 1094.8
    Updated Value: 10413.89

-------------------------

Buy Date: 
2004-11-04 00:00:00
Account Value: 10413.89
    Buy Price: 1161.67
    Num Shares: 8.0
    Remaining Value: 1120.53
Sell Date: 
2005-01-19 00:00:00
    Sell Price: 1184.63
    Updated Value: 10597.57

-------------------------

Buy Date: 
2005-02-11 00:00:00
Account Value: 10597.57
    Buy Price: 1205.3
    Num Shares: 8.0
    Remaining Value: 955.17
Sell Date: 
2005-03-24 00:00:00
    Sell Price: 1171.42
    Updated Value: 10326.53

-------------------------

Buy Date: 
2005-05-24 00:00:00
Account Value: 10326.53
    Buy Price: 1194.07
    Num Shares: 8.0
    Remaining Value: 773.97
Sell Date: 
2005-08-29 00:00:00
    Sell Price: 1212.28
    Updated Value: 10472.21

-------------------------

Buy Date: 
2005-09-13 00:00:00
Account Value: 10472.21
    Buy Price: 1231.2
    Num Shares: 8.0
    Remaining Value: 622.61
Sell Date: 
2005-09-26 00:00:00
    Sell Price: 1215.63
    Updated Value: 10347.65

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10347.65
    Buy Price: 1234.72
    Num Shares: 8.0
    Remaining Value: 469.89
Sell Date: 
2006-02-14 00:00:00
    Sell Price: 1275.53
    Updated Value: 10674.13

-------------------------

Buy Date: 
2006-02-22 00:00:00
Account Value: 10674.13
    Buy Price: 1292.67
    Num Shares: 8.0
    Remaining Value: 332.77
Sell Date: 
2006-05-22 00:00:00
    Sell Price: 1262.07
    Updated Value: 10429.33

-------------------------

Buy Date: 
2006-08-01 00:00:00
Account Value: 10429.33
    Buy Price: 1270.92
    Num Shares: 8.0
    Remaining Value: 261.97
Sell Date: 
2007-03-06 00:00:00
    Sell Price: 1395.41
    Updated Value: 11425.25

-------------------------

Buy Date: 
2007-04-03 00:00:00
Account Value: 11425.25
    Buy Price: 1437.77
    Num Shares: 7.0
    Remaining Value: 1360.86
Sell Date: 
2007-07-03 00:00:00
    Sell Price: 1524.87
    Updated Value: 12034.95

-------------------------

Buy Date: 
2007-07-10 00:00:00
Account Value: 12034.95
    Buy Price: 1510.12
    Num Shares: 7.0
    Remaining Value: 1464.11
Sell Date: 
2007-07-31 00:00:00
    Sell Price: 1455.27
    Updated Value: 11651.0

-------------------------

Buy Date: 
2007-09-21 00:00:00
Account Value: 11651.0
    Buy Price: 1525.75
    Num Shares: 7.0
    Remaining Value: 970.75
Sell Date: 
2007-11-12 00:00:00
    Sell Price: 1439.18
    Updated Value: 11045.01

-------------------------

Buy Date: 
2008-04-04 00:00:00
Account Value: 11045.01
    Buy Price: 1370.4
    Num Shares: 8.0
    Remaining Value: 81.81
Sell Date: 
2008-06-11 00:00:00
    Sell Price: 1335.49
    Updated Value: 10765.73

-------------------------

Buy Date: 
2008-08-21 00:00:00
Account Value: 10765.73
    Buy Price: 1277.72
    Num Shares: 8.0
    Remaining Value: 543.97
Sell Date: 
2008-09-12 00:00:00
    Sell Price: 1251.7
    Updated Value: 10557.57

-------------------------

Buy Date: 
2009-01-08 00:00:00
Account Value: 10557.57
    Buy Price: 909.73
    Num Shares: 11.0
    Remaining Value: 550.54
Sell Date: 
2009-01-21 00:00:00
    Sell Price: 840.24
    Updated Value: 9793.18

-------------------------

Buy Date: 
2009-03-31 00:00:00
Account Value: 9793.18
    Buy Price: 797.87
    Num Shares: 12.0
    Remaining Value: 218.74
Sell Date: 
2009-07-10 00:00:00
    Sell Price: 879.13
    Updated Value: 10768.3

-------------------------

Buy Date: 
2009-07-22 00:00:00
Account Value: 10768.3
    Buy Price: 954.07
    Num Shares: 11.0
    Remaining Value: 273.53
Sell Date: 
2010-02-01 00:00:00
    Sell Price: 1089.19
    Updated Value: 12254.62

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 12254.62
    Buy Price: 1140.45
    Num Shares: 10.0
    Remaining Value: 850.12
Sell Date: 
2010-05-13 00:00:00
    Sell Price: 1157.44
    Updated Value: 12424.52

-------------------------

Buy Date: 
2010-07-26 00:00:00
Account Value: 12424.52
    Buy Price: 1115.01
    Num Shares: 11.0
    Remaining Value: 159.41
Sell Date: 
2010-08-24 00:00:00
    Sell Price: 1051.87
    Updated Value: 11729.98

-------------------------

Buy Date: 
2010-09-14 00:00:00
Account Value: 11729.98
    Buy Price: 1121.1
    Num Shares: 10.0
    Remaining Value: 518.98
Sell Date: 
2011-03-18 00:00:00
    Sell Price: 1279.21
    Updated Value: 13311.08

-------------------------

Buy Date: 
2011-04-01 00:00:00
Account Value: 13311.08
    Buy Price: 1332.41
    Num Shares: 9.0
    Remaining Value: 1319.39
Sell Date: 
2011-06-02 00:00:00
    Sell Price: 1312.94
    Updated Value: 13135.85

-------------------------

Buy Date: 
2011-07-12 00:00:00
Account Value: 13135.85
    Buy Price: 1313.64
    Num Shares: 9.0
    Remaining Value: 1313.09
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 1199.38
    Updated Value: 12107.51

-------------------------

Buy Date: 
2011-10-17 00:00:00
Account Value: 12107.51
    Buy Price: 1200.86
    Num Shares: 10.0
    Remaining Value: 98.91
Sell Date: 
2011-12-01 00:00:00
    Sell Price: 1244.58
    Updated Value: 12544.71

-------------------------

Buy Date: 
2011-12-07 00:00:00
Account Value: 12544.71
    Buy Price: 1261.01
    Num Shares: 9.0
    Remaining Value: 1195.62
Sell Date: 
2011-12-21 00:00:00
    Sell Price: 1243.72
    Updated Value: 12389.1

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 12389.1
    Buy Price: 1257.6
    Num Shares: 9.0
    Remaining Value: 1070.7
Sell Date: 
2012-04-23 00:00:00
    Sell Price: 1366.94
    Updated Value: 13373.16

-------------------------

Buy Date: 
2012-04-25 00:00:00
Account Value: 13373.16
    Buy Price: 1390.69
    Num Shares: 9.0
    Remaining Value: 856.95
Sell Date: 
2012-04-26 00:00:00
    Sell Price: 1399.98
    Updated Value: 13456.77

-------------------------

Buy Date: 
2012-04-27 00:00:00
Account Value: 13456.77
    Buy Price: 1403.36
    Num Shares: 9.0
    Remaining Value: 826.53
Sell Date: 
2012-05-11 00:00:00
    Sell Price: 1353.39
    Updated Value: 13007.04

-------------------------

Buy Date: 
2012-07-09 00:00:00
Account Value: 13007.04
    Buy Price: 1352.46
    Num Shares: 9.0
    Remaining Value: 834.9
Sell Date: 
2012-11-01 00:00:00
    Sell Price: 1427.59
    Updated Value: 13683.21

-------------------------

Buy Date: 
2012-12-18 00:00:00
Account Value: 13683.21
    Buy Price: 1446.79
    Num Shares: 9.0
    Remaining Value: 662.1
Sell Date: 
2013-06-27 00:00:00
    Sell Price: 1613.2
    Updated Value: 15180.9

-------------------------

Buy Date: 
2013-07-15 00:00:00
Account Value: 15180.9
    Buy Price: 1682.5
    Num Shares: 9.0
    Remaining Value: 38.4
Sell Date: 
2013-08-28 00:00:00
    Sell Price: 1634.96
    Updated Value: 14753.04

-------------------------

Buy Date: 
2013-09-18 00:00:00
Account Value: 14753.04
    Buy Price: 1725.52
    Num Shares: 8.0
    Remaining Value: 948.88
Sell Date: 
2014-02-03 00:00:00
    Sell Price: 1741.89
    Updated Value: 14884.0

-------------------------

Buy Date: 
2014-02-21 00:00:00
Account Value: 14884.0
    Buy Price: 1836.25
    Num Shares: 8.0
    Remaining Value: 194.0
Sell Date: 
2014-04-21 00:00:00
    Sell Price: 1871.89
    Updated Value: 15169.12

-------------------------

Buy Date: 
2014-04-28 00:00:00
Account Value: 15169.12
    Buy Price: 1869.43
    Num Shares: 8.0
    Remaining Value: 213.68
Sell Date: 
2014-08-07 00:00:00
    Sell Price: 1909.57
    Updated Value: 15490.24

-------------------------

Buy Date: 
2014-08-25 00:00:00
Account Value: 15490.24
    Buy Price: 1997.92
    Num Shares: 7.0
    Remaining Value: 1504.8
Sell Date: 
2014-10-08 00:00:00
    Sell Price: 1968.89
    Updated Value: 15287.03

-------------------------

Buy Date: 
2014-11-05 00:00:00
Account Value: 15287.03
    Buy Price: 2023.57
    Num Shares: 7.0
    Remaining Value: 1122.04
Sell Date: 
2015-01-13 00:00:00
    Sell Price: 2023.03
    Updated Value: 15283.25

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 15283.25
    Buy Price: 2096.99
    Num Shares: 7.0
    Remaining Value: 604.32
Sell Date: 
2015-04-08 00:00:00
    Sell Price: 2081.9
    Updated Value: 15177.62


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15177.62





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 1255.18
    Num Shares: 7.0
    Remaining Value: 1213.74
Sell Date: 
2001-07-10 00:00:00
    Sell Price: 1181.52
    Updated Value: 9484.38

-------------------------

Buy Date: 
2001-11-19 00:00:00
Account Value: 9484.38
    Buy Price: 1151.06
    Num Shares: 8.0
    Remaining Value: 275.9
Sell Date: 
2002-02-04 00:00:00
    Sell Price: 1094.44
    Updated Value: 9031.42

-------------------------

Buy Date: 
2002-03-12 00:00:00
Account Value: 9031.42
    Buy Price: 1165.58
    Num Shares: 7.0
    Remaining Value: 872.36
Sell Date: 
2002-04-11 00:00:00
    Sell Price: 1103.69
    Updated Value: 8598.19

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 8598.19
    Buy Price: 890.23
    Num Shares: 9.0
    Remaining Value: 586.12
Sell Date: 
2003-01-29 00:00:00
    Sell Price: 864.36
    Updated Value: 8365.36

-------------------------

Buy Date: 
2003-04-11 00:00:00
Account Value: 8365.36
    Buy Price: 868.3
    Num Shares: 9.0
    Remaining Value: 550.66
Sell Date: 
2004-03-23 00:00:00
    Sell Price: 1093.95
    Updated Value: 10396.21

-------------------------

Buy Date: 
2004-04-08 00:00:00
Account Value: 10396.21
    Buy Price: 1139.32
    Num Shares: 9.0
    Remaining Value: 142.33
Sell Date: 
2004-04-21 00:00:00
    Sell Price: 1124.09
    Updated Value: 10259.14

-------------------------

Buy Date: 
2004-06-10 00:00:00
Account Value: 10259.14
    Buy Price: 1136.47
    Num Shares: 9.0
    Remaining Value: 30.91
Sell Date: 
2004-07-14 00:00:00
    Sell Price: 1111.47
    Updated Value: 10034.14

-------------------------

Buy Date: 
2004-09-14 00:00:00
Account Value: 10034.14
    Buy Price: 1128.33
    Num Shares: 8.0
    Remaining Value: 1007.5
Sell Date: 
2005-03-23 00:00:00
    Sell Price: 1172.53
    Updated Value: 10387.74

-------------------------

Buy Date: 
2005-05-31 00:00:00
Account Value: 10387.74
    Buy Price: 1191.5
    Num Shares: 8.0
    Remaining Value: 855.74
Sell Date: 
2005-09-30 00:00:00
    Sell Price: 1228.81
    Updated Value: 10686.22

-------------------------

Buy Date: 
2005-11-14 00:00:00
Account Value: 10686.22
    Buy Price: 1233.76
    Num Shares: 8.0
    Remaining Value: 816.14
Sell Date: 
2006-05-23 00:00:00
    Sell Price: 1256.58
    Updated Value: 10868.78

-------------------------

Buy Date: 
2006-08-10 00:00:00
Account Value: 10868.78
    Buy Price: 1271.81
    Num Shares: 8.0
    Remaining Value: 694.3
Sell Date: 
2007-03-08 00:00:00
    Sell Price: 1401.89
    Updated Value: 11909.42

-------------------------

Buy Date: 
2007-04-02 00:00:00
Account Value: 11909.42
    Buy Price: 1424.55
    Num Shares: 8.0
    Remaining Value: 513.02
Sell Date: 
2007-08-02 00:00:00
    Sell Price: 1472.2
    Updated Value: 12290.62

-------------------------

Buy Date: 
2007-09-25 00:00:00
Account Value: 12290.62
    Buy Price: 1517.21
    Num Shares: 8.0
    Remaining Value: 152.94
Sell Date: 
2007-11-15 00:00:00
    Sell Price: 1451.15
    Updated Value: 11762.14

-------------------------

Buy Date: 
2008-04-21 00:00:00
Account Value: 11762.14
    Buy Price: 1388.17
    Num Shares: 8.0
    Remaining Value: 656.78
Sell Date: 
2008-06-19 00:00:00
    Sell Price: 1342.83
    Updated Value: 11399.42

-------------------------

Buy Date: 
2009-04-14 00:00:00
Account Value: 11399.42
    Buy Price: 841.5
    Num Shares: 13.0
    Remaining Value: 459.92
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 1097.28
    Updated Value: 14724.56

-------------------------

Buy Date: 
2010-03-04 00:00:00
Account Value: 14724.56
    Buy Price: 1122.97
    Num Shares: 13.0
    Remaining Value: 125.95
Sell Date: 
2010-05-20 00:00:00
    Sell Price: 1071.59
    Updated Value: 14056.62

-------------------------

Buy Date: 
2010-08-09 00:00:00
Account Value: 14056.62
    Buy Price: 1127.79
    Num Shares: 12.0
    Remaining Value: 523.14
Sell Date: 
2010-08-23 00:00:00
    Sell Price: 1067.36
    Updated Value: 13331.46

-------------------------

Buy Date: 
2010-09-14 00:00:00
Account Value: 13331.46
    Buy Price: 1121.1
    Num Shares: 11.0
    Remaining Value: 999.36
Sell Date: 
2011-06-06 00:00:00
    Sell Price: 1286.17
    Updated Value: 15147.23

-------------------------

Buy Date: 
2011-07-12 00:00:00
Account Value: 15147.23
    Buy Price: 1313.64
    Num Shares: 11.0
    Remaining Value: 697.19
Sell Date: 
2011-07-21 00:00:00
    Sell Price: 1343.8
    Updated Value: 15478.99

-------------------------

Buy Date: 
2011-07-26 00:00:00
Account Value: 15478.99
    Buy Price: 1331.94
    Num Shares: 11.0
    Remaining Value: 827.65
Sell Date: 
2011-08-02 00:00:00
    Sell Price: 1254.05
    Updated Value: 14622.2

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 14622.2
    Buy Price: 1242.0
    Num Shares: 11.0
    Remaining Value: 960.2
Sell Date: 
2012-05-15 00:00:00
    Sell Price: 1330.66
    Updated Value: 15597.46

-------------------------

Buy Date: 
2012-07-24 00:00:00
Account Value: 15597.46
    Buy Price: 1338.31
    Num Shares: 11.0
    Remaining Value: 876.05
Sell Date: 
2012-11-07 00:00:00
    Sell Price: 1394.53
    Updated Value: 16215.88

-------------------------

Buy Date: 
2012-12-31 00:00:00
Account Value: 16215.88
    Buy Price: 1426.19
    Num Shares: 11.0
    Remaining Value: 527.79
Sell Date: 
2013-08-29 00:00:00
    Sell Price: 1638.17
    Updated Value: 18547.66

-------------------------

Buy Date: 
2013-09-11 00:00:00
Account Value: 18547.66
    Buy Price: 1689.13
    Num Shares: 10.0
    Remaining Value: 1656.36
Sell Date: 
2014-02-05 00:00:00
    Sell Price: 1751.64
    Updated Value: 19172.76

-------------------------

Buy Date: 
2014-02-19 00:00:00
Account Value: 19172.76
    Buy Price: 1828.75
    Num Shares: 10.0
    Remaining Value: 885.26
Sell Date: 
2014-10-07 00:00:00
    Sell Price: 1935.1
    Updated Value: 20236.26

-------------------------

Buy Date: 
2014-11-04 00:00:00
Account Value: 20236.26
    Buy Price: 2012.1
    Num Shares: 10.0
    Remaining Value: 115.26
Sell Date: 
2015-02-09 00:00:00
    Sell Price: 2046.74
    Updated Value: 20582.66

-------------------------

Buy Date: 
2015-02-11 00:00:00
Account Value: 20582.66
    Buy Price: 2068.53
    Num Shares: 9.0
    Remaining Value: 1965.89
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 20884.43


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 20884.43





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 1312.83
    Num Shares: 7.0
    Remaining Value: 810.19
Sell Date: 
2001-06-15 00:00:00
    Sell Price: 1214.36
    Updated Value: 9310.71

-------------------------

Buy Date: 
2001-12-31 00:00:00
Account Value: 9310.71
    Buy Price: 1148.08
    Num Shares: 8.0
    Remaining Value: 126.07
Sell Date: 
2002-02-04 00:00:00
    Sell Price: 1094.44
    Updated Value: 8881.59

-------------------------

Buy Date: 
2002-03-05 00:00:00
Account Value: 8881.59
    Buy Price: 1146.14
    Num Shares: 7.0
    Remaining Value: 858.61
Sell Date: 
2002-04-15 00:00:00
    Sell Price: 1102.55
    Updated Value: 8576.46

-------------------------

Buy Date: 
2002-12-02 00:00:00
Account Value: 8576.46
    Buy Price: 934.53
    Num Shares: 9.0
    Remaining Value: 165.69
Sell Date: 
2003-01-29 00:00:00
    Sell Price: 864.36
    Updated Value: 7944.93

-------------------------

Buy Date: 
2003-04-24 00:00:00
Account Value: 7944.93
    Buy Price: 911.43
    Num Shares: 8.0
    Remaining Value: 653.49
Sell Date: 
2004-05-13 00:00:00
    Sell Price: 1096.44
    Updated Value: 9425.01

-------------------------

Buy Date: 
2004-06-08 00:00:00
Account Value: 9425.01
    Buy Price: 1142.18
    Num Shares: 8.0
    Remaining Value: 287.57
Sell Date: 
2004-07-09 00:00:00
    Sell Price: 1112.81
    Updated Value: 9190.05

-------------------------

Buy Date: 
2004-09-14 00:00:00
Account Value: 9190.05
    Buy Price: 1128.33
    Num Shares: 8.0
    Remaining Value: 163.41
Sell Date: 
2004-10-25 00:00:00
    Sell Price: 1094.8
    Updated Value: 8921.81

-------------------------

Buy Date: 
2004-11-02 00:00:00
Account Value: 8921.81
    Buy Price: 1130.56
    Num Shares: 7.0
    Remaining Value: 1007.89
Sell Date: 
2005-04-18 00:00:00
    Sell Price: 1145.98
    Updated Value: 9029.75

-------------------------

Buy Date: 
2005-05-31 00:00:00
Account Value: 9029.75
    Buy Price: 1191.5
    Num Shares: 7.0
    Remaining Value: 689.25
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 1186.57
    Updated Value: 8995.24

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 8995.24
    Buy Price: 1230.96
    Num Shares: 7.0
    Remaining Value: 378.52
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 1272.88
    Updated Value: 9288.68

-------------------------

Buy Date: 
2006-08-23 00:00:00
Account Value: 9288.68
    Buy Price: 1292.99
    Num Shares: 7.0
    Remaining Value: 237.75
Sell Date: 
2007-08-08 00:00:00
    Sell Price: 1497.49
    Updated Value: 10720.18

-------------------------

Buy Date: 
2007-09-24 00:00:00
Account Value: 10720.18
    Buy Price: 1517.73
    Num Shares: 7.0
    Remaining Value: 96.07
Sell Date: 
2007-11-12 00:00:00
    Sell Price: 1439.18
    Updated Value: 10170.33

-------------------------

Buy Date: 
2008-05-12 00:00:00
Account Value: 10170.33
    Buy Price: 1403.58
    Num Shares: 7.0
    Remaining Value: 345.27
Sell Date: 
2008-06-04 00:00:00
    Sell Price: 1377.2
    Updated Value: 9985.67

-------------------------

Buy Date: 
2008-06-05 00:00:00
Account Value: 9985.67
    Buy Price: 1404.05
    Num Shares: 7.0
    Remaining Value: 157.32
Sell Date: 
2008-06-06 00:00:00
    Sell Price: 1360.68
    Updated Value: 9682.08

-------------------------

Buy Date: 
2008-06-09 00:00:00
Account Value: 9682.08
    Buy Price: 1361.76
    Num Shares: 7.0
    Remaining Value: 149.76
Sell Date: 
2008-06-11 00:00:00
    Sell Price: 1335.49
    Updated Value: 9498.19

-------------------------

Buy Date: 
2009-04-24 00:00:00
Account Value: 9498.19
    Buy Price: 866.23
    Num Shares: 10.0
    Remaining Value: 835.89
Sell Date: 
2010-02-18 00:00:00
    Sell Price: 1106.75
    Updated Value: 11903.39

-------------------------

Buy Date: 
2010-02-19 00:00:00
Account Value: 11903.39
    Buy Price: 1109.17
    Num Shares: 10.0
    Remaining Value: 811.69
Sell Date: 
2010-05-25 00:00:00
    Sell Price: 1074.03
    Updated Value: 11551.99

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 11551.99
    Buy Price: 1148.67
    Num Shares: 10.0
    Remaining Value: 65.29
Sell Date: 
2011-06-14 00:00:00
    Sell Price: 1287.87
    Updated Value: 12943.99

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 12943.99
    Buy Price: 1319.49
    Num Shares: 9.0
    Remaining Value: 1068.58
Sell Date: 
2011-08-03 00:00:00
    Sell Price: 1260.34
    Updated Value: 12411.64

-------------------------

Buy Date: 
2011-11-09 00:00:00
Account Value: 12411.64
    Buy Price: 1229.1
    Num Shares: 10.0
    Remaining Value: 120.64
Sell Date: 
2011-11-10 00:00:00
    Sell Price: 1239.7
    Updated Value: 12517.64

-------------------------

Buy Date: 
2011-11-15 00:00:00
Account Value: 12517.64
    Buy Price: 1257.81
    Num Shares: 9.0
    Remaining Value: 1197.35
Sell Date: 
2011-11-18 00:00:00
    Sell Price: 1215.65
    Updated Value: 12138.2

-------------------------

Buy Date: 
2011-12-12 00:00:00
Account Value: 12138.2
    Buy Price: 1236.47
    Num Shares: 9.0
    Remaining Value: 1009.97
Sell Date: 
2011-12-21 00:00:00
    Sell Price: 1243.72
    Updated Value: 12203.45

-------------------------

Buy Date: 
2011-12-28 00:00:00
Account Value: 12203.45
    Buy Price: 1249.64
    Num Shares: 9.0
    Remaining Value: 956.69
Sell Date: 
2012-05-29 00:00:00
    Sell Price: 1332.42
    Updated Value: 12948.47

-------------------------

Buy Date: 
2012-07-13 00:00:00
Account Value: 12948.47
    Buy Price: 1356.78
    Num Shares: 9.0
    Remaining Value: 737.45
Sell Date: 
2012-07-17 00:00:00
    Sell Price: 1363.67
    Updated Value: 13010.48

-------------------------

Buy Date: 
2012-07-27 00:00:00
Account Value: 13010.48
    Buy Price: 1385.97
    Num Shares: 9.0
    Remaining Value: 536.75
Sell Date: 
2012-08-02 00:00:00
    Sell Price: 1365.0
    Updated Value: 12821.75

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 12821.75
    Buy Price: 1394.23
    Num Shares: 9.0
    Remaining Value: 273.68
Sell Date: 
2012-11-20 00:00:00
    Sell Price: 1387.81
    Updated Value: 12763.97

-------------------------

Buy Date: 
2012-11-29 00:00:00
Account Value: 12763.97
    Buy Price: 1415.95
    Num Shares: 9.0
    Remaining Value: 20.42
Sell Date: 
2014-10-15 00:00:00
    Sell Price: 1862.49
    Updated Value: 16782.83

-------------------------

Buy Date: 
2014-10-31 00:00:00
Account Value: 16782.83
    Buy Price: 2018.05
    Num Shares: 8.0
    Remaining Value: 638.43
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17454.91


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17454.91





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 1249.46
    Num Shares: 8.0
    Remaining Value: 4.32
Sell Date: 
2001-06-26 00:00:00
    Sell Price: 1216.76
    Updated Value: 9738.4

-------------------------

Buy Date: 
2002-03-15 00:00:00
Account Value: 9738.4
    Buy Price: 1166.16
    Num Shares: 8.0
    Remaining Value: 409.12
Sell Date: 
2002-04-03 00:00:00
    Sell Price: 1125.4
    Updated Value: 9412.32

-------------------------

Buy Date: 
2003-04-23 00:00:00
Account Value: 9412.32
    Buy Price: 919.02
    Num Shares: 10.0
    Remaining Value: 222.12
Sell Date: 
2004-07-28 00:00:00
    Sell Price: 1095.42
    Updated Value: 11176.32

-------------------------

Buy Date: 
2004-09-14 00:00:00
Account Value: 11176.32
    Buy Price: 1128.33
    Num Shares: 9.0
    Remaining Value: 1021.35
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 1110.06
    Updated Value: 11011.89

-------------------------

Buy Date: 
2004-10-11 00:00:00
Account Value: 11011.89
    Buy Price: 1124.39
    Num Shares: 9.0
    Remaining Value: 892.38
Sell Date: 
2004-10-19 00:00:00
    Sell Price: 1103.23
    Updated Value: 10821.45

-------------------------

Buy Date: 
2004-11-05 00:00:00
Account Value: 10821.45
    Buy Price: 1166.17
    Num Shares: 9.0
    Remaining Value: 325.92
Sell Date: 
2005-10-17 00:00:00
    Sell Price: 1190.1
    Updated Value: 11036.82

-------------------------

Buy Date: 
2005-11-04 00:00:00
Account Value: 11036.82
    Buy Price: 1220.14
    Num Shares: 9.0
    Remaining Value: 55.56
Sell Date: 
2006-06-16 00:00:00
    Sell Price: 1251.54
    Updated Value: 11319.42

-------------------------

Buy Date: 
2006-07-07 00:00:00
Account Value: 11319.42
    Buy Price: 1265.48
    Num Shares: 8.0
    Remaining Value: 1195.58
Sell Date: 
2006-07-19 00:00:00
    Sell Price: 1259.81
    Updated Value: 11274.06

-------------------------

Buy Date: 
2006-08-03 00:00:00
Account Value: 11274.06
    Buy Price: 1280.27
    Num Shares: 8.0
    Remaining Value: 1031.9
Sell Date: 
2007-08-22 00:00:00
    Sell Price: 1464.07
    Updated Value: 12744.46

-------------------------

Buy Date: 
2007-08-29 00:00:00
Account Value: 12744.46
    Buy Price: 1463.76
    Num Shares: 8.0
    Remaining Value: 1034.38
Sell Date: 
2007-11-19 00:00:00
    Sell Price: 1433.27
    Updated Value: 12500.54

-------------------------

Buy Date: 
2007-12-11 00:00:00
Account Value: 12500.54
    Buy Price: 1477.65
    Num Shares: 8.0
    Remaining Value: 679.34
Sell Date: 
2007-12-20 00:00:00
    Sell Price: 1460.12
    Updated Value: 12360.3

-------------------------

Buy Date: 
2009-06-12 00:00:00
Account Value: 12360.3
    Buy Price: 946.21
    Num Shares: 13.0
    Remaining Value: 59.57
Sell Date: 
2010-06-01 00:00:00
    Sell Price: 1070.71
    Updated Value: 13978.8

-------------------------

Buy Date: 
2010-08-06 00:00:00
Account Value: 13978.8
    Buy Price: 1121.64
    Num Shares: 12.0
    Remaining Value: 519.12
Sell Date: 
2010-08-16 00:00:00
    Sell Price: 1079.38
    Updated Value: 13471.68

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 13471.68
    Buy Price: 1134.28
    Num Shares: 11.0
    Remaining Value: 994.6
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 1119.46
    Updated Value: 13308.66

-------------------------

Buy Date: 
2012-01-11 00:00:00
Account Value: 13308.66
    Buy Price: 1292.48
    Num Shares: 10.0
    Remaining Value: 383.86
Sell Date: 
2012-11-20 00:00:00
    Sell Price: 1387.81
    Updated Value: 14261.96

-------------------------

Buy Date: 
2012-11-28 00:00:00
Account Value: 14261.96
    Buy Price: 1409.93
    Num Shares: 10.0
    Remaining Value: 162.66
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21183.26


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21183.26





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-26 00:00:00
Account Value: 10000
    Buy Price: 1234.52
    Num Shares: 8.0
    Remaining Value: 123.84
Sell Date: 
2001-07-16 00:00:00
    Sell Price: 1202.45
    Updated Value: 9743.44

-------------------------

Buy Date: 
2003-05-08 00:00:00
Account Value: 9743.44
    Buy Price: 920.27
    Num Shares: 10.0
    Remaining Value: 540.74
Sell Date: 
2004-08-16 00:00:00
    Sell Price: 1079.34
    Updated Value: 11334.14

-------------------------

Buy Date: 
2004-08-26 00:00:00
Account Value: 11334.14
    Buy Price: 1105.09
    Num Shares: 10.0
    Remaining Value: 283.24
Sell Date: 
2004-10-26 00:00:00
    Sell Price: 1111.09
    Updated Value: 11394.14

-------------------------

Buy Date: 
2004-10-29 00:00:00
Account Value: 11394.14
    Buy Price: 1130.2
    Num Shares: 10.0
    Remaining Value: 92.14
Sell Date: 
2005-10-18 00:00:00
    Sell Price: 1178.14
    Updated Value: 11873.54

-------------------------

Buy Date: 
2005-11-03 00:00:00
Account Value: 11873.54
    Buy Price: 1219.94
    Num Shares: 9.0
    Remaining Value: 894.08
Sell Date: 
2006-06-21 00:00:00
    Sell Price: 1252.2
    Updated Value: 12163.88

-------------------------

Buy Date: 
2006-06-28 00:00:00
Account Value: 12163.88
    Buy Price: 1246.0
    Num Shares: 9.0
    Remaining Value: 949.88
Sell Date: 
2006-06-29 00:00:00
    Sell Price: 1272.87
    Updated Value: 12405.71

-------------------------

Buy Date: 
2006-06-30 00:00:00
Account Value: 12405.71
    Buy Price: 1270.2
    Num Shares: 9.0
    Remaining Value: 973.91
Sell Date: 
2006-07-24 00:00:00
    Sell Price: 1260.91
    Updated Value: 12322.1

-------------------------

Buy Date: 
2006-07-28 00:00:00
Account Value: 12322.1
    Buy Price: 1278.55
    Num Shares: 9.0
    Remaining Value: 815.15
Sell Date: 
2007-11-20 00:00:00
    Sell Price: 1439.7
    Updated Value: 13772.45

-------------------------

Buy Date: 
2007-12-10 00:00:00
Account Value: 13772.45
    Buy Price: 1515.96
    Num Shares: 9.0
    Remaining Value: 128.81
Sell Date: 
2007-12-28 00:00:00
    Sell Price: 1478.49
    Updated Value: 13435.22

-------------------------

Buy Date: 
2008-01-03 00:00:00
Account Value: 13435.22
    Buy Price: 1447.16
    Num Shares: 9.0
    Remaining Value: 410.78
Sell Date: 
2008-01-04 00:00:00
    Sell Price: 1411.63
    Updated Value: 13115.45

-------------------------

Buy Date: 
2009-07-31 00:00:00
Account Value: 13115.45
    Buy Price: 987.48
    Num Shares: 13.0
    Remaining Value: 278.21
Sell Date: 
2010-07-06 00:00:00
    Sell Price: 1028.06
    Updated Value: 13642.99

-------------------------

Buy Date: 
2010-07-26 00:00:00
Account Value: 13642.99
    Buy Price: 1115.01
    Num Shares: 12.0
    Remaining Value: 262.87
Sell Date: 
2010-07-28 00:00:00
    Sell Price: 1106.13
    Updated Value: 13536.43

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 13536.43
    Buy Price: 1101.6
    Num Shares: 12.0
    Remaining Value: 317.23
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 1071.69
    Updated Value: 13177.51

-------------------------

Buy Date: 
2010-09-16 00:00:00
Account Value: 13177.51
    Buy Price: 1124.66
    Num Shares: 11.0
    Remaining Value: 806.25
Sell Date: 
2011-08-11 00:00:00
    Sell Price: 1172.64
    Updated Value: 13705.29

-------------------------

Buy Date: 
2012-01-13 00:00:00
Account Value: 13705.29
    Buy Price: 1289.09
    Num Shares: 10.0
    Remaining Value: 814.39
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21834.99


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21834.99





-----------------------------------------------------------------------
^GSPC Calculations, N = [10, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-25 00:00:00
Account Value: 10000
    Buy Price: 1228.75
    Num Shares: 8.0
    Remaining Value: 170.0
Sell Date: 
2001-07-19 00:00:00
    Sell Price: 1215.02
    Updated Value: 9890.16

-------------------------

Buy Date: 
2001-07-20 00:00:00
Account Value: 9890.16
    Buy Price: 1210.85
    Num Shares: 8.0
    Remaining Value: 203.36
Sell Date: 
2001-08-02 00:00:00
    Sell Price: 1220.75
    Updated Value: 9969.36

-------------------------

Buy Date: 
2001-08-06 00:00:00
Account Value: 9969.36
    Buy Price: 1200.48
    Num Shares: 8.0
    Remaining Value: 365.52
Sell Date: 
2001-08-15 00:00:00
    Sell Price: 1178.02
    Updated Value: 9789.68

-------------------------

Buy Date: 
2003-06-04 00:00:00
Account Value: 9789.68
    Buy Price: 986.24
    Num Shares: 9.0
    Remaining Value: 913.52
Sell Date: 
2007-11-29 00:00:00
    Sell Price: 1469.72
    Updated Value: 14141.0

-------------------------

Buy Date: 
2007-12-05 00:00:00
Account Value: 14141.0
    Buy Price: 1485.01
    Num Shares: 9.0
    Remaining Value: 775.91
Sell Date: 
2008-01-09 00:00:00
    Sell Price: 1409.13
    Updated Value: 13458.08

-------------------------

Buy Date: 
2009-08-31 00:00:00
Account Value: 13458.08
    Buy Price: 1020.62
    Num Shares: 13.0
    Remaining Value: 190.02
Sell Date: 
2010-08-31 00:00:00
    Sell Price: 1049.33
    Updated Value: 13831.31

-------------------------

Buy Date: 
2010-09-10 00:00:00
Account Value: 13831.31
    Buy Price: 1109.55
    Num Shares: 12.0
    Remaining Value: 516.71
Sell Date: 
2011-08-15 00:00:00
    Sell Price: 1204.49
    Updated Value: 14970.59

-------------------------

Buy Date: 
2011-10-31 00:00:00
Account Value: 14970.59
    Buy Price: 1253.3
    Num Shares: 11.0
    Remaining Value: 1184.29
Sell Date: 
2011-11-18 00:00:00
    Sell Price: 1215.65
    Updated Value: 14556.44

-------------------------

Buy Date: 
2012-01-06 00:00:00
Account Value: 14556.44
    Buy Price: 1277.81
    Num Shares: 11.0
    Remaining Value: 500.53
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23623.19


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23623.19





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-01-31 00:00:00
Account Value: 10000
    Buy Price: 1366.01
    Num Shares: 7.0
    Remaining Value: 437.93
Sell Date: 
2001-02-21 00:00:00
    Sell Price: 1255.27
    Updated Value: 9224.82

-------------------------

Buy Date: 
2001-04-24 00:00:00
Account Value: 9224.82
    Buy Price: 1209.47
    Num Shares: 7.0
    Remaining Value: 758.53
Sell Date: 
2001-06-14 00:00:00
    Sell Price: 1219.87
    Updated Value: 9297.62

-------------------------

Buy Date: 
2001-08-15 00:00:00
Account Value: 9297.62
    Buy Price: 1178.02
    Num Shares: 7.0
    Remaining Value: 1051.48
Sell Date: 
2001-08-20 00:00:00
    Sell Price: 1171.41
    Updated Value: 9251.35

-------------------------

Buy Date: 
2001-10-18 00:00:00
Account Value: 9251.35
    Buy Price: 1068.61
    Num Shares: 8.0
    Remaining Value: 702.47
Sell Date: 
2001-12-27 00:00:00
    Sell Price: 1157.13
    Updated Value: 9959.51

-------------------------

Buy Date: 
2002-01-07 00:00:00
Account Value: 9959.51
    Buy Price: 1164.89
    Num Shares: 8.0
    Remaining Value: 640.39
Sell Date: 
2002-01-28 00:00:00
    Sell Price: 1133.06
    Updated Value: 9704.87

-------------------------

Buy Date: 
2002-03-08 00:00:00
Account Value: 9704.87
    Buy Price: 1164.31
    Num Shares: 8.0
    Remaining Value: 390.39
Sell Date: 
2002-04-09 00:00:00
    Sell Price: 1117.8
    Updated Value: 9332.79

-------------------------

Buy Date: 
2002-06-03 00:00:00
Account Value: 9332.79
    Buy Price: 1040.68
    Num Shares: 8.0
    Remaining Value: 1007.35
Sell Date: 
2002-06-10 00:00:00
    Sell Price: 1030.74
    Updated Value: 9253.27

-------------------------

Buy Date: 
2002-08-19 00:00:00
Account Value: 9253.27
    Buy Price: 950.7
    Num Shares: 9.0
    Remaining Value: 696.97
Sell Date: 
2002-09-17 00:00:00
    Sell Price: 873.52
    Updated Value: 8558.65

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 8558.65
    Buy Price: 890.23
    Num Shares: 9.0
    Remaining Value: 546.58
Sell Date: 
2002-12-23 00:00:00
    Sell Price: 897.38
    Updated Value: 8623.0

-------------------------

Buy Date: 
2003-01-16 00:00:00
Account Value: 8623.0
    Buy Price: 914.6
    Num Shares: 9.0
    Remaining Value: 391.6
Sell Date: 
2003-02-03 00:00:00
    Sell Price: 860.32
    Updated Value: 8134.48

-------------------------

Buy Date: 
2003-03-25 00:00:00
Account Value: 8134.48
    Buy Price: 874.74
    Num Shares: 9.0
    Remaining Value: 261.82
Sell Date: 
2003-07-11 00:00:00
    Sell Price: 998.14
    Updated Value: 9245.08

-------------------------

Buy Date: 
2003-07-21 00:00:00
Account Value: 9245.08
    Buy Price: 978.8
    Num Shares: 9.0
    Remaining Value: 435.88
Sell Date: 
2003-08-05 00:00:00
    Sell Price: 965.46
    Updated Value: 9125.02

-------------------------

Buy Date: 
2003-08-27 00:00:00
Account Value: 9125.02
    Buy Price: 996.79
    Num Shares: 9.0
    Remaining Value: 153.91
Sell Date: 
2003-10-09 00:00:00
    Sell Price: 1038.73
    Updated Value: 9502.48

-------------------------

Buy Date: 
2003-10-16 00:00:00
Account Value: 9502.48
    Buy Price: 1050.07
    Num Shares: 9.0
    Remaining Value: 51.85
Sell Date: 
2003-12-08 00:00:00
    Sell Price: 1069.3
    Updated Value: 9675.55

-------------------------

Buy Date: 
2003-12-10 00:00:00
Account Value: 9675.55
    Buy Price: 1059.05
    Num Shares: 9.0
    Remaining Value: 144.1
Sell Date: 
2004-03-15 00:00:00
    Sell Price: 1104.49
    Updated Value: 10084.51

-------------------------

Buy Date: 
2004-04-15 00:00:00
Account Value: 10084.51
    Buy Price: 1128.84
    Num Shares: 8.0
    Remaining Value: 1053.79
Sell Date: 
2004-05-06 00:00:00
    Sell Price: 1113.99
    Updated Value: 9965.71

-------------------------

Buy Date: 
2004-06-09 00:00:00
Account Value: 9965.71
    Buy Price: 1131.33
    Num Shares: 8.0
    Remaining Value: 915.07
Sell Date: 
2004-07-14 00:00:00
    Sell Price: 1111.47
    Updated Value: 9806.83

-------------------------

Buy Date: 
2004-09-02 00:00:00
Account Value: 9806.83
    Buy Price: 1118.31
    Num Shares: 8.0
    Remaining Value: 860.35
Sell Date: 
2004-10-12 00:00:00
    Sell Price: 1121.84
    Updated Value: 9835.07

-------------------------

Buy Date: 
2004-10-18 00:00:00
Account Value: 9835.07
    Buy Price: 1114.02
    Num Shares: 8.0
    Remaining Value: 922.91
Sell Date: 
2004-10-25 00:00:00
    Sell Price: 1094.8
    Updated Value: 9681.31

-------------------------

Buy Date: 
2004-11-10 00:00:00
Account Value: 9681.31
    Buy Price: 1162.91
    Num Shares: 8.0
    Remaining Value: 378.03
Sell Date: 
2005-01-19 00:00:00
    Sell Price: 1184.63
    Updated Value: 9855.07

-------------------------

Buy Date: 
2005-02-14 00:00:00
Account Value: 9855.07
    Buy Price: 1206.14
    Num Shares: 8.0
    Remaining Value: 205.95
Sell Date: 
2005-03-28 00:00:00
    Sell Price: 1174.28
    Updated Value: 9600.19

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 9600.19
    Buy Price: 1191.08
    Num Shares: 8.0
    Remaining Value: 71.55
Sell Date: 
2005-07-13 00:00:00
    Sell Price: 1223.29
    Updated Value: 9857.87

-------------------------

Buy Date: 
2005-07-18 00:00:00
Account Value: 9857.87
    Buy Price: 1221.13
    Num Shares: 8.0
    Remaining Value: 88.83
Sell Date: 
2005-08-23 00:00:00
    Sell Price: 1217.59
    Updated Value: 9829.55

-------------------------

Buy Date: 
2005-09-19 00:00:00
Account Value: 9829.55
    Buy Price: 1231.02
    Num Shares: 7.0
    Remaining Value: 1212.41
Sell Date: 
2005-10-06 00:00:00
    Sell Price: 1191.49
    Updated Value: 9552.84

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 9552.84
    Buy Price: 1230.96
    Num Shares: 7.0
    Remaining Value: 936.12
Sell Date: 
2006-02-07 00:00:00
    Sell Price: 1254.78
    Updated Value: 9719.58

-------------------------

Buy Date: 
2006-03-01 00:00:00
Account Value: 9719.58
    Buy Price: 1291.24
    Num Shares: 7.0
    Remaining Value: 680.9
Sell Date: 
2006-04-25 00:00:00
    Sell Price: 1301.74
    Updated Value: 9793.08

-------------------------

Buy Date: 
2006-05-03 00:00:00
Account Value: 9793.08
    Buy Price: 1308.12
    Num Shares: 7.0
    Remaining Value: 636.24
Sell Date: 
2006-05-24 00:00:00
    Sell Price: 1258.57
    Updated Value: 9446.23

-------------------------

Buy Date: 
2006-07-12 00:00:00
Account Value: 9446.23
    Buy Price: 1258.6
    Num Shares: 7.0
    Remaining Value: 636.03
Sell Date: 
2006-07-31 00:00:00
    Sell Price: 1276.66
    Updated Value: 9572.65

-------------------------

Buy Date: 
2006-08-07 00:00:00
Account Value: 9572.65
    Buy Price: 1275.77
    Num Shares: 7.0
    Remaining Value: 642.26
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 1391.97
    Updated Value: 10386.05

-------------------------

Buy Date: 
2007-04-04 00:00:00
Account Value: 10386.05
    Buy Price: 1439.37
    Num Shares: 7.0
    Remaining Value: 310.46
Sell Date: 
2007-06-25 00:00:00
    Sell Price: 1497.74
    Updated Value: 10794.64

-------------------------

Buy Date: 
2007-07-17 00:00:00
Account Value: 10794.64
    Buy Price: 1549.37
    Num Shares: 6.0
    Remaining Value: 1498.42
Sell Date: 
2007-08-06 00:00:00
    Sell Price: 1467.67
    Updated Value: 10304.44

-------------------------

Buy Date: 
2007-09-07 00:00:00
Account Value: 10304.44
    Buy Price: 1453.55
    Num Shares: 7.0
    Remaining Value: 129.59
Sell Date: 
2007-11-01 00:00:00
    Sell Price: 1508.44
    Updated Value: 10688.67

-------------------------

Buy Date: 
2007-12-17 00:00:00
Account Value: 10688.67
    Buy Price: 1445.9
    Num Shares: 7.0
    Remaining Value: 567.37
Sell Date: 
2008-01-07 00:00:00
    Sell Price: 1416.18
    Updated Value: 10480.63

-------------------------

Buy Date: 
2008-02-28 00:00:00
Account Value: 10480.63
    Buy Price: 1367.68
    Num Shares: 7.0
    Remaining Value: 906.87
Sell Date: 
2008-03-06 00:00:00
    Sell Price: 1304.34
    Updated Value: 10037.25

-------------------------

Buy Date: 
2008-04-08 00:00:00
Account Value: 10037.25
    Buy Price: 1365.54
    Num Shares: 7.0
    Remaining Value: 478.47
Sell Date: 
2008-06-06 00:00:00
    Sell Price: 1360.68
    Updated Value: 10003.23

-------------------------

Buy Date: 
2008-08-07 00:00:00
Account Value: 10003.23
    Buy Price: 1266.07
    Num Shares: 7.0
    Remaining Value: 1140.74
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 1267.79
    Updated Value: 10015.27

-------------------------

Buy Date: 
2008-12-17 00:00:00
Account Value: 10015.27
    Buy Price: 904.42
    Num Shares: 11.0
    Remaining Value: 66.65
Sell Date: 
2009-01-26 00:00:00
    Sell Price: 836.57
    Updated Value: 9268.92

-------------------------

Buy Date: 
2009-03-27 00:00:00
Account Value: 9268.92
    Buy Price: 815.94
    Num Shares: 11.0
    Remaining Value: 293.58
Sell Date: 
2009-07-02 00:00:00
    Sell Price: 896.42
    Updated Value: 10154.2

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 10154.2
    Buy Price: 982.18
    Num Shares: 10.0
    Remaining Value: 332.4
Sell Date: 
2009-11-11 00:00:00
    Sell Price: 1098.51
    Updated Value: 11317.5

-------------------------

Buy Date: 
2009-11-23 00:00:00
Account Value: 11317.5
    Buy Price: 1106.24
    Num Shares: 10.0
    Remaining Value: 255.1
Sell Date: 
2010-02-02 00:00:00
    Sell Price: 1103.32
    Updated Value: 11288.3

-------------------------

Buy Date: 
2010-03-03 00:00:00
Account Value: 11288.3
    Buy Price: 1118.79
    Num Shares: 10.0
    Remaining Value: 100.4
Sell Date: 
2010-05-12 00:00:00
    Sell Price: 1171.67
    Updated Value: 11817.1

-------------------------

Buy Date: 
2010-06-29 00:00:00
Account Value: 11817.1
    Buy Price: 1041.24
    Num Shares: 11.0
    Remaining Value: 363.46
Sell Date: 
2010-07-08 00:00:00
    Sell Price: 1070.25
    Updated Value: 12136.21

-------------------------

Buy Date: 
2010-07-27 00:00:00
Account Value: 12136.21
    Buy Price: 1113.84
    Num Shares: 10.0
    Remaining Value: 997.81
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 1047.22
    Updated Value: 11470.01

-------------------------

Buy Date: 
2010-09-17 00:00:00
Account Value: 11470.01
    Buy Price: 1125.59
    Num Shares: 10.0
    Remaining Value: 214.11
Sell Date: 
2010-12-02 00:00:00
    Sell Price: 1221.53
    Updated Value: 12429.41

-------------------------

Buy Date: 
2010-12-09 00:00:00
Account Value: 12429.41
    Buy Price: 1233.0
    Num Shares: 10.0
    Remaining Value: 99.41
Sell Date: 
2011-03-14 00:00:00
    Sell Price: 1296.39
    Updated Value: 13063.31

-------------------------

Buy Date: 
2011-04-07 00:00:00
Account Value: 13063.31
    Buy Price: 1333.51
    Num Shares: 9.0
    Remaining Value: 1061.72
Sell Date: 
2011-05-27 00:00:00
    Sell Price: 1331.1
    Updated Value: 13041.62

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 13041.62
    Buy Price: 1319.49
    Num Shares: 9.0
    Remaining Value: 1166.21
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 1200.07
    Updated Value: 11966.84

-------------------------

Buy Date: 
2011-09-13 00:00:00
Account Value: 11966.84
    Buy Price: 1172.87
    Num Shares: 10.0
    Remaining Value: 238.14
Sell Date: 
2011-10-03 00:00:00
    Sell Price: 1099.23
    Updated Value: 11230.44

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 11230.44
    Buy Price: 1254.19
    Num Shares: 8.0
    Remaining Value: 1196.92
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 1192.55
    Updated Value: 10737.32

-------------------------

Buy Date: 
2011-12-16 00:00:00
Account Value: 10737.32
    Buy Price: 1219.66
    Num Shares: 8.0
    Remaining Value: 980.04
Sell Date: 
2012-04-19 00:00:00
    Sell Price: 1376.92
    Updated Value: 11995.4

-------------------------

Buy Date: 
2012-05-15 00:00:00
Account Value: 11995.4
    Buy Price: 1330.66
    Num Shares: 9.0
    Remaining Value: 19.46
Sell Date: 
2012-05-17 00:00:00
    Sell Price: 1304.86
    Updated Value: 11763.2

-------------------------

Buy Date: 
2012-06-25 00:00:00
Account Value: 11763.2
    Buy Price: 1313.72
    Num Shares: 8.0
    Remaining Value: 1253.44
Sell Date: 
2012-10-17 00:00:00
    Sell Price: 1460.91
    Updated Value: 12940.72

-------------------------

Buy Date: 
2012-12-10 00:00:00
Account Value: 12940.72
    Buy Price: 1418.55
    Num Shares: 9.0
    Remaining Value: 173.77
Sell Date: 
2013-06-14 00:00:00
    Sell Price: 1626.73
    Updated Value: 14814.34

-------------------------

Buy Date: 
2013-07-16 00:00:00
Account Value: 14814.34
    Buy Price: 1676.26
    Num Shares: 8.0
    Remaining Value: 1404.26
Sell Date: 
2013-08-22 00:00:00
    Sell Price: 1656.96
    Updated Value: 14659.94

-------------------------

Buy Date: 
2013-09-20 00:00:00
Account Value: 14659.94
    Buy Price: 1709.91
    Num Shares: 8.0
    Remaining Value: 980.66
Sell Date: 
2013-10-16 00:00:00
    Sell Price: 1721.54
    Updated Value: 14752.98

-------------------------

Buy Date: 
2013-10-24 00:00:00
Account Value: 14752.98
    Buy Price: 1752.07
    Num Shares: 8.0
    Remaining Value: 736.42
Sell Date: 
2014-01-31 00:00:00
    Sell Price: 1782.59
    Updated Value: 14997.14

-------------------------

Buy Date: 
2014-02-27 00:00:00
Account Value: 14997.14
    Buy Price: 1854.29
    Num Shares: 8.0
    Remaining Value: 162.82
Sell Date: 
2014-04-10 00:00:00
    Sell Price: 1833.08
    Updated Value: 14827.46

-------------------------

Buy Date: 
2014-04-17 00:00:00
Account Value: 14827.46
    Buy Price: 1864.85
    Num Shares: 7.0
    Remaining Value: 1773.51
Sell Date: 
2014-04-23 00:00:00
    Sell Price: 1875.39
    Updated Value: 14901.24

-------------------------

Buy Date: 
2014-05-05 00:00:00
Account Value: 14901.24
    Buy Price: 1884.66
    Num Shares: 7.0
    Remaining Value: 1708.62
Sell Date: 
2014-08-06 00:00:00
    Sell Price: 1920.24
    Updated Value: 15150.3

-------------------------

Buy Date: 
2014-08-28 00:00:00
Account Value: 15150.3
    Buy Price: 1996.74
    Num Shares: 7.0
    Remaining Value: 1173.12
Sell Date: 
2014-09-29 00:00:00
    Sell Price: 1977.8
    Updated Value: 15017.72

-------------------------

Buy Date: 
2014-11-06 00:00:00
Account Value: 15017.72
    Buy Price: 2031.21
    Num Shares: 7.0
    Remaining Value: 799.25
Sell Date: 
2014-12-19 00:00:00
    Sell Price: 2070.65
    Updated Value: 15293.8

-------------------------

Buy Date: 
2015-01-08 00:00:00
Account Value: 15293.8
    Buy Price: 2062.14
    Num Shares: 7.0
    Remaining Value: 858.82
Sell Date: 
2015-01-20 00:00:00
    Sell Price: 2022.55
    Updated Value: 15016.67

-------------------------

Buy Date: 
2015-02-11 00:00:00
Account Value: 15016.67
    Buy Price: 2068.53
    Num Shares: 7.0
    Remaining Value: 536.96
Sell Date: 
2015-03-20 00:00:00
    Sell Price: 2108.06
    Updated Value: 15293.38


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15293.38





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-01 00:00:00
Account Value: 10000
    Buy Price: 1266.44
    Num Shares: 7.0
    Remaining Value: 1134.92
Sell Date: 
2001-06-25 00:00:00
    Sell Price: 1218.6
    Updated Value: 9665.12

-------------------------

Buy Date: 
2001-11-07 00:00:00
Account Value: 9665.12
    Buy Price: 1115.8
    Num Shares: 8.0
    Remaining Value: 738.72
Sell Date: 
2002-01-28 00:00:00
    Sell Price: 1133.06
    Updated Value: 9803.2

-------------------------

Buy Date: 
2002-03-14 00:00:00
Account Value: 9803.2
    Buy Price: 1153.04
    Num Shares: 8.0
    Remaining Value: 578.88
Sell Date: 
2002-04-19 00:00:00
    Sell Price: 1125.17
    Updated Value: 9580.24

-------------------------

Buy Date: 
2002-08-29 00:00:00
Account Value: 9580.24
    Buy Price: 917.8
    Num Shares: 10.0
    Remaining Value: 402.24
Sell Date: 
2002-09-20 00:00:00
    Sell Price: 845.39
    Updated Value: 8856.14

-------------------------

Buy Date: 
2002-11-01 00:00:00
Account Value: 8856.14
    Buy Price: 900.96
    Num Shares: 9.0
    Remaining Value: 747.5
Sell Date: 
2002-12-26 00:00:00
    Sell Price: 889.66
    Updated Value: 8754.44

-------------------------

Buy Date: 
2003-01-21 00:00:00
Account Value: 8754.44
    Buy Price: 887.62
    Num Shares: 9.0
    Remaining Value: 765.86
Sell Date: 
2003-01-28 00:00:00
    Sell Price: 858.54
    Updated Value: 8492.72

-------------------------

Buy Date: 
2003-03-31 00:00:00
Account Value: 8492.72
    Buy Price: 848.18
    Num Shares: 10.0
    Remaining Value: 10.92
Sell Date: 
2003-08-06 00:00:00
    Sell Price: 967.08
    Updated Value: 9681.72

-------------------------

Buy Date: 
2003-08-28 00:00:00
Account Value: 9681.72
    Buy Price: 1002.84
    Num Shares: 9.0
    Remaining Value: 656.16
Sell Date: 
2004-03-19 00:00:00
    Sell Price: 1109.78
    Updated Value: 10644.18

-------------------------

Buy Date: 
2004-04-21 00:00:00
Account Value: 10644.18
    Buy Price: 1124.09
    Num Shares: 9.0
    Remaining Value: 527.37
Sell Date: 
2004-04-30 00:00:00
    Sell Price: 1107.3
    Updated Value: 10493.07

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 10493.07
    Buy Price: 1133.56
    Num Shares: 9.0
    Remaining Value: 291.03
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 1096.84
    Updated Value: 10162.59

-------------------------

Buy Date: 
2004-09-09 00:00:00
Account Value: 10162.59
    Buy Price: 1118.38
    Num Shares: 9.0
    Remaining Value: 97.17
Sell Date: 
2004-10-28 00:00:00
    Sell Price: 1127.44
    Updated Value: 10244.13

-------------------------

Buy Date: 
2004-11-08 00:00:00
Account Value: 10244.13
    Buy Price: 1164.89
    Num Shares: 8.0
    Remaining Value: 925.01
Sell Date: 
2005-01-24 00:00:00
    Sell Price: 1163.75
    Updated Value: 10235.01

-------------------------

Buy Date: 
2005-02-17 00:00:00
Account Value: 10235.01
    Buy Price: 1200.75
    Num Shares: 8.0
    Remaining Value: 629.01
Sell Date: 
2005-03-30 00:00:00
    Sell Price: 1181.41
    Updated Value: 10080.29

-------------------------

Buy Date: 
2005-05-24 00:00:00
Account Value: 10080.29
    Buy Price: 1194.07
    Num Shares: 8.0
    Remaining Value: 527.73
Sell Date: 
2005-09-02 00:00:00
    Sell Price: 1218.02
    Updated Value: 10271.89

-------------------------

Buy Date: 
2005-09-21 00:00:00
Account Value: 10271.89
    Buy Price: 1210.2
    Num Shares: 8.0
    Remaining Value: 590.29
Sell Date: 
2005-09-29 00:00:00
    Sell Price: 1227.68
    Updated Value: 10411.73

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 10411.73
    Buy Price: 1231.21
    Num Shares: 8.0
    Remaining Value: 562.05
Sell Date: 
2006-02-23 00:00:00
    Sell Price: 1287.79
    Updated Value: 10864.37

-------------------------

Buy Date: 
2006-02-27 00:00:00
Account Value: 10864.37
    Buy Price: 1294.12
    Num Shares: 8.0
    Remaining Value: 511.41
Sell Date: 
2006-05-24 00:00:00
    Sell Price: 1258.57
    Updated Value: 10579.97

-------------------------

Buy Date: 
2006-08-07 00:00:00
Account Value: 10579.97
    Buy Price: 1275.77
    Num Shares: 8.0
    Remaining Value: 373.81
Sell Date: 
2007-03-12 00:00:00
    Sell Price: 1406.6
    Updated Value: 11626.61

-------------------------

Buy Date: 
2007-04-10 00:00:00
Account Value: 11626.61
    Buy Price: 1448.39
    Num Shares: 8.0
    Remaining Value: 39.49
Sell Date: 
2007-07-11 00:00:00
    Sell Price: 1518.76
    Updated Value: 12189.57

-------------------------

Buy Date: 
2007-07-16 00:00:00
Account Value: 12189.57
    Buy Price: 1549.52
    Num Shares: 7.0
    Remaining Value: 1342.93
Sell Date: 
2007-08-03 00:00:00
    Sell Price: 1433.06
    Updated Value: 11374.35

-------------------------

Buy Date: 
2007-09-24 00:00:00
Account Value: 11374.35
    Buy Price: 1517.73
    Num Shares: 7.0
    Remaining Value: 750.24
Sell Date: 
2007-11-13 00:00:00
    Sell Price: 1481.05
    Updated Value: 11117.59

-------------------------

Buy Date: 
2008-04-10 00:00:00
Account Value: 11117.59
    Buy Price: 1360.55
    Num Shares: 8.0
    Remaining Value: 233.19
Sell Date: 
2008-06-12 00:00:00
    Sell Price: 1339.87
    Updated Value: 10952.15

-------------------------

Buy Date: 
2008-08-25 00:00:00
Account Value: 10952.15
    Buy Price: 1266.84
    Num Shares: 8.0
    Remaining Value: 817.43
Sell Date: 
2008-09-15 00:00:00
    Sell Price: 1192.7
    Updated Value: 10359.03

-------------------------

Buy Date: 
2009-01-07 00:00:00
Account Value: 10359.03
    Buy Price: 906.65
    Num Shares: 11.0
    Remaining Value: 385.88
Sell Date: 
2009-01-08 00:00:00
    Sell Price: 909.73
    Updated Value: 10392.91

-------------------------

Buy Date: 
2009-01-13 00:00:00
Account Value: 10392.91
    Buy Price: 871.79
    Num Shares: 11.0
    Remaining Value: 803.22
Sell Date: 
2009-01-28 00:00:00
    Sell Price: 874.09
    Updated Value: 10418.21

-------------------------

Buy Date: 
2009-04-03 00:00:00
Account Value: 10418.21
    Buy Price: 842.5
    Num Shares: 12.0
    Remaining Value: 308.21
Sell Date: 
2009-07-09 00:00:00
    Sell Price: 882.68
    Updated Value: 10900.37

-------------------------

Buy Date: 
2009-07-28 00:00:00
Account Value: 10900.37
    Buy Price: 979.62
    Num Shares: 11.0
    Remaining Value: 124.55
Sell Date: 
2010-02-05 00:00:00
    Sell Price: 1066.19
    Updated Value: 11852.64

-------------------------

Buy Date: 
2010-03-10 00:00:00
Account Value: 11852.64
    Buy Price: 1145.61
    Num Shares: 10.0
    Remaining Value: 396.54
Sell Date: 
2010-05-17 00:00:00
    Sell Price: 1136.94
    Updated Value: 11765.94

-------------------------

Buy Date: 
2010-07-28 00:00:00
Account Value: 11765.94
    Buy Price: 1106.13
    Num Shares: 10.0
    Remaining Value: 704.64
Sell Date: 
2010-08-30 00:00:00
    Sell Price: 1048.92
    Updated Value: 11193.84

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 11193.84
    Buy Price: 1142.71
    Num Shares: 9.0
    Remaining Value: 909.45
Sell Date: 
2011-03-24 00:00:00
    Sell Price: 1309.66
    Updated Value: 12696.39

-------------------------

Buy Date: 
2011-04-08 00:00:00
Account Value: 12696.39
    Buy Price: 1328.17
    Num Shares: 9.0
    Remaining Value: 742.86
Sell Date: 
2011-06-03 00:00:00
    Sell Price: 1300.16
    Updated Value: 12444.3

-------------------------

Buy Date: 
2011-07-18 00:00:00
Account Value: 12444.3
    Buy Price: 1305.44
    Num Shares: 9.0
    Remaining Value: 695.34
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 1119.46
    Updated Value: 10770.48

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 10770.48
    Buy Price: 1254.19
    Num Shares: 8.0
    Remaining Value: 736.96
Sell Date: 
2011-12-09 00:00:00
    Sell Price: 1255.19
    Updated Value: 10778.48

-------------------------

Buy Date: 
2011-12-16 00:00:00
Account Value: 10778.48
    Buy Price: 1219.66
    Num Shares: 8.0
    Remaining Value: 1021.2
Sell Date: 
2011-12-29 00:00:00
    Sell Price: 1263.02
    Updated Value: 11125.36

-------------------------

Buy Date: 
2012-01-05 00:00:00
Account Value: 11125.36
    Buy Price: 1281.06
    Num Shares: 8.0
    Remaining Value: 876.88
Sell Date: 
2012-04-27 00:00:00
    Sell Price: 1403.36
    Updated Value: 12103.76

-------------------------

Buy Date: 
2012-05-02 00:00:00
Account Value: 12103.76
    Buy Price: 1402.31
    Num Shares: 8.0
    Remaining Value: 885.28
Sell Date: 
2012-05-03 00:00:00
    Sell Price: 1391.57
    Updated Value: 12017.84

-------------------------

Buy Date: 
2012-05-04 00:00:00
Account Value: 12017.84
    Buy Price: 1369.1
    Num Shares: 8.0
    Remaining Value: 1065.04
Sell Date: 
2012-05-08 00:00:00
    Sell Price: 1363.72
    Updated Value: 11974.8

-------------------------

Buy Date: 
2012-07-06 00:00:00
Account Value: 11974.8
    Buy Price: 1354.68
    Num Shares: 8.0
    Remaining Value: 1137.36
Sell Date: 
2012-11-02 00:00:00
    Sell Price: 1414.2
    Updated Value: 12450.96

-------------------------

Buy Date: 
2012-12-19 00:00:00
Account Value: 12450.96
    Buy Price: 1435.81
    Num Shares: 8.0
    Remaining Value: 964.48
Sell Date: 
2013-07-01 00:00:00
    Sell Price: 1614.96
    Updated Value: 13884.16

-------------------------

Buy Date: 
2013-07-18 00:00:00
Account Value: 13884.16
    Buy Price: 1689.37
    Num Shares: 8.0
    Remaining Value: 369.2
Sell Date: 
2013-09-03 00:00:00
    Sell Price: 1639.77
    Updated Value: 13487.36

-------------------------

Buy Date: 
2013-09-24 00:00:00
Account Value: 13487.36
    Buy Price: 1697.42
    Num Shares: 7.0
    Remaining Value: 1605.42
Sell Date: 
2014-02-06 00:00:00
    Sell Price: 1773.43
    Updated Value: 14019.43

-------------------------

Buy Date: 
2014-02-27 00:00:00
Account Value: 14019.43
    Buy Price: 1854.29
    Num Shares: 7.0
    Remaining Value: 1039.4
Sell Date: 
2014-04-25 00:00:00
    Sell Price: 1863.4
    Updated Value: 14083.2

-------------------------

Buy Date: 
2014-05-05 00:00:00
Account Value: 14083.2
    Buy Price: 1884.66
    Num Shares: 7.0
    Remaining Value: 890.58
Sell Date: 
2014-08-13 00:00:00
    Sell Price: 1946.72
    Updated Value: 14517.62

-------------------------

Buy Date: 
2014-08-29 00:00:00
Account Value: 14517.62
    Buy Price: 2003.37
    Num Shares: 7.0
    Remaining Value: 494.03
Sell Date: 
2014-10-10 00:00:00
    Sell Price: 1906.13
    Updated Value: 13836.94

-------------------------

Buy Date: 
2014-11-10 00:00:00
Account Value: 13836.94
    Buy Price: 2038.26
    Num Shares: 6.0
    Remaining Value: 1607.38
Sell Date: 
2015-01-20 00:00:00
    Sell Price: 2022.55
    Updated Value: 13742.68

-------------------------

Buy Date: 
2015-02-18 00:00:00
Account Value: 13742.68
    Buy Price: 2099.68
    Num Shares: 6.0
    Remaining Value: 1144.6
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 13756.96


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 13756.96





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-15 00:00:00
Account Value: 10000
    Buy Price: 1249.44
    Num Shares: 8.0
    Remaining Value: 4.48
Sell Date: 
2001-07-11 00:00:00
    Sell Price: 1180.18
    Updated Value: 9445.92

-------------------------

Buy Date: 
2001-11-21 00:00:00
Account Value: 9445.92
    Buy Price: 1137.03
    Num Shares: 8.0
    Remaining Value: 349.68
Sell Date: 
2002-02-06 00:00:00
    Sell Price: 1083.51
    Updated Value: 9017.76

-------------------------

Buy Date: 
2002-03-15 00:00:00
Account Value: 9017.76
    Buy Price: 1166.16
    Num Shares: 7.0
    Remaining Value: 854.64
Sell Date: 
2002-04-15 00:00:00
    Sell Price: 1102.55
    Updated Value: 8572.49

-------------------------

Buy Date: 
2002-11-01 00:00:00
Account Value: 8572.49
    Buy Price: 900.96
    Num Shares: 9.0
    Remaining Value: 463.85
Sell Date: 
2003-01-31 00:00:00
    Sell Price: 855.7
    Updated Value: 8165.15

-------------------------

Buy Date: 
2003-04-07 00:00:00
Account Value: 8165.15
    Buy Price: 879.93
    Num Shares: 9.0
    Remaining Value: 245.78
Sell Date: 
2004-03-26 00:00:00
    Sell Price: 1108.06
    Updated Value: 10218.32

-------------------------

Buy Date: 
2004-04-19 00:00:00
Account Value: 10218.32
    Buy Price: 1135.82
    Num Shares: 8.0
    Remaining Value: 1131.76
Sell Date: 
2004-04-28 00:00:00
    Sell Price: 1122.41
    Updated Value: 10111.04

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 10111.04
    Buy Price: 1133.56
    Num Shares: 8.0
    Remaining Value: 1042.56
Sell Date: 
2004-07-19 00:00:00
    Sell Price: 1100.9
    Updated Value: 9849.76

-------------------------

Buy Date: 
2004-09-17 00:00:00
Account Value: 9849.76
    Buy Price: 1128.55
    Num Shares: 8.0
    Remaining Value: 821.36
Sell Date: 
2005-03-29 00:00:00
    Sell Price: 1165.36
    Updated Value: 10144.24

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 10144.24
    Buy Price: 1197.51
    Num Shares: 8.0
    Remaining Value: 564.16
Sell Date: 
2005-10-06 00:00:00
    Sell Price: 1191.49
    Updated Value: 10096.08

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10096.08
    Buy Price: 1242.8
    Num Shares: 8.0
    Remaining Value: 153.68
Sell Date: 
2006-05-30 00:00:00
    Sell Price: 1259.87
    Updated Value: 10232.64

-------------------------

Buy Date: 
2006-08-15 00:00:00
Account Value: 10232.64
    Buy Price: 1285.58
    Num Shares: 7.0
    Remaining Value: 1233.58
Sell Date: 
2007-03-13 00:00:00
    Sell Price: 1377.95
    Updated Value: 10879.23

-------------------------

Buy Date: 
2007-04-09 00:00:00
Account Value: 10879.23
    Buy Price: 1444.61
    Num Shares: 7.0
    Remaining Value: 766.96
Sell Date: 
2007-08-06 00:00:00
    Sell Price: 1467.67
    Updated Value: 11040.65

-------------------------

Buy Date: 
2007-10-01 00:00:00
Account Value: 11040.65
    Buy Price: 1547.04
    Num Shares: 7.0
    Remaining Value: 211.37
Sell Date: 
2007-11-20 00:00:00
    Sell Price: 1439.7
    Updated Value: 10289.27

-------------------------

Buy Date: 
2008-04-18 00:00:00
Account Value: 10289.27
    Buy Price: 1390.33
    Num Shares: 7.0
    Remaining Value: 556.96
Sell Date: 
2008-06-24 00:00:00
    Sell Price: 1314.29
    Updated Value: 9756.99

-------------------------

Buy Date: 
2009-04-16 00:00:00
Account Value: 9756.99
    Buy Price: 865.3
    Num Shares: 11.0
    Remaining Value: 238.69
Sell Date: 
2010-02-09 00:00:00
    Sell Price: 1070.52
    Updated Value: 12014.41

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 12014.41
    Buy Price: 1140.45
    Num Shares: 10.0
    Remaining Value: 609.91
Sell Date: 
2010-05-24 00:00:00
    Sell Price: 1073.65
    Updated Value: 11346.41

-------------------------

Buy Date: 
2010-08-11 00:00:00
Account Value: 11346.41
    Buy Price: 1089.47
    Num Shares: 10.0
    Remaining Value: 451.71
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 1047.22
    Updated Value: 10923.91

-------------------------

Buy Date: 
2010-09-17 00:00:00
Account Value: 10923.91
    Buy Price: 1125.59
    Num Shares: 9.0
    Remaining Value: 793.6
Sell Date: 
2011-06-09 00:00:00
    Sell Price: 1289.0
    Updated Value: 12394.6

-------------------------

Buy Date: 
2011-07-19 00:00:00
Account Value: 12394.6
    Buy Price: 1326.73
    Num Shares: 9.0
    Remaining Value: 454.03
Sell Date: 
2011-07-29 00:00:00
    Sell Price: 1292.28
    Updated Value: 12084.55

-------------------------

Buy Date: 
2011-10-28 00:00:00
Account Value: 12084.55
    Buy Price: 1285.09
    Num Shares: 9.0
    Remaining Value: 518.74
Sell Date: 
2012-05-18 00:00:00
    Sell Price: 1295.22
    Updated Value: 12175.72

-------------------------

Buy Date: 
2012-07-19 00:00:00
Account Value: 12175.72
    Buy Price: 1376.51
    Num Shares: 8.0
    Remaining Value: 1163.64
Sell Date: 
2012-11-12 00:00:00
    Sell Price: 1380.03
    Updated Value: 12203.88

-------------------------

Buy Date: 
2013-01-03 00:00:00
Account Value: 12203.88
    Buy Price: 1459.37
    Num Shares: 8.0
    Remaining Value: 528.92
Sell Date: 
2013-09-05 00:00:00
    Sell Price: 1655.08
    Updated Value: 13769.56

-------------------------

Buy Date: 
2013-09-10 00:00:00
Account Value: 13769.56
    Buy Price: 1683.99
    Num Shares: 8.0
    Remaining Value: 297.64
Sell Date: 
2014-02-11 00:00:00
    Sell Price: 1819.75
    Updated Value: 14855.64

-------------------------

Buy Date: 
2014-02-25 00:00:00
Account Value: 14855.64
    Buy Price: 1845.12
    Num Shares: 8.0
    Remaining Value: 94.68
Sell Date: 
2014-10-10 00:00:00
    Sell Price: 1906.13
    Updated Value: 15343.72

-------------------------

Buy Date: 
2014-11-07 00:00:00
Account Value: 15343.72
    Buy Price: 2031.92
    Num Shares: 7.0
    Remaining Value: 1120.28
Sell Date: 
2015-02-17 00:00:00
    Sell Price: 2100.34
    Updated Value: 15822.66

-------------------------

Buy Date: 
2015-02-18 00:00:00
Account Value: 15822.66
    Buy Price: 2099.68
    Num Shares: 7.0
    Remaining Value: 1124.9
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 15839.32


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15839.32





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 1312.83
    Num Shares: 7.0
    Remaining Value: 810.19
Sell Date: 
2001-06-15 00:00:00
    Sell Price: 1214.36
    Updated Value: 9310.71

-------------------------

Buy Date: 
2002-01-04 00:00:00
Account Value: 9310.71
    Buy Price: 1172.51
    Num Shares: 7.0
    Remaining Value: 1103.14
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1096.22
    Updated Value: 8776.68

-------------------------

Buy Date: 
2002-03-04 00:00:00
Account Value: 8776.68
    Buy Price: 1153.84
    Num Shares: 7.0
    Remaining Value: 699.8
Sell Date: 
2002-04-19 00:00:00
    Sell Price: 1125.17
    Updated Value: 8575.99

-------------------------

Buy Date: 
2002-12-04 00:00:00
Account Value: 8575.99
    Buy Price: 917.58
    Num Shares: 9.0
    Remaining Value: 317.77
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 848.2
    Updated Value: 7951.57

-------------------------

Buy Date: 
2003-04-28 00:00:00
Account Value: 7951.57
    Buy Price: 914.84
    Num Shares: 8.0
    Remaining Value: 632.85
Sell Date: 
2004-05-18 00:00:00
    Sell Price: 1091.49
    Updated Value: 9364.77

-------------------------

Buy Date: 
2004-06-17 00:00:00
Account Value: 9364.77
    Buy Price: 1132.05
    Num Shares: 8.0
    Remaining Value: 308.37
Sell Date: 
2004-07-14 00:00:00
    Sell Price: 1111.47
    Updated Value: 9200.13

-------------------------

Buy Date: 
2004-09-20 00:00:00
Account Value: 9200.13
    Buy Price: 1122.2
    Num Shares: 8.0
    Remaining Value: 222.53
Sell Date: 
2005-04-15 00:00:00
    Sell Price: 1142.62
    Updated Value: 9363.49

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 9363.49
    Buy Price: 1197.51
    Num Shares: 7.0
    Remaining Value: 980.92
Sell Date: 
2005-10-19 00:00:00
    Sell Price: 1195.76
    Updated Value: 9351.24

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 9351.24
    Buy Price: 1231.21
    Num Shares: 7.0
    Remaining Value: 732.77
Sell Date: 
2006-06-01 00:00:00
    Sell Price: 1285.71
    Updated Value: 9732.74

-------------------------

Buy Date: 
2006-08-29 00:00:00
Account Value: 9732.74
    Buy Price: 1304.28
    Num Shares: 7.0
    Remaining Value: 602.78
Sell Date: 
2007-08-15 00:00:00
    Sell Price: 1406.7
    Updated Value: 10449.68

-------------------------

Buy Date: 
2007-09-28 00:00:00
Account Value: 10449.68
    Buy Price: 1526.75
    Num Shares: 6.0
    Remaining Value: 1289.18
Sell Date: 
2007-11-16 00:00:00
    Sell Price: 1458.74
    Updated Value: 10041.62

-------------------------

Buy Date: 
2008-05-14 00:00:00
Account Value: 10041.62
    Buy Price: 1408.66
    Num Shares: 7.0
    Remaining Value: 181.0
Sell Date: 
2008-06-13 00:00:00
    Sell Price: 1360.03
    Updated Value: 9701.21

-------------------------

Buy Date: 
2008-06-16 00:00:00
Account Value: 9701.21
    Buy Price: 1360.14
    Num Shares: 7.0
    Remaining Value: 180.23
Sell Date: 
2008-06-17 00:00:00
    Sell Price: 1350.93
    Updated Value: 9636.74

-------------------------

Buy Date: 
2009-04-29 00:00:00
Account Value: 9636.74
    Buy Price: 873.64
    Num Shares: 11.0
    Remaining Value: 26.7
Sell Date: 
2010-05-26 00:00:00
    Sell Price: 1067.95
    Updated Value: 11774.15

-------------------------

Buy Date: 
2010-09-28 00:00:00
Account Value: 11774.15
    Buy Price: 1147.7
    Num Shares: 10.0
    Remaining Value: 297.15
Sell Date: 
2011-06-16 00:00:00
    Sell Price: 1267.64
    Updated Value: 12973.55

-------------------------

Buy Date: 
2011-07-18 00:00:00
Account Value: 12973.55
    Buy Price: 1305.44
    Num Shares: 9.0
    Remaining Value: 1224.59
Sell Date: 
2011-08-02 00:00:00
    Sell Price: 1254.05
    Updated Value: 12511.04

-------------------------

Buy Date: 
2011-11-15 00:00:00
Account Value: 12511.04
    Buy Price: 1257.81
    Num Shares: 9.0
    Remaining Value: 1190.75
Sell Date: 
2011-11-18 00:00:00
    Sell Price: 1215.65
    Updated Value: 12131.6

-------------------------

Buy Date: 
2011-12-19 00:00:00
Account Value: 12131.6
    Buy Price: 1205.35
    Num Shares: 10.0
    Remaining Value: 78.1
Sell Date: 
2012-06-01 00:00:00
    Sell Price: 1278.04
    Updated Value: 12858.5

-------------------------

Buy Date: 
2012-07-20 00:00:00
Account Value: 12858.5
    Buy Price: 1362.66
    Num Shares: 9.0
    Remaining Value: 594.56
Sell Date: 
2012-07-23 00:00:00
    Sell Price: 1350.52
    Updated Value: 12749.24

-------------------------

Buy Date: 
2012-08-02 00:00:00
Account Value: 12749.24
    Buy Price: 1365.0
    Num Shares: 9.0
    Remaining Value: 464.24
Sell Date: 
2012-11-28 00:00:00
    Sell Price: 1409.93
    Updated Value: 13153.61

-------------------------

Buy Date: 
2012-12-05 00:00:00
Account Value: 13153.61
    Buy Price: 1409.28
    Num Shares: 9.0
    Remaining Value: 470.09
Sell Date: 
2014-10-17 00:00:00
    Sell Price: 1886.76
    Updated Value: 17450.93

-------------------------

Buy Date: 
2014-11-06 00:00:00
Account Value: 17450.93
    Buy Price: 2031.21
    Num Shares: 8.0
    Remaining Value: 1201.25
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 18017.73


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 18017.73





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-04 00:00:00
Account Value: 10000
    Buy Price: 1266.61
    Num Shares: 7.0
    Remaining Value: 1133.73
Sell Date: 
2001-07-02 00:00:00
    Sell Price: 1236.72
    Updated Value: 9790.77

-------------------------

Buy Date: 
2002-03-21 00:00:00
Account Value: 9790.77
    Buy Price: 1153.59
    Num Shares: 8.0
    Remaining Value: 562.05
Sell Date: 
2002-04-09 00:00:00
    Sell Price: 1117.8
    Updated Value: 9504.45

-------------------------

Buy Date: 
2003-04-23 00:00:00
Account Value: 9504.45
    Buy Price: 919.02
    Num Shares: 10.0
    Remaining Value: 314.25
Sell Date: 
2004-08-03 00:00:00
    Sell Price: 1099.69
    Updated Value: 11311.15

-------------------------

Buy Date: 
2004-09-21 00:00:00
Account Value: 11311.15
    Buy Price: 1129.3
    Num Shares: 10.0
    Remaining Value: 18.15
Sell Date: 
2004-10-01 00:00:00
    Sell Price: 1131.5
    Updated Value: 11333.15

-------------------------

Buy Date: 
2004-10-20 00:00:00
Account Value: 11333.15
    Buy Price: 1103.66
    Num Shares: 10.0
    Remaining Value: 296.55
Sell Date: 
2004-10-22 00:00:00
    Sell Price: 1095.74
    Updated Value: 11253.95

-------------------------

Buy Date: 
2004-11-09 00:00:00
Account Value: 11253.95
    Buy Price: 1164.08
    Num Shares: 9.0
    Remaining Value: 777.23
Sell Date: 
2005-10-21 00:00:00
    Sell Price: 1179.59
    Updated Value: 11393.54

-------------------------

Buy Date: 
2005-11-08 00:00:00
Account Value: 11393.54
    Buy Price: 1218.59
    Num Shares: 9.0
    Remaining Value: 426.23
Sell Date: 
2006-06-22 00:00:00
    Sell Price: 1245.6
    Updated Value: 11636.63

-------------------------

Buy Date: 
2006-07-12 00:00:00
Account Value: 11636.63
    Buy Price: 1258.6
    Num Shares: 9.0
    Remaining Value: 309.23
Sell Date: 
2006-07-25 00:00:00
    Sell Price: 1268.88
    Updated Value: 11729.15

-------------------------

Buy Date: 
2006-08-10 00:00:00
Account Value: 11729.15
    Buy Price: 1271.81
    Num Shares: 9.0
    Remaining Value: 282.86
Sell Date: 
2007-08-29 00:00:00
    Sell Price: 1463.76
    Updated Value: 13456.7

-------------------------

Buy Date: 
2007-09-06 00:00:00
Account Value: 13456.7
    Buy Price: 1478.55
    Num Shares: 9.0
    Remaining Value: 149.75
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 1416.77
    Updated Value: 12900.68

-------------------------

Buy Date: 
2009-06-17 00:00:00
Account Value: 12900.68
    Buy Price: 910.71
    Num Shares: 14.0
    Remaining Value: 150.74
Sell Date: 
2010-06-07 00:00:00
    Sell Price: 1050.47
    Updated Value: 14857.32

-------------------------

Buy Date: 
2010-09-28 00:00:00
Account Value: 14857.32
    Buy Price: 1147.7
    Num Shares: 12.0
    Remaining Value: 1084.92
Sell Date: 
2011-08-11 00:00:00
    Sell Price: 1172.64
    Updated Value: 15156.6

-------------------------

Buy Date: 
2012-01-13 00:00:00
Account Value: 15156.6
    Buy Price: 1289.09
    Num Shares: 11.0
    Remaining Value: 976.61
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 24099.27


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 24099.27





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-02 00:00:00
Account Value: 10000
    Buy Price: 1267.43
    Num Shares: 7.0
    Remaining Value: 1127.99
Sell Date: 
2001-07-20 00:00:00
    Sell Price: 1210.85
    Updated Value: 9603.94

-------------------------

Buy Date: 
2003-05-12 00:00:00
Account Value: 9603.94
    Buy Price: 945.11
    Num Shares: 10.0
    Remaining Value: 152.84
Sell Date: 
2004-08-20 00:00:00
    Sell Price: 1098.35
    Updated Value: 11136.34

-------------------------

Buy Date: 
2004-09-01 00:00:00
Account Value: 11136.34
    Buy Price: 1105.91
    Num Shares: 10.0
    Remaining Value: 77.24
Sell Date: 
2005-10-24 00:00:00
    Sell Price: 1199.38
    Updated Value: 12071.04

-------------------------

Buy Date: 
2005-11-08 00:00:00
Account Value: 12071.04
    Buy Price: 1218.59
    Num Shares: 9.0
    Remaining Value: 1103.73
Sell Date: 
2006-06-27 00:00:00
    Sell Price: 1239.2
    Updated Value: 12256.53

-------------------------

Buy Date: 
2006-07-05 00:00:00
Account Value: 12256.53
    Buy Price: 1270.91
    Num Shares: 9.0
    Remaining Value: 818.34
Sell Date: 
2007-11-27 00:00:00
    Sell Price: 1428.23
    Updated Value: 13672.41

-------------------------

Buy Date: 
2007-12-14 00:00:00
Account Value: 13672.41
    Buy Price: 1467.95
    Num Shares: 9.0
    Remaining Value: 460.86
Sell Date: 
2008-01-03 00:00:00
    Sell Price: 1447.16
    Updated Value: 13485.3

-------------------------

Buy Date: 
2009-08-04 00:00:00
Account Value: 13485.3
    Buy Price: 1005.65
    Num Shares: 13.0
    Remaining Value: 411.85
Sell Date: 
2010-07-09 00:00:00
    Sell Price: 1077.96
    Updated Value: 14425.33

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 14425.33
    Buy Price: 1101.6
    Num Shares: 13.0
    Remaining Value: 104.53
Sell Date: 
2010-08-25 00:00:00
    Sell Price: 1055.33
    Updated Value: 13823.82

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 13823.82
    Buy Price: 1134.28
    Num Shares: 12.0
    Remaining Value: 212.46
Sell Date: 
2011-08-16 00:00:00
    Sell Price: 1192.76
    Updated Value: 14525.58

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 14525.58
    Buy Price: 1315.38
    Num Shares: 11.0
    Remaining Value: 56.4
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23179.06


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23179.06





-----------------------------------------------------------------------
^GSPC Calculations, N = [15, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 1249.46
    Num Shares: 8.0
    Remaining Value: 4.32
Sell Date: 
2001-07-25 00:00:00
    Sell Price: 1190.49
    Updated Value: 9528.24

-------------------------

Buy Date: 
2001-07-31 00:00:00
Account Value: 9528.24
    Buy Price: 1211.23
    Num Shares: 7.0
    Remaining Value: 1049.63
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 1183.43
    Updated Value: 9333.64

-------------------------

Buy Date: 
2001-08-14 00:00:00
Account Value: 9333.64
    Buy Price: 1186.73
    Num Shares: 7.0
    Remaining Value: 1026.53
Sell Date: 
2001-08-17 00:00:00
    Sell Price: 1161.97
    Updated Value: 9160.32

-------------------------

Buy Date: 
2003-06-06 00:00:00
Account Value: 9160.32
    Buy Price: 987.76
    Num Shares: 9.0
    Remaining Value: 270.48
Sell Date: 
2008-01-11 00:00:00
    Sell Price: 1401.02
    Updated Value: 12879.66

-------------------------

Buy Date: 
2009-08-31 00:00:00
Account Value: 12879.66
    Buy Price: 1020.62
    Num Shares: 12.0
    Remaining Value: 632.22
Sell Date: 
2010-09-08 00:00:00
    Sell Price: 1098.87
    Updated Value: 13818.66

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 13818.66
    Buy Price: 1125.07
    Num Shares: 12.0
    Remaining Value: 317.82
Sell Date: 
2011-08-19 00:00:00
    Sell Price: 1123.53
    Updated Value: 13800.18

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 13800.18
    Buy Price: 1275.92
    Num Shares: 10.0
    Remaining Value: 1040.98
Sell Date: 
2011-11-18 00:00:00
    Sell Price: 1215.65
    Updated Value: 13197.48

-------------------------

Buy Date: 
2012-01-12 00:00:00
Account Value: 13197.48
    Buy Price: 1295.5
    Num Shares: 10.0
    Remaining Value: 242.48
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21263.08


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21263.08





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-05 00:00:00
Account Value: 10000
    Buy Price: 1354.31
    Num Shares: 7.0
    Remaining Value: 519.83
Sell Date: 
2001-02-23 00:00:00
    Sell Price: 1245.86
    Updated Value: 9240.85

-------------------------

Buy Date: 
2001-04-23 00:00:00
Account Value: 9240.85
    Buy Price: 1224.36
    Num Shares: 7.0
    Remaining Value: 670.33
Sell Date: 
2001-06-20 00:00:00
    Sell Price: 1223.14
    Updated Value: 9232.31

-------------------------

Buy Date: 
2001-10-22 00:00:00
Account Value: 9232.31
    Buy Price: 1089.9
    Num Shares: 8.0
    Remaining Value: 513.11
Sell Date: 
2001-12-26 00:00:00
    Sell Price: 1149.37
    Updated Value: 9708.07

-------------------------

Buy Date: 
2001-12-28 00:00:00
Account Value: 9708.07
    Buy Price: 1161.02
    Num Shares: 8.0
    Remaining Value: 419.91
Sell Date: 
2002-01-07 00:00:00
    Sell Price: 1164.89
    Updated Value: 9739.03

-------------------------

Buy Date: 
2002-01-14 00:00:00
Account Value: 9739.03
    Buy Price: 1138.41
    Num Shares: 8.0
    Remaining Value: 631.75
Sell Date: 
2002-01-31 00:00:00
    Sell Price: 1130.2
    Updated Value: 9673.35

-------------------------

Buy Date: 
2002-03-08 00:00:00
Account Value: 9673.35
    Buy Price: 1164.31
    Num Shares: 8.0
    Remaining Value: 358.87
Sell Date: 
2002-04-11 00:00:00
    Sell Price: 1103.69
    Updated Value: 9188.39

-------------------------

Buy Date: 
2002-06-05 00:00:00
Account Value: 9188.39
    Buy Price: 1049.9
    Num Shares: 8.0
    Remaining Value: 789.19
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 1009.56
    Updated Value: 8865.67

-------------------------

Buy Date: 
2002-08-21 00:00:00
Account Value: 8865.67
    Buy Price: 949.36
    Num Shares: 9.0
    Remaining Value: 321.43
Sell Date: 
2002-09-19 00:00:00
    Sell Price: 843.32
    Updated Value: 7911.31

-------------------------

Buy Date: 
2002-10-30 00:00:00
Account Value: 7911.31
    Buy Price: 890.71
    Num Shares: 8.0
    Remaining Value: 785.63
Sell Date: 
2002-12-27 00:00:00
    Sell Price: 875.4
    Updated Value: 7788.83

-------------------------

Buy Date: 
2003-01-21 00:00:00
Account Value: 7788.83
    Buy Price: 887.62
    Num Shares: 8.0
    Remaining Value: 687.87
Sell Date: 
2003-02-05 00:00:00
    Sell Price: 843.59
    Updated Value: 7436.59

-------------------------

Buy Date: 
2003-03-20 00:00:00
Account Value: 7436.59
    Buy Price: 875.67
    Num Shares: 8.0
    Remaining Value: 431.23
Sell Date: 
2003-03-21 00:00:00
    Sell Price: 895.79
    Updated Value: 7597.55

-------------------------

Buy Date: 
2003-03-24 00:00:00
Account Value: 7597.55
    Buy Price: 864.23
    Num Shares: 8.0
    Remaining Value: 683.71
Sell Date: 
2003-03-28 00:00:00
    Sell Price: 863.5
    Updated Value: 7591.71

-------------------------

Buy Date: 
2003-04-01 00:00:00
Account Value: 7591.71
    Buy Price: 858.48
    Num Shares: 8.0
    Remaining Value: 723.87
Sell Date: 
2003-07-16 00:00:00
    Sell Price: 994.09
    Updated Value: 8676.59

-------------------------

Buy Date: 
2003-07-29 00:00:00
Account Value: 8676.59
    Buy Price: 989.28
    Num Shares: 8.0
    Remaining Value: 762.35
Sell Date: 
2003-08-08 00:00:00
    Sell Price: 977.59
    Updated Value: 8583.07

-------------------------

Buy Date: 
2003-09-03 00:00:00
Account Value: 8583.07
    Buy Price: 1026.27
    Num Shares: 8.0
    Remaining Value: 372.91
Sell Date: 
2003-10-16 00:00:00
    Sell Price: 1050.07
    Updated Value: 8773.47

-------------------------

Buy Date: 
2003-10-23 00:00:00
Account Value: 8773.47
    Buy Price: 1033.77
    Num Shares: 8.0
    Remaining Value: 503.31
Sell Date: 
2003-12-11 00:00:00
    Sell Price: 1071.21
    Updated Value: 9072.99

-------------------------

Buy Date: 
2003-12-16 00:00:00
Account Value: 9072.99
    Buy Price: 1075.13
    Num Shares: 8.0
    Remaining Value: 471.95
Sell Date: 
2004-03-17 00:00:00
    Sell Price: 1123.75
    Updated Value: 9461.95

-------------------------

Buy Date: 
2004-04-20 00:00:00
Account Value: 9461.95
    Buy Price: 1118.15
    Num Shares: 8.0
    Remaining Value: 516.75
Sell Date: 
2004-05-07 00:00:00
    Sell Price: 1098.7
    Updated Value: 9306.35

-------------------------

Buy Date: 
2004-06-14 00:00:00
Account Value: 9306.35
    Buy Price: 1125.29
    Num Shares: 8.0
    Remaining Value: 304.03
Sell Date: 
2004-07-15 00:00:00
    Sell Price: 1106.69
    Updated Value: 9157.55

-------------------------

Buy Date: 
2004-09-08 00:00:00
Account Value: 9157.55
    Buy Price: 1116.27
    Num Shares: 8.0
    Remaining Value: 227.39
Sell Date: 
2004-10-14 00:00:00
    Sell Price: 1103.29
    Updated Value: 9053.71

-------------------------

Buy Date: 
2004-10-26 00:00:00
Account Value: 9053.71
    Buy Price: 1111.09
    Num Shares: 8.0
    Remaining Value: 164.99
Sell Date: 
2004-11-03 00:00:00
    Sell Price: 1143.2
    Updated Value: 9310.59

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 9310.59
    Buy Price: 1183.81
    Num Shares: 7.0
    Remaining Value: 1023.92
Sell Date: 
2005-01-21 00:00:00
    Sell Price: 1167.87
    Updated Value: 9199.01

-------------------------

Buy Date: 
2005-02-18 00:00:00
Account Value: 9199.01
    Buy Price: 1201.59
    Num Shares: 7.0
    Remaining Value: 787.88
Sell Date: 
2005-03-30 00:00:00
    Sell Price: 1181.41
    Updated Value: 9057.75

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 9057.75
    Buy Price: 1189.28
    Num Shares: 7.0
    Remaining Value: 732.79
Sell Date: 
2005-07-20 00:00:00
    Sell Price: 1235.2
    Updated Value: 9379.19

-------------------------

Buy Date: 
2005-07-25 00:00:00
Account Value: 9379.19
    Buy Price: 1229.03
    Num Shares: 7.0
    Remaining Value: 775.98
Sell Date: 
2005-08-25 00:00:00
    Sell Price: 1212.37
    Updated Value: 9262.57

-------------------------

Buy Date: 
2005-09-23 00:00:00
Account Value: 9262.57
    Buy Price: 1215.29
    Num Shares: 7.0
    Remaining Value: 755.54
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 1187.33
    Updated Value: 9066.85

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 9066.85
    Buy Price: 1234.72
    Num Shares: 7.0
    Remaining Value: 423.81
Sell Date: 
2006-02-10 00:00:00
    Sell Price: 1266.99
    Updated Value: 9292.74

-------------------------

Buy Date: 
2006-03-03 00:00:00
Account Value: 9292.74
    Buy Price: 1287.23
    Num Shares: 7.0
    Remaining Value: 282.13
Sell Date: 
2006-04-24 00:00:00
    Sell Price: 1308.11
    Updated Value: 9438.9

-------------------------

Buy Date: 
2006-05-01 00:00:00
Account Value: 9438.9
    Buy Price: 1305.19
    Num Shares: 7.0
    Remaining Value: 302.57
Sell Date: 
2006-05-04 00:00:00
    Sell Price: 1312.25
    Updated Value: 9488.32

-------------------------

Buy Date: 
2006-05-08 00:00:00
Account Value: 9488.32
    Buy Price: 1324.66
    Num Shares: 7.0
    Remaining Value: 215.7
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 1272.88
    Updated Value: 9125.86

-------------------------

Buy Date: 
2006-07-17 00:00:00
Account Value: 9125.86
    Buy Price: 1234.49
    Num Shares: 7.0
    Remaining Value: 484.43
Sell Date: 
2006-08-03 00:00:00
    Sell Price: 1280.27
    Updated Value: 9446.32

-------------------------

Buy Date: 
2006-08-14 00:00:00
Account Value: 9446.32
    Buy Price: 1268.21
    Num Shares: 7.0
    Remaining Value: 568.85
Sell Date: 
2007-01-30 00:00:00
    Sell Price: 1428.82
    Updated Value: 10570.59

-------------------------

Buy Date: 
2007-01-31 00:00:00
Account Value: 10570.59
    Buy Price: 1438.24
    Num Shares: 7.0
    Remaining Value: 502.91
Sell Date: 
2007-03-09 00:00:00
    Sell Price: 1402.84
    Updated Value: 10322.79

-------------------------

Buy Date: 
2007-04-05 00:00:00
Account Value: 10322.79
    Buy Price: 1443.76
    Num Shares: 7.0
    Remaining Value: 216.47
Sell Date: 
2007-06-28 00:00:00
    Sell Price: 1505.71
    Updated Value: 10756.44

-------------------------

Buy Date: 
2007-07-12 00:00:00
Account Value: 10756.44
    Buy Price: 1547.7
    Num Shares: 6.0
    Remaining Value: 1470.24
Sell Date: 
2007-08-09 00:00:00
    Sell Price: 1453.09
    Updated Value: 10188.78

-------------------------

Buy Date: 
2007-09-13 00:00:00
Account Value: 10188.78
    Buy Price: 1483.95
    Num Shares: 6.0
    Remaining Value: 1285.08
Sell Date: 
2007-11-06 00:00:00
    Sell Price: 1520.27
    Updated Value: 10406.7

-------------------------

Buy Date: 
2007-12-19 00:00:00
Account Value: 10406.7
    Buy Price: 1453.0
    Num Shares: 7.0
    Remaining Value: 235.7
Sell Date: 
2008-01-09 00:00:00
    Sell Price: 1409.13
    Updated Value: 10099.61

-------------------------

Buy Date: 
2008-02-26 00:00:00
Account Value: 10099.61
    Buy Price: 1381.29
    Num Shares: 7.0
    Remaining Value: 430.58
Sell Date: 
2008-03-04 00:00:00
    Sell Price: 1326.75
    Updated Value: 9717.83

-------------------------

Buy Date: 
2008-04-10 00:00:00
Account Value: 9717.83
    Buy Price: 1360.55
    Num Shares: 7.0
    Remaining Value: 193.98
Sell Date: 
2008-06-06 00:00:00
    Sell Price: 1360.68
    Updated Value: 9718.74

-------------------------

Buy Date: 
2008-06-09 00:00:00
Account Value: 9718.74
    Buy Price: 1361.76
    Num Shares: 7.0
    Remaining Value: 186.42
Sell Date: 
2008-06-10 00:00:00
    Sell Price: 1358.44
    Updated Value: 9695.5

-------------------------

Buy Date: 
2008-08-11 00:00:00
Account Value: 9695.5
    Buy Price: 1305.32
    Num Shares: 7.0
    Remaining Value: 558.26
Sell Date: 
2008-09-10 00:00:00
    Sell Price: 1232.04
    Updated Value: 9182.54

-------------------------

Buy Date: 
2008-12-22 00:00:00
Account Value: 9182.54
    Buy Price: 871.63
    Num Shares: 10.0
    Remaining Value: 466.24
Sell Date: 
2009-01-20 00:00:00
    Sell Price: 805.22
    Updated Value: 8518.44

-------------------------

Buy Date: 
2009-01-26 00:00:00
Account Value: 8518.44
    Buy Price: 836.57
    Num Shares: 10.0
    Remaining Value: 152.74
Sell Date: 
2009-01-29 00:00:00
    Sell Price: 845.14
    Updated Value: 8604.14

-------------------------

Buy Date: 
2009-04-01 00:00:00
Account Value: 8604.14
    Buy Price: 811.08
    Num Shares: 10.0
    Remaining Value: 493.34
Sell Date: 
2009-07-07 00:00:00
    Sell Price: 881.03
    Updated Value: 9303.64

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 9303.64
    Buy Price: 982.18
    Num Shares: 9.0
    Remaining Value: 464.02
Sell Date: 
2009-11-16 00:00:00
    Sell Price: 1109.3
    Updated Value: 10447.72

-------------------------

Buy Date: 
2009-11-30 00:00:00
Account Value: 10447.72
    Buy Price: 1095.63
    Num Shares: 9.0
    Remaining Value: 587.05
Sell Date: 
2010-02-04 00:00:00
    Sell Price: 1063.11
    Updated Value: 10155.04

-------------------------

Buy Date: 
2010-03-08 00:00:00
Account Value: 10155.04
    Buy Price: 1138.5
    Num Shares: 8.0
    Remaining Value: 1047.04
Sell Date: 
2010-05-13 00:00:00
    Sell Price: 1157.44
    Updated Value: 10306.56

-------------------------

Buy Date: 
2010-07-06 00:00:00
Account Value: 10306.56
    Buy Price: 1028.06
    Num Shares: 10.0
    Remaining Value: 25.96
Sell Date: 
2010-07-15 00:00:00
    Sell Price: 1096.48
    Updated Value: 10990.76

-------------------------

Buy Date: 
2010-08-02 00:00:00
Account Value: 10990.76
    Buy Price: 1125.86
    Num Shares: 9.0
    Remaining Value: 858.02
Sell Date: 
2010-08-30 00:00:00
    Sell Price: 1048.92
    Updated Value: 10298.3

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 10298.3
    Buy Price: 1134.28
    Num Shares: 9.0
    Remaining Value: 89.78
Sell Date: 
2010-12-09 00:00:00
    Sell Price: 1233.0
    Updated Value: 11186.78

-------------------------

Buy Date: 
2010-12-17 00:00:00
Account Value: 11186.78
    Buy Price: 1243.91
    Num Shares: 8.0
    Remaining Value: 1235.5
Sell Date: 
2011-03-16 00:00:00
    Sell Price: 1256.88
    Updated Value: 11290.54

-------------------------

Buy Date: 
2011-04-13 00:00:00
Account Value: 11290.54
    Buy Price: 1314.41
    Num Shares: 8.0
    Remaining Value: 775.26
Sell Date: 
2011-06-01 00:00:00
    Sell Price: 1314.55
    Updated Value: 11291.66

-------------------------

Buy Date: 
2011-07-13 00:00:00
Account Value: 11291.66
    Buy Price: 1317.72
    Num Shares: 8.0
    Remaining Value: 749.9
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 1199.38
    Updated Value: 10344.94

-------------------------

Buy Date: 
2011-09-16 00:00:00
Account Value: 10344.94
    Buy Price: 1216.01
    Num Shares: 8.0
    Remaining Value: 616.86
Sell Date: 
2011-10-03 00:00:00
    Sell Price: 1099.23
    Updated Value: 9410.7

-------------------------

Buy Date: 
2011-10-27 00:00:00
Account Value: 9410.7
    Buy Price: 1284.59
    Num Shares: 7.0
    Remaining Value: 418.57
Sell Date: 
2011-11-29 00:00:00
    Sell Price: 1195.19
    Updated Value: 8784.9

-------------------------

Buy Date: 
2011-12-22 00:00:00
Account Value: 8784.9
    Buy Price: 1254.0
    Num Shares: 7.0
    Remaining Value: 6.89999999999
Sell Date: 
2012-04-23 00:00:00
    Sell Price: 1366.94
    Updated Value: 9575.48

-------------------------

Buy Date: 
2012-06-28 00:00:00
Account Value: 9575.48
    Buy Price: 1329.04
    Num Shares: 7.0
    Remaining Value: 272.2
Sell Date: 
2012-10-18 00:00:00
    Sell Price: 1457.34
    Updated Value: 10473.58

-------------------------

Buy Date: 
2012-12-14 00:00:00
Account Value: 10473.58
    Buy Price: 1413.58
    Num Shares: 7.0
    Remaining Value: 578.52
Sell Date: 
2013-06-19 00:00:00
    Sell Price: 1628.93
    Updated Value: 11981.03

-------------------------

Buy Date: 
2013-07-22 00:00:00
Account Value: 11981.03
    Buy Price: 1695.53
    Num Shares: 7.0
    Remaining Value: 112.32
Sell Date: 
2013-08-23 00:00:00
    Sell Price: 1663.5
    Updated Value: 11756.82

-------------------------

Buy Date: 
2013-09-24 00:00:00
Account Value: 11756.82
    Buy Price: 1697.42
    Num Shares: 6.0
    Remaining Value: 1572.3
Sell Date: 
2013-10-18 00:00:00
    Sell Price: 1744.5
    Updated Value: 12039.3

-------------------------

Buy Date: 
2013-10-29 00:00:00
Account Value: 12039.3
    Buy Price: 1771.95
    Num Shares: 6.0
    Remaining Value: 1407.6
Sell Date: 
2014-01-31 00:00:00
    Sell Price: 1782.59
    Updated Value: 12103.14

-------------------------

Buy Date: 
2014-03-04 00:00:00
Account Value: 12103.14
    Buy Price: 1873.91
    Num Shares: 6.0
    Remaining Value: 859.68
Sell Date: 
2014-04-08 00:00:00
    Sell Price: 1851.96
    Updated Value: 11971.44

-------------------------

Buy Date: 
2014-04-22 00:00:00
Account Value: 11971.44
    Buy Price: 1879.55
    Num Shares: 6.0
    Remaining Value: 694.14
Sell Date: 
2014-04-30 00:00:00
    Sell Price: 1883.95
    Updated Value: 11997.84

-------------------------

Buy Date: 
2014-05-12 00:00:00
Account Value: 11997.84
    Buy Price: 1896.65
    Num Shares: 6.0
    Remaining Value: 617.94
Sell Date: 
2014-08-07 00:00:00
    Sell Price: 1909.57
    Updated Value: 12075.36

-------------------------

Buy Date: 
2014-09-04 00:00:00
Account Value: 12075.36
    Buy Price: 1997.65
    Num Shares: 6.0
    Remaining Value: 89.46
Sell Date: 
2014-10-01 00:00:00
    Sell Price: 1946.16
    Updated Value: 11766.42

-------------------------

Buy Date: 
2014-11-11 00:00:00
Account Value: 11766.42
    Buy Price: 2039.68
    Num Shares: 5.0
    Remaining Value: 1568.02
Sell Date: 
2014-12-26 00:00:00
    Sell Price: 2088.77
    Updated Value: 12011.87

-------------------------

Buy Date: 
2015-01-14 00:00:00
Account Value: 12011.87
    Buy Price: 2011.27
    Num Shares: 5.0
    Remaining Value: 1955.52
Sell Date: 
2015-01-28 00:00:00
    Sell Price: 2002.16
    Updated Value: 11966.32

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 11966.32
    Buy Price: 2096.99
    Num Shares: 5.0
    Remaining Value: 1481.37
Sell Date: 
2015-03-24 00:00:00
    Sell Price: 2091.5
    Updated Value: 11938.87


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 11938.87





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-04 00:00:00
Account Value: 10000
    Buy Price: 1266.61
    Num Shares: 7.0
    Remaining Value: 1133.73
Sell Date: 
2001-06-26 00:00:00
    Sell Price: 1216.76
    Updated Value: 9651.05

-------------------------

Buy Date: 
2001-11-07 00:00:00
Account Value: 9651.05
    Buy Price: 1115.8
    Num Shares: 8.0
    Remaining Value: 724.65
Sell Date: 
2002-02-01 00:00:00
    Sell Price: 1122.2
    Updated Value: 9702.25

-------------------------

Buy Date: 
2002-03-19 00:00:00
Account Value: 9702.25
    Buy Price: 1170.29
    Num Shares: 8.0
    Remaining Value: 339.93
Sell Date: 
2002-04-23 00:00:00
    Sell Price: 1100.96
    Updated Value: 9147.61

-------------------------

Buy Date: 
2002-09-04 00:00:00
Account Value: 9147.61
    Buy Price: 893.4
    Num Shares: 10.0
    Remaining Value: 213.61
Sell Date: 
2002-09-26 00:00:00
    Sell Price: 854.95
    Updated Value: 8763.11

-------------------------

Buy Date: 
2002-11-06 00:00:00
Account Value: 8763.11
    Buy Price: 923.76
    Num Shares: 9.0
    Remaining Value: 449.27
Sell Date: 
2002-12-31 00:00:00
    Sell Price: 879.82
    Updated Value: 8367.65

-------------------------

Buy Date: 
2003-04-03 00:00:00
Account Value: 8367.65
    Buy Price: 876.45
    Num Shares: 9.0
    Remaining Value: 479.6
Sell Date: 
2003-08-11 00:00:00
    Sell Price: 980.59
    Updated Value: 9304.91

-------------------------

Buy Date: 
2003-09-03 00:00:00
Account Value: 9304.91
    Buy Price: 1026.27
    Num Shares: 9.0
    Remaining Value: 68.48
Sell Date: 
2004-03-22 00:00:00
    Sell Price: 1095.4
    Updated Value: 9927.08

-------------------------

Buy Date: 
2004-04-26 00:00:00
Account Value: 9927.08
    Buy Price: 1135.53
    Num Shares: 8.0
    Remaining Value: 842.84
Sell Date: 
2004-05-07 00:00:00
    Sell Price: 1098.7
    Updated Value: 9632.44

-------------------------

Buy Date: 
2004-06-21 00:00:00
Account Value: 9632.44
    Buy Price: 1130.3
    Num Shares: 8.0
    Remaining Value: 590.04
Sell Date: 
2004-07-27 00:00:00
    Sell Price: 1094.83
    Updated Value: 9348.68

-------------------------

Buy Date: 
2004-09-13 00:00:00
Account Value: 9348.68
    Buy Price: 1125.82
    Num Shares: 8.0
    Remaining Value: 342.12
Sell Date: 
2004-11-03 00:00:00
    Sell Price: 1143.2
    Updated Value: 9487.72

-------------------------

Buy Date: 
2004-11-11 00:00:00
Account Value: 9487.72
    Buy Price: 1173.48
    Num Shares: 8.0
    Remaining Value: 99.88
Sell Date: 
2005-01-27 00:00:00
    Sell Price: 1174.55
    Updated Value: 9496.28

-------------------------

Buy Date: 
2005-02-25 00:00:00
Account Value: 9496.28
    Buy Price: 1211.37
    Num Shares: 7.0
    Remaining Value: 1016.69
Sell Date: 
2005-04-05 00:00:00
    Sell Price: 1181.39
    Updated Value: 9286.42

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 9286.42
    Buy Price: 1197.62
    Num Shares: 7.0
    Remaining Value: 903.08
Sell Date: 
2005-09-09 00:00:00
    Sell Price: 1241.48
    Updated Value: 9593.44

-------------------------

Buy Date: 
2005-09-30 00:00:00
Account Value: 9593.44
    Buy Price: 1228.81
    Num Shares: 7.0
    Remaining Value: 991.77
Sell Date: 
2005-10-05 00:00:00
    Sell Price: 1196.39
    Updated Value: 9366.5

-------------------------

Buy Date: 
2005-11-18 00:00:00
Account Value: 9366.5
    Buy Price: 1248.27
    Num Shares: 7.0
    Remaining Value: 628.61
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 1272.88
    Updated Value: 9538.77

-------------------------

Buy Date: 
2006-07-26 00:00:00
Account Value: 9538.77
    Buy Price: 1268.4
    Num Shares: 7.0
    Remaining Value: 659.97
Sell Date: 
2006-08-03 00:00:00
    Sell Price: 1280.27
    Updated Value: 9621.86

-------------------------

Buy Date: 
2006-08-10 00:00:00
Account Value: 9621.86
    Buy Price: 1271.81
    Num Shares: 7.0
    Remaining Value: 719.19
Sell Date: 
2007-03-15 00:00:00
    Sell Price: 1392.28
    Updated Value: 10465.15

-------------------------

Buy Date: 
2007-04-16 00:00:00
Account Value: 10465.15
    Buy Price: 1468.33
    Num Shares: 7.0
    Remaining Value: 186.84
Sell Date: 
2007-08-06 00:00:00
    Sell Price: 1467.67
    Updated Value: 10460.53

-------------------------

Buy Date: 
2007-09-26 00:00:00
Account Value: 10460.53
    Buy Price: 1525.42
    Num Shares: 6.0
    Remaining Value: 1308.01
Sell Date: 
2007-11-14 00:00:00
    Sell Price: 1470.58
    Updated Value: 10131.49

-------------------------

Buy Date: 
2008-04-15 00:00:00
Account Value: 10131.49
    Buy Price: 1334.43
    Num Shares: 7.0
    Remaining Value: 790.48
Sell Date: 
2008-06-17 00:00:00
    Sell Price: 1350.93
    Updated Value: 10246.99

-------------------------

Buy Date: 
2008-08-27 00:00:00
Account Value: 10246.99
    Buy Price: 1281.66
    Num Shares: 7.0
    Remaining Value: 1275.37
Sell Date: 
2008-09-17 00:00:00
    Sell Price: 1156.39
    Updated Value: 9370.1

-------------------------

Buy Date: 
2009-01-12 00:00:00
Account Value: 9370.1
    Buy Price: 870.26
    Num Shares: 10.0
    Remaining Value: 667.5
Sell Date: 
2009-02-03 00:00:00
    Sell Price: 838.51
    Updated Value: 9052.6

-------------------------

Buy Date: 
2009-04-08 00:00:00
Account Value: 9052.6
    Buy Price: 825.16
    Num Shares: 10.0
    Remaining Value: 801.0
Sell Date: 
2009-07-13 00:00:00
    Sell Price: 901.05
    Updated Value: 9811.5

-------------------------

Buy Date: 
2009-07-23 00:00:00
Account Value: 9811.5
    Buy Price: 976.29
    Num Shares: 10.0
    Remaining Value: 48.6
Sell Date: 
2009-07-24 00:00:00
    Sell Price: 979.26
    Updated Value: 9841.2

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 9841.2
    Buy Price: 982.18
    Num Shares: 10.0
    Remaining Value: 19.4
Sell Date: 
2009-07-28 00:00:00
    Sell Price: 979.62
    Updated Value: 9815.6

-------------------------

Buy Date: 
2009-07-30 00:00:00
Account Value: 9815.6
    Buy Price: 986.75
    Num Shares: 9.0
    Remaining Value: 934.85
Sell Date: 
2010-02-09 00:00:00
    Sell Price: 1070.52
    Updated Value: 10569.53

-------------------------

Buy Date: 
2010-03-15 00:00:00
Account Value: 10569.53
    Buy Price: 1150.51
    Num Shares: 9.0
    Remaining Value: 214.94
Sell Date: 
2010-05-20 00:00:00
    Sell Price: 1071.59
    Updated Value: 9859.25

-------------------------

Buy Date: 
2010-08-02 00:00:00
Account Value: 9859.25
    Buy Price: 1125.86
    Num Shares: 8.0
    Remaining Value: 852.37
Sell Date: 
2010-09-07 00:00:00
    Sell Price: 1091.84
    Updated Value: 9587.09

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 9587.09
    Buy Price: 1148.67
    Num Shares: 8.0
    Remaining Value: 397.73
Sell Date: 
2011-03-28 00:00:00
    Sell Price: 1310.19
    Updated Value: 10879.25

-------------------------

Buy Date: 
2011-04-15 00:00:00
Account Value: 10879.25
    Buy Price: 1319.68
    Num Shares: 8.0
    Remaining Value: 321.81
Sell Date: 
2011-06-07 00:00:00
    Sell Price: 1284.94
    Updated Value: 10601.33

-------------------------

Buy Date: 
2011-07-21 00:00:00
Account Value: 10601.33
    Buy Price: 1343.8
    Num Shares: 7.0
    Remaining Value: 1194.73
Sell Date: 
2011-08-10 00:00:00
    Sell Price: 1120.76
    Updated Value: 9040.05

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 9040.05
    Buy Price: 1242.0
    Num Shares: 7.0
    Remaining Value: 346.05
Sell Date: 
2011-12-14 00:00:00
    Sell Price: 1211.82
    Updated Value: 8828.79

-------------------------

Buy Date: 
2011-12-27 00:00:00
Account Value: 8828.79
    Buy Price: 1265.43
    Num Shares: 6.0
    Remaining Value: 1236.21
Sell Date: 
2012-05-03 00:00:00
    Sell Price: 1391.57
    Updated Value: 9585.63

-------------------------

Buy Date: 
2012-07-11 00:00:00
Account Value: 9585.63
    Buy Price: 1341.45
    Num Shares: 7.0
    Remaining Value: 195.48
Sell Date: 
2012-11-06 00:00:00
    Sell Price: 1428.39
    Updated Value: 10194.21

-------------------------

Buy Date: 
2012-12-20 00:00:00
Account Value: 10194.21
    Buy Price: 1443.69
    Num Shares: 7.0
    Remaining Value: 88.38
Sell Date: 
2013-07-01 00:00:00
    Sell Price: 1614.96
    Updated Value: 11393.1

-------------------------

Buy Date: 
2013-07-24 00:00:00
Account Value: 11393.1
    Buy Price: 1685.94
    Num Shares: 6.0
    Remaining Value: 1277.46
Sell Date: 
2013-09-06 00:00:00
    Sell Price: 1655.17
    Updated Value: 11208.48

-------------------------

Buy Date: 
2013-09-30 00:00:00
Account Value: 11208.48
    Buy Price: 1681.55
    Num Shares: 6.0
    Remaining Value: 1119.18
Sell Date: 
2014-02-11 00:00:00
    Sell Price: 1819.75
    Updated Value: 12037.68

-------------------------

Buy Date: 
2014-03-06 00:00:00
Account Value: 12037.68
    Buy Price: 1877.03
    Num Shares: 6.0
    Remaining Value: 775.5
Sell Date: 
2014-05-02 00:00:00
    Sell Price: 1881.14
    Updated Value: 12062.34

-------------------------

Buy Date: 
2014-05-12 00:00:00
Account Value: 12062.34
    Buy Price: 1896.65
    Num Shares: 6.0
    Remaining Value: 682.44
Sell Date: 
2014-08-15 00:00:00
    Sell Price: 1955.06
    Updated Value: 12412.8

-------------------------

Buy Date: 
2014-09-05 00:00:00
Account Value: 12412.8
    Buy Price: 2007.71
    Num Shares: 6.0
    Remaining Value: 366.54
Sell Date: 
2014-10-15 00:00:00
    Sell Price: 1862.49
    Updated Value: 11541.48

-------------------------

Buy Date: 
2014-11-13 00:00:00
Account Value: 11541.48
    Buy Price: 2039.33
    Num Shares: 5.0
    Remaining Value: 1344.83
Sell Date: 
2015-01-12 00:00:00
    Sell Price: 2028.26
    Updated Value: 11486.13

-------------------------

Buy Date: 
2015-01-13 00:00:00
Account Value: 11486.13
    Buy Price: 2023.03
    Num Shares: 5.0
    Remaining Value: 1370.98
Sell Date: 
2015-01-23 00:00:00
    Sell Price: 2051.82
    Updated Value: 11630.08

-------------------------

Buy Date: 
2015-02-18 00:00:00
Account Value: 11630.08
    Buy Price: 2099.68
    Num Shares: 5.0
    Remaining Value: 1131.68
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 11641.98


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 11641.98





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-16 00:00:00
Account Value: 10000
    Buy Price: 1284.99
    Num Shares: 7.0
    Remaining Value: 1005.07
Sell Date: 
2001-07-11 00:00:00
    Sell Price: 1180.18
    Updated Value: 9266.33

-------------------------

Buy Date: 
2001-11-27 00:00:00
Account Value: 9266.33
    Buy Price: 1149.5
    Num Shares: 8.0
    Remaining Value: 70.33
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1096.22
    Updated Value: 8840.09

-------------------------

Buy Date: 
2002-03-21 00:00:00
Account Value: 8840.09
    Buy Price: 1153.59
    Num Shares: 7.0
    Remaining Value: 764.96
Sell Date: 
2002-04-19 00:00:00
    Sell Price: 1125.17
    Updated Value: 8641.15

-------------------------

Buy Date: 
2002-11-08 00:00:00
Account Value: 8641.15
    Buy Price: 894.74
    Num Shares: 9.0
    Remaining Value: 588.49
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 848.2
    Updated Value: 8222.29

-------------------------

Buy Date: 
2003-04-11 00:00:00
Account Value: 8222.29
    Buy Price: 868.3
    Num Shares: 9.0
    Remaining Value: 407.59
Sell Date: 
2004-04-01 00:00:00
    Sell Price: 1132.17
    Updated Value: 10597.12

-------------------------

Buy Date: 
2004-04-27 00:00:00
Account Value: 10597.12
    Buy Price: 1138.11
    Num Shares: 9.0
    Remaining Value: 354.13
Sell Date: 
2004-04-30 00:00:00
    Sell Price: 1107.3
    Updated Value: 10319.83

-------------------------

Buy Date: 
2004-06-22 00:00:00
Account Value: 10319.83
    Buy Price: 1134.41
    Num Shares: 9.0
    Remaining Value: 110.14
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 1096.84
    Updated Value: 9981.7

-------------------------

Buy Date: 
2004-09-22 00:00:00
Account Value: 9981.7
    Buy Price: 1113.56
    Num Shares: 8.0
    Remaining Value: 1073.22
Sell Date: 
2005-04-04 00:00:00
    Sell Price: 1176.12
    Updated Value: 10482.18

-------------------------

Buy Date: 
2005-06-09 00:00:00
Account Value: 10482.18
    Buy Price: 1200.93
    Num Shares: 8.0
    Remaining Value: 874.74
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 1187.33
    Updated Value: 10373.38

-------------------------

Buy Date: 
2005-11-22 00:00:00
Account Value: 10373.38
    Buy Price: 1261.23
    Num Shares: 8.0
    Remaining Value: 283.54
Sell Date: 
2006-06-01 00:00:00
    Sell Price: 1285.71
    Updated Value: 10569.22

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 10569.22
    Buy Price: 1302.3
    Num Shares: 8.0
    Remaining Value: 150.82
Sell Date: 
2007-03-19 00:00:00
    Sell Price: 1402.06
    Updated Value: 11367.3

-------------------------

Buy Date: 
2007-04-13 00:00:00
Account Value: 11367.3
    Buy Price: 1452.85
    Num Shares: 7.0
    Remaining Value: 1197.35
Sell Date: 
2007-08-09 00:00:00
    Sell Price: 1453.09
    Updated Value: 11368.98

-------------------------

Buy Date: 
2007-10-03 00:00:00
Account Value: 11368.98
    Buy Price: 1539.59
    Num Shares: 7.0
    Remaining Value: 591.85
Sell Date: 
2007-11-26 00:00:00
    Sell Price: 1407.22
    Updated Value: 10442.39

-------------------------

Buy Date: 
2008-04-23 00:00:00
Account Value: 10442.39
    Buy Price: 1379.93
    Num Shares: 7.0
    Remaining Value: 782.88
Sell Date: 
2008-06-26 00:00:00
    Sell Price: 1283.15
    Updated Value: 9764.93

-------------------------

Buy Date: 
2009-04-20 00:00:00
Account Value: 9764.93
    Buy Price: 832.39
    Num Shares: 11.0
    Remaining Value: 608.64
Sell Date: 
2010-02-16 00:00:00
    Sell Price: 1094.87
    Updated Value: 12652.21

-------------------------

Buy Date: 
2010-03-12 00:00:00
Account Value: 12652.21
    Buy Price: 1149.99
    Num Shares: 11.0
    Remaining Value: 2.32
Sell Date: 
2010-05-27 00:00:00
    Sell Price: 1103.06
    Updated Value: 12135.98

-------------------------

Buy Date: 
2010-08-16 00:00:00
Account Value: 12135.98
    Buy Price: 1079.38
    Num Shares: 11.0
    Remaining Value: 262.8
Sell Date: 
2010-09-03 00:00:00
    Sell Price: 1104.51
    Updated Value: 12412.41

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 12412.41
    Buy Price: 1134.28
    Num Shares: 10.0
    Remaining Value: 1069.61
Sell Date: 
2011-06-13 00:00:00
    Sell Price: 1271.83
    Updated Value: 13787.91

-------------------------

Buy Date: 
2011-07-26 00:00:00
Account Value: 13787.91
    Buy Price: 1331.94
    Num Shares: 10.0
    Remaining Value: 468.51
Sell Date: 
2011-08-03 00:00:00
    Sell Price: 1260.34
    Updated Value: 13071.91

-------------------------

Buy Date: 
2011-11-02 00:00:00
Account Value: 13071.91
    Buy Price: 1237.9
    Num Shares: 10.0
    Remaining Value: 692.91
Sell Date: 
2012-05-21 00:00:00
    Sell Price: 1315.99
    Updated Value: 13852.81

-------------------------

Buy Date: 
2012-07-25 00:00:00
Account Value: 13852.81
    Buy Price: 1337.89
    Num Shares: 10.0
    Remaining Value: 473.91
Sell Date: 
2012-11-15 00:00:00
    Sell Price: 1353.33
    Updated Value: 14007.21

-------------------------

Buy Date: 
2013-01-04 00:00:00
Account Value: 14007.21
    Buy Price: 1466.47
    Num Shares: 9.0
    Remaining Value: 808.98
Sell Date: 
2014-02-19 00:00:00
    Sell Price: 1828.75
    Updated Value: 17267.73

-------------------------

Buy Date: 
2014-03-04 00:00:00
Account Value: 17267.73
    Buy Price: 1873.91
    Num Shares: 9.0
    Remaining Value: 402.54
Sell Date: 
2014-10-15 00:00:00
    Sell Price: 1862.49
    Updated Value: 17164.95

-------------------------

Buy Date: 
2014-11-13 00:00:00
Account Value: 17164.95
    Buy Price: 2039.33
    Num Shares: 8.0
    Remaining Value: 850.31
Sell Date: 
2015-02-06 00:00:00
    Sell Price: 2055.47
    Updated Value: 17294.07

-------------------------

Buy Date: 
2015-02-17 00:00:00
Account Value: 17294.07
    Buy Price: 2100.34
    Num Shares: 8.0
    Remaining Value: 491.35
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17307.83


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17307.83





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-23 00:00:00
Account Value: 10000
    Buy Price: 1289.05
    Num Shares: 7.0
    Remaining Value: 976.65
Sell Date: 
2001-06-20 00:00:00
    Sell Price: 1223.14
    Updated Value: 9538.63

-------------------------

Buy Date: 
2001-12-31 00:00:00
Account Value: 9538.63
    Buy Price: 1148.08
    Num Shares: 8.0
    Remaining Value: 353.99
Sell Date: 
2002-02-22 00:00:00
    Sell Price: 1089.84
    Updated Value: 9072.71

-------------------------

Buy Date: 
2002-03-06 00:00:00
Account Value: 9072.71
    Buy Price: 1162.77
    Num Shares: 7.0
    Remaining Value: 933.32
Sell Date: 
2002-04-23 00:00:00
    Sell Price: 1100.96
    Updated Value: 8640.04

-------------------------

Buy Date: 
2002-12-09 00:00:00
Account Value: 8640.04
    Buy Price: 892.0
    Num Shares: 9.0
    Remaining Value: 612.04
Sell Date: 
2003-02-07 00:00:00
    Sell Price: 829.69
    Updated Value: 8079.25

-------------------------

Buy Date: 
2003-04-30 00:00:00
Account Value: 8079.25
    Buy Price: 916.92
    Num Shares: 8.0
    Remaining Value: 743.89
Sell Date: 
2004-05-21 00:00:00
    Sell Price: 1093.56
    Updated Value: 9492.37

-------------------------

Buy Date: 
2004-06-24 00:00:00
Account Value: 9492.37
    Buy Price: 1140.65
    Num Shares: 8.0
    Remaining Value: 367.17
Sell Date: 
2004-07-15 00:00:00
    Sell Price: 1106.69
    Updated Value: 9220.69

-------------------------

Buy Date: 
2004-09-28 00:00:00
Account Value: 9220.69
    Buy Price: 1110.06
    Num Shares: 8.0
    Remaining Value: 340.21
Sell Date: 
2005-04-15 00:00:00
    Sell Price: 1142.62
    Updated Value: 9481.17

-------------------------

Buy Date: 
2005-06-13 00:00:00
Account Value: 9481.17
    Buy Price: 1200.82
    Num Shares: 7.0
    Remaining Value: 1075.43
Sell Date: 
2005-10-21 00:00:00
    Sell Price: 1179.59
    Updated Value: 9332.56

-------------------------

Buy Date: 
2005-11-21 00:00:00
Account Value: 9332.56
    Buy Price: 1254.85
    Num Shares: 7.0
    Remaining Value: 548.61
Sell Date: 
2006-06-07 00:00:00
    Sell Price: 1256.15
    Updated Value: 9341.66

-------------------------

Buy Date: 
2006-08-30 00:00:00
Account Value: 9341.66
    Buy Price: 1305.37
    Num Shares: 7.0
    Remaining Value: 204.07
Sell Date: 
2007-08-20 00:00:00
    Sell Price: 1445.55
    Updated Value: 10322.92

-------------------------

Buy Date: 
2007-10-03 00:00:00
Account Value: 10322.92
    Buy Price: 1539.59
    Num Shares: 6.0
    Remaining Value: 1085.38
Sell Date: 
2007-11-19 00:00:00
    Sell Price: 1433.27
    Updated Value: 9685.0

-------------------------

Buy Date: 
2008-05-19 00:00:00
Account Value: 9685.0
    Buy Price: 1426.63
    Num Shares: 6.0
    Remaining Value: 1125.22
Sell Date: 
2008-06-20 00:00:00
    Sell Price: 1317.93
    Updated Value: 9032.8

-------------------------

Buy Date: 
2009-05-04 00:00:00
Account Value: 9032.8
    Buy Price: 907.24
    Num Shares: 9.0
    Remaining Value: 867.64
Sell Date: 
2010-06-01 00:00:00
    Sell Price: 1070.71
    Updated Value: 10504.03

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 10504.03
    Buy Price: 1146.24
    Num Shares: 9.0
    Remaining Value: 187.87
Sell Date: 
2011-06-20 00:00:00
    Sell Price: 1278.36
    Updated Value: 11693.11

-------------------------

Buy Date: 
2011-07-22 00:00:00
Account Value: 11693.11
    Buy Price: 1345.02
    Num Shares: 8.0
    Remaining Value: 932.95
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 1200.07
    Updated Value: 10533.51

-------------------------

Buy Date: 
2011-11-18 00:00:00
Account Value: 10533.51
    Buy Price: 1215.65
    Num Shares: 8.0
    Remaining Value: 808.31
Sell Date: 
2011-11-21 00:00:00
    Sell Price: 1192.98
    Updated Value: 10352.15

-------------------------

Buy Date: 
2011-11-22 00:00:00
Account Value: 10352.15
    Buy Price: 1188.04
    Num Shares: 8.0
    Remaining Value: 847.83
Sell Date: 
2011-11-25 00:00:00
    Sell Price: 1158.67
    Updated Value: 10117.19

-------------------------

Buy Date: 
2011-12-23 00:00:00
Account Value: 10117.19
    Buy Price: 1265.33
    Num Shares: 7.0
    Remaining Value: 1259.88
Sell Date: 
2012-06-06 00:00:00
    Sell Price: 1315.13
    Updated Value: 10465.79

-------------------------

Buy Date: 
2012-08-08 00:00:00
Account Value: 10465.79
    Buy Price: 1402.22
    Num Shares: 7.0
    Remaining Value: 650.25
Sell Date: 
2012-12-05 00:00:00
    Sell Price: 1409.28
    Updated Value: 10515.21

-------------------------

Buy Date: 
2012-12-12 00:00:00
Account Value: 10515.21
    Buy Price: 1428.48
    Num Shares: 7.0
    Remaining Value: 515.85
Sell Date: 
2014-10-22 00:00:00
    Sell Price: 1927.11
    Updated Value: 14005.62

-------------------------

Buy Date: 
2014-11-12 00:00:00
Account Value: 14005.62
    Buy Price: 2038.25
    Num Shares: 6.0
    Remaining Value: 1776.12
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 14388.48


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 14388.48





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 1255.18
    Num Shares: 7.0
    Remaining Value: 1213.74
Sell Date: 
2001-07-09 00:00:00
    Sell Price: 1198.78
    Updated Value: 9605.2

-------------------------

Buy Date: 
2002-03-27 00:00:00
Account Value: 9605.2
    Buy Price: 1144.58
    Num Shares: 8.0
    Remaining Value: 448.56
Sell Date: 
2002-04-15 00:00:00
    Sell Price: 1102.55
    Updated Value: 9268.96

-------------------------

Buy Date: 
2003-04-29 00:00:00
Account Value: 9268.96
    Buy Price: 917.84
    Num Shares: 10.0
    Remaining Value: 90.56
Sell Date: 
2004-08-05 00:00:00
    Sell Price: 1080.7
    Updated Value: 10897.56

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 10897.56
    Buy Price: 1142.05
    Num Shares: 9.0
    Remaining Value: 619.11
Sell Date: 
2004-10-11 00:00:00
    Sell Price: 1124.39
    Updated Value: 10738.62

-------------------------

Buy Date: 
2004-11-11 00:00:00
Account Value: 10738.62
    Buy Price: 1173.48
    Num Shares: 9.0
    Remaining Value: 177.3
Sell Date: 
2005-10-27 00:00:00
    Sell Price: 1178.9
    Updated Value: 10787.4

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10787.4
    Buy Price: 1234.72
    Num Shares: 8.0
    Remaining Value: 909.64
Sell Date: 
2006-06-28 00:00:00
    Sell Price: 1246.0
    Updated Value: 10877.64

-------------------------

Buy Date: 
2006-07-27 00:00:00
Account Value: 10877.64
    Buy Price: 1263.2
    Num Shares: 8.0
    Remaining Value: 772.04
Sell Date: 
2006-07-28 00:00:00
    Sell Price: 1278.55
    Updated Value: 11000.44

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 11000.44
    Buy Price: 1302.3
    Num Shares: 8.0
    Remaining Value: 582.04
Sell Date: 
2007-09-06 00:00:00
    Sell Price: 1478.55
    Updated Value: 12410.44

-------------------------

Buy Date: 
2007-09-12 00:00:00
Account Value: 12410.44
    Buy Price: 1471.56
    Num Shares: 8.0
    Remaining Value: 637.96
Sell Date: 
2007-11-28 00:00:00
    Sell Price: 1469.02
    Updated Value: 12390.12

-------------------------

Buy Date: 
2009-06-22 00:00:00
Account Value: 12390.12
    Buy Price: 893.04
    Num Shares: 13.0
    Remaining Value: 780.6
Sell Date: 
2010-06-11 00:00:00
    Sell Price: 1091.6
    Updated Value: 14971.4

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 14971.4
    Buy Price: 1146.24
    Num Shares: 13.0
    Remaining Value: 70.28
Sell Date: 
2011-08-15 00:00:00
    Sell Price: 1204.49
    Updated Value: 15728.65

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 15728.65
    Buy Price: 1314.5
    Num Shares: 11.0
    Remaining Value: 1269.15
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 24391.81


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 24391.81





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-07 00:00:00
Account Value: 10000
    Buy Price: 1263.51
    Num Shares: 7.0
    Remaining Value: 1155.43
Sell Date: 
2001-07-24 00:00:00
    Sell Price: 1171.65
    Updated Value: 9356.98

-------------------------

Buy Date: 
2003-05-14 00:00:00
Account Value: 9356.98
    Buy Price: 939.28
    Num Shares: 9.0
    Remaining Value: 903.46
Sell Date: 
2004-08-27 00:00:00
    Sell Price: 1107.77
    Updated Value: 10873.39

-------------------------

Buy Date: 
2004-09-07 00:00:00
Account Value: 10873.39
    Buy Price: 1121.3
    Num Shares: 9.0
    Remaining Value: 781.69
Sell Date: 
2005-10-28 00:00:00
    Sell Price: 1198.41
    Updated Value: 11567.38

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 11567.38
    Buy Price: 1230.96
    Num Shares: 9.0
    Remaining Value: 488.74
Sell Date: 
2006-07-07 00:00:00
    Sell Price: 1265.48
    Updated Value: 11878.06

-------------------------

Buy Date: 
2006-07-11 00:00:00
Account Value: 11878.06
    Buy Price: 1272.43
    Num Shares: 9.0
    Remaining Value: 426.19
Sell Date: 
2007-12-03 00:00:00
    Sell Price: 1472.42
    Updated Value: 13677.97

-------------------------

Buy Date: 
2007-12-24 00:00:00
Account Value: 13677.97
    Buy Price: 1496.45
    Num Shares: 9.0
    Remaining Value: 209.92
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 1390.19
    Updated Value: 12721.63

-------------------------

Buy Date: 
2009-08-07 00:00:00
Account Value: 12721.63
    Buy Price: 1010.48
    Num Shares: 12.0
    Remaining Value: 595.87
Sell Date: 
2010-07-14 00:00:00
    Sell Price: 1095.17
    Updated Value: 13737.91

-------------------------

Buy Date: 
2010-08-05 00:00:00
Account Value: 13737.91
    Buy Price: 1125.81
    Num Shares: 12.0
    Remaining Value: 228.19
Sell Date: 
2010-08-27 00:00:00
    Sell Price: 1064.59
    Updated Value: 13003.27

-------------------------

Buy Date: 
2010-09-28 00:00:00
Account Value: 13003.27
    Buy Price: 1147.7
    Num Shares: 11.0
    Remaining Value: 378.57
Sell Date: 
2011-08-19 00:00:00
    Sell Price: 1123.53
    Updated Value: 12737.4

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 12737.4
    Buy Price: 1314.65
    Num Shares: 9.0
    Remaining Value: 905.55
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 19824.09


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 19824.09





-----------------------------------------------------------------------
^GSPC Calculations, N = [20, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-04 00:00:00
Account Value: 10000
    Buy Price: 1266.61
    Num Shares: 7.0
    Remaining Value: 1133.73
Sell Date: 
2001-08-15 00:00:00
    Sell Price: 1178.02
    Updated Value: 9379.87

-------------------------

Buy Date: 
2003-06-06 00:00:00
Account Value: 9379.87
    Buy Price: 987.76
    Num Shares: 9.0
    Remaining Value: 490.03
Sell Date: 
2008-01-14 00:00:00
    Sell Price: 1416.25
    Updated Value: 13236.28

-------------------------

Buy Date: 
2009-09-01 00:00:00
Account Value: 13236.28
    Buy Price: 998.04
    Num Shares: 13.0
    Remaining Value: 261.76
Sell Date: 
2010-09-16 00:00:00
    Sell Price: 1124.66
    Updated Value: 14882.34

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 14882.34
    Buy Price: 1142.71
    Num Shares: 13.0
    Remaining Value: 27.11
Sell Date: 
2011-08-25 00:00:00
    Sell Price: 1159.27
    Updated Value: 15097.62

-------------------------

Buy Date: 
2011-11-16 00:00:00
Account Value: 15097.62
    Buy Price: 1236.91
    Num Shares: 12.0
    Remaining Value: 254.7
Sell Date: 
2011-11-21 00:00:00
    Sell Price: 1192.98
    Updated Value: 14570.46

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 14570.46
    Buy Price: 1314.5
    Num Shares: 11.0
    Remaining Value: 110.96
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23233.62


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23233.62





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-11 00:00:00
Account Value: 10000
    Buy Price: 1245.67
    Num Shares: 8.0
    Remaining Value: 34.64
Sell Date: 
2001-07-03 00:00:00
    Sell Price: 1234.45
    Updated Value: 9910.24

-------------------------

Buy Date: 
2001-11-09 00:00:00
Account Value: 9910.24
    Buy Price: 1120.31
    Num Shares: 8.0
    Remaining Value: 947.76
Sell Date: 
2002-01-24 00:00:00
    Sell Price: 1132.15
    Updated Value: 10004.96

-------------------------

Buy Date: 
2002-01-29 00:00:00
Account Value: 10004.96
    Buy Price: 1100.64
    Num Shares: 9.0
    Remaining Value: 99.2
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1096.22
    Updated Value: 9965.18

-------------------------

Buy Date: 
2002-03-25 00:00:00
Account Value: 9965.18
    Buy Price: 1131.87
    Num Shares: 8.0
    Remaining Value: 910.22
Sell Date: 
2002-04-30 00:00:00
    Sell Price: 1076.92
    Updated Value: 9525.58

-------------------------

Buy Date: 
2002-09-12 00:00:00
Account Value: 9525.58
    Buy Price: 886.91
    Num Shares: 10.0
    Remaining Value: 656.48
Sell Date: 
2002-10-04 00:00:00
    Sell Price: 800.58
    Updated Value: 8662.28

-------------------------

Buy Date: 
2002-11-15 00:00:00
Account Value: 8662.28
    Buy Price: 909.83
    Num Shares: 9.0
    Remaining Value: 473.81
Sell Date: 
2003-01-14 00:00:00
    Sell Price: 931.66
    Updated Value: 8858.75

-------------------------

Buy Date: 
2003-04-08 00:00:00
Account Value: 8858.75
    Buy Price: 878.29
    Num Shares: 10.0
    Remaining Value: 75.85
Sell Date: 
2003-08-18 00:00:00
    Sell Price: 999.74
    Updated Value: 10073.25

-------------------------

Buy Date: 
2003-09-05 00:00:00
Account Value: 10073.25
    Buy Price: 1021.39
    Num Shares: 9.0
    Remaining Value: 880.74
Sell Date: 
2003-09-08 00:00:00
    Sell Price: 1031.64
    Updated Value: 10165.5

-------------------------

Buy Date: 
2003-09-15 00:00:00
Account Value: 10165.5
    Buy Price: 1014.81
    Num Shares: 10.0
    Remaining Value: 17.4
Sell Date: 
2004-03-26 00:00:00
    Sell Price: 1108.06
    Updated Value: 11098.0

-------------------------

Buy Date: 
2004-05-07 00:00:00
Account Value: 11098.0
    Buy Price: 1098.7
    Num Shares: 10.0
    Remaining Value: 111.0
Sell Date: 
2004-05-24 00:00:00
    Sell Price: 1095.41
    Updated Value: 11065.1

-------------------------

Buy Date: 
2004-06-30 00:00:00
Account Value: 11065.1
    Buy Price: 1140.84
    Num Shares: 9.0
    Remaining Value: 797.54
Sell Date: 
2004-08-02 00:00:00
    Sell Price: 1106.62
    Updated Value: 10757.12

-------------------------

Buy Date: 
2004-09-21 00:00:00
Account Value: 10757.12
    Buy Price: 1129.3
    Num Shares: 9.0
    Remaining Value: 593.42
Sell Date: 
2005-02-08 00:00:00
    Sell Price: 1202.3
    Updated Value: 11414.12

-------------------------

Buy Date: 
2005-03-08 00:00:00
Account Value: 11414.12
    Buy Price: 1219.43
    Num Shares: 9.0
    Remaining Value: 439.25
Sell Date: 
2005-04-12 00:00:00
    Sell Price: 1187.76
    Updated Value: 11129.09

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 11129.09
    Buy Price: 1197.51
    Num Shares: 9.0
    Remaining Value: 351.5
Sell Date: 
2005-09-15 00:00:00
    Sell Price: 1227.73
    Updated Value: 11401.07

-------------------------

Buy Date: 
2005-11-28 00:00:00
Account Value: 11401.07
    Buy Price: 1257.46
    Num Shares: 9.0
    Remaining Value: 83.93
Sell Date: 
2006-03-14 00:00:00
    Sell Price: 1297.48
    Updated Value: 11761.25

-------------------------

Buy Date: 
2006-03-21 00:00:00
Account Value: 11761.25
    Buy Price: 1297.23
    Num Shares: 9.0
    Remaining Value: 86.18
Sell Date: 
2006-05-23 00:00:00
    Sell Price: 1256.58
    Updated Value: 11395.4

-------------------------

Buy Date: 
2006-05-25 00:00:00
Account Value: 11395.4
    Buy Price: 1272.88
    Num Shares: 8.0
    Remaining Value: 1212.36
Sell Date: 
2006-06-05 00:00:00
    Sell Price: 1265.29
    Updated Value: 11334.68

-------------------------

Buy Date: 
2006-08-04 00:00:00
Account Value: 11334.68
    Buy Price: 1279.36
    Num Shares: 8.0
    Remaining Value: 1099.8
Sell Date: 
2007-03-21 00:00:00
    Sell Price: 1435.04
    Updated Value: 12580.12

-------------------------

Buy Date: 
2007-04-25 00:00:00
Account Value: 12580.12
    Buy Price: 1495.42
    Num Shares: 8.0
    Remaining Value: 616.76
Sell Date: 
2007-07-18 00:00:00
    Sell Price: 1546.17
    Updated Value: 12986.12

-------------------------

Buy Date: 
2007-07-20 00:00:00
Account Value: 12986.12
    Buy Price: 1534.1
    Num Shares: 8.0
    Remaining Value: 713.32
Sell Date: 
2007-07-30 00:00:00
    Sell Price: 1473.91
    Updated Value: 12504.6

-------------------------

Buy Date: 
2007-08-13 00:00:00
Account Value: 12504.6
    Buy Price: 1452.92
    Num Shares: 8.0
    Remaining Value: 881.24
Sell Date: 
2007-08-15 00:00:00
    Sell Price: 1406.7
    Updated Value: 12134.84

-------------------------

Buy Date: 
2007-10-01 00:00:00
Account Value: 12134.84
    Buy Price: 1547.04
    Num Shares: 7.0
    Remaining Value: 1305.56
Sell Date: 
2007-11-20 00:00:00
    Sell Price: 1439.7
    Updated Value: 11383.46

-------------------------

Buy Date: 
2008-01-11 00:00:00
Account Value: 11383.46
    Buy Price: 1401.02
    Num Shares: 8.0
    Remaining Value: 175.3
Sell Date: 
2008-01-22 00:00:00
    Sell Price: 1310.5
    Updated Value: 10659.3

-------------------------

Buy Date: 
2008-04-25 00:00:00
Account Value: 10659.3
    Buy Price: 1397.84
    Num Shares: 7.0
    Remaining Value: 874.42
Sell Date: 
2008-06-24 00:00:00
    Sell Price: 1314.29
    Updated Value: 10074.45

-------------------------

Buy Date: 
2008-08-29 00:00:00
Account Value: 10074.45
    Buy Price: 1282.83
    Num Shares: 7.0
    Remaining Value: 1094.64
Sell Date: 
2008-09-24 00:00:00
    Sell Price: 1185.87
    Updated Value: 9395.73

-------------------------

Buy Date: 
2009-01-15 00:00:00
Account Value: 9395.73
    Buy Price: 843.74
    Num Shares: 11.0
    Remaining Value: 114.59
Sell Date: 
2009-02-05 00:00:00
    Sell Price: 845.85
    Updated Value: 9418.94

-------------------------

Buy Date: 
2009-04-20 00:00:00
Account Value: 9418.94
    Buy Price: 832.39
    Num Shares: 11.0
    Remaining Value: 262.65
Sell Date: 
2009-07-24 00:00:00
    Sell Price: 979.26
    Updated Value: 11034.51

-------------------------

Buy Date: 
2009-08-05 00:00:00
Account Value: 11034.51
    Buy Price: 1002.72
    Num Shares: 11.0
    Remaining Value: 4.59000000001
Sell Date: 
2010-02-19 00:00:00
    Sell Price: 1109.17
    Updated Value: 12205.46

-------------------------

Buy Date: 
2010-03-23 00:00:00
Account Value: 12205.46
    Buy Price: 1174.17
    Num Shares: 10.0
    Remaining Value: 463.76
Sell Date: 
2010-05-26 00:00:00
    Sell Price: 1067.95
    Updated Value: 11143.26

-------------------------

Buy Date: 
2010-08-13 00:00:00
Account Value: 11143.26
    Buy Price: 1079.25
    Num Shares: 10.0
    Remaining Value: 350.76
Sell Date: 
2010-09-16 00:00:00
    Sell Price: 1124.66
    Updated Value: 11597.36

-------------------------

Buy Date: 
2010-10-06 00:00:00
Account Value: 11597.36
    Buy Price: 1159.97
    Num Shares: 9.0
    Remaining Value: 1157.63
Sell Date: 
2011-04-04 00:00:00
    Sell Price: 1332.87
    Updated Value: 13153.46

-------------------------

Buy Date: 
2011-04-28 00:00:00
Account Value: 13153.46
    Buy Price: 1360.48
    Num Shares: 9.0
    Remaining Value: 909.14
Sell Date: 
2011-06-14 00:00:00
    Sell Price: 1287.87
    Updated Value: 12499.97

-------------------------

Buy Date: 
2011-07-29 00:00:00
Account Value: 12499.97
    Buy Price: 1292.28
    Num Shares: 9.0
    Remaining Value: 869.45
Sell Date: 
2011-08-18 00:00:00
    Sell Price: 1140.65
    Updated Value: 11135.3

-------------------------

Buy Date: 
2011-10-12 00:00:00
Account Value: 11135.3
    Buy Price: 1207.25
    Num Shares: 9.0
    Remaining Value: 270.05
Sell Date: 
2011-10-19 00:00:00
    Sell Price: 1209.88
    Updated Value: 11158.97

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 11158.97
    Buy Price: 1254.19
    Num Shares: 8.0
    Remaining Value: 1125.45
Sell Date: 
2011-10-28 00:00:00
    Sell Price: 1285.09
    Updated Value: 11406.17

-------------------------

Buy Date: 
2011-11-04 00:00:00
Account Value: 11406.17
    Buy Price: 1253.23
    Num Shares: 9.0
    Remaining Value: 127.1
Sell Date: 
2011-12-20 00:00:00
    Sell Price: 1241.3
    Updated Value: 11298.8

-------------------------

Buy Date: 
2012-01-10 00:00:00
Account Value: 11298.8
    Buy Price: 1292.08
    Num Shares: 8.0
    Remaining Value: 962.16
Sell Date: 
2012-05-14 00:00:00
    Sell Price: 1338.35
    Updated Value: 11668.96

-------------------------

Buy Date: 
2012-07-17 00:00:00
Account Value: 11668.96
    Buy Price: 1363.67
    Num Shares: 8.0
    Remaining Value: 759.6
Sell Date: 
2012-11-12 00:00:00
    Sell Price: 1380.03
    Updated Value: 11799.84

-------------------------

Buy Date: 
2013-01-02 00:00:00
Account Value: 11799.84
    Buy Price: 1462.42
    Num Shares: 8.0
    Remaining Value: 100.48
Sell Date: 
2013-07-09 00:00:00
    Sell Price: 1652.32
    Updated Value: 13319.04

-------------------------

Buy Date: 
2013-08-02 00:00:00
Account Value: 13319.04
    Buy Price: 1709.67
    Num Shares: 7.0
    Remaining Value: 1351.35
Sell Date: 
2013-09-13 00:00:00
    Sell Price: 1687.99
    Updated Value: 13167.28

-------------------------

Buy Date: 
2013-10-10 00:00:00
Account Value: 13167.28
    Buy Price: 1692.56
    Num Shares: 7.0
    Remaining Value: 1319.36
Sell Date: 
2014-02-24 00:00:00
    Sell Price: 1847.61
    Updated Value: 14252.63

-------------------------

Buy Date: 
2014-03-18 00:00:00
Account Value: 14252.63
    Buy Price: 1872.25
    Num Shares: 7.0
    Remaining Value: 1146.88
Sell Date: 
2014-05-15 00:00:00
    Sell Price: 1870.85
    Updated Value: 14242.83

-------------------------

Buy Date: 
2014-05-20 00:00:00
Account Value: 14242.83
    Buy Price: 1872.83
    Num Shares: 7.0
    Remaining Value: 1133.02
Sell Date: 
2014-08-26 00:00:00
    Sell Price: 2000.02
    Updated Value: 15133.16

-------------------------

Buy Date: 
2014-09-17 00:00:00
Account Value: 15133.16
    Buy Price: 2001.57
    Num Shares: 7.0
    Remaining Value: 1122.17
Sell Date: 
2014-10-17 00:00:00
    Sell Price: 1886.76
    Updated Value: 14329.49

-------------------------

Buy Date: 
2014-11-25 00:00:00
Account Value: 14329.49
    Buy Price: 2067.03
    Num Shares: 6.0
    Remaining Value: 1927.31
Sell Date: 
2015-01-16 00:00:00
    Sell Price: 2019.42
    Updated Value: 14043.83

-------------------------

Buy Date: 
2015-02-02 00:00:00
Account Value: 14043.83
    Buy Price: 2020.85
    Num Shares: 6.0
    Remaining Value: 1918.73
Sell Date: 
2015-02-04 00:00:00
    Sell Price: 2041.51
    Updated Value: 14167.79

-------------------------

Buy Date: 
2015-02-27 00:00:00
Account Value: 14167.79
    Buy Price: 2104.5
    Num Shares: 6.0
    Remaining Value: 1540.79
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 14153.15


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 14153.15





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-23 00:00:00
Account Value: 10000
    Buy Price: 1289.05
    Num Shares: 7.0
    Remaining Value: 976.65
Sell Date: 
2001-07-19 00:00:00
    Sell Price: 1215.02
    Updated Value: 9481.79

-------------------------

Buy Date: 
2001-11-30 00:00:00
Account Value: 9481.79
    Buy Price: 1139.45
    Num Shares: 8.0
    Remaining Value: 366.19
Sell Date: 
2002-02-19 00:00:00
    Sell Price: 1083.34
    Updated Value: 9032.91

-------------------------

Buy Date: 
2002-04-03 00:00:00
Account Value: 9032.91
    Buy Price: 1125.4
    Num Shares: 8.0
    Remaining Value: 29.71
Sell Date: 
2002-05-03 00:00:00
    Sell Price: 1073.43
    Updated Value: 8617.15

-------------------------

Buy Date: 
2002-11-22 00:00:00
Account Value: 8617.15
    Buy Price: 930.55
    Num Shares: 9.0
    Remaining Value: 242.2
Sell Date: 
2003-01-30 00:00:00
    Sell Price: 844.61
    Updated Value: 7843.69

-------------------------

Buy Date: 
2003-04-23 00:00:00
Account Value: 7843.69
    Buy Price: 919.02
    Num Shares: 8.0
    Remaining Value: 491.53
Sell Date: 
2004-04-12 00:00:00
    Sell Price: 1145.2
    Updated Value: 9653.13

-------------------------

Buy Date: 
2004-07-01 00:00:00
Account Value: 9653.13
    Buy Price: 1128.94
    Num Shares: 8.0
    Remaining Value: 621.61
Sell Date: 
2004-08-05 00:00:00
    Sell Price: 1080.7
    Updated Value: 9267.21

-------------------------

Buy Date: 
2004-09-30 00:00:00
Account Value: 9267.21
    Buy Price: 1114.58
    Num Shares: 8.0
    Remaining Value: 350.57
Sell Date: 
2005-02-22 00:00:00
    Sell Price: 1184.16
    Updated Value: 9823.85

-------------------------

Buy Date: 
2005-03-07 00:00:00
Account Value: 9823.85
    Buy Price: 1225.31
    Num Shares: 8.0
    Remaining Value: 21.37
Sell Date: 
2005-04-15 00:00:00
    Sell Price: 1142.62
    Updated Value: 9162.33

-------------------------

Buy Date: 
2005-06-15 00:00:00
Account Value: 9162.33
    Buy Price: 1206.58
    Num Shares: 7.0
    Remaining Value: 716.27
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 1186.57
    Updated Value: 9022.26

-------------------------

Buy Date: 
2005-12-01 00:00:00
Account Value: 9022.26
    Buy Price: 1264.67
    Num Shares: 7.0
    Remaining Value: 169.57
Sell Date: 
2006-06-08 00:00:00
    Sell Price: 1257.93
    Updated Value: 8975.08

-------------------------

Buy Date: 
2006-08-24 00:00:00
Account Value: 8975.08
    Buy Price: 1296.06
    Num Shares: 6.0
    Remaining Value: 1198.72
Sell Date: 
2007-03-28 00:00:00
    Sell Price: 1417.23
    Updated Value: 9702.1

-------------------------

Buy Date: 
2007-04-25 00:00:00
Account Value: 9702.1
    Buy Price: 1495.42
    Num Shares: 6.0
    Remaining Value: 729.58
Sell Date: 
2007-08-15 00:00:00
    Sell Price: 1406.7
    Updated Value: 9169.78

-------------------------

Buy Date: 
2007-10-10 00:00:00
Account Value: 9169.78
    Buy Price: 1562.47
    Num Shares: 5.0
    Remaining Value: 1357.43
Sell Date: 
2007-11-30 00:00:00
    Sell Price: 1481.14
    Updated Value: 8763.13

-------------------------

Buy Date: 
2008-04-29 00:00:00
Account Value: 8763.13
    Buy Price: 1390.94
    Num Shares: 6.0
    Remaining Value: 417.49
Sell Date: 
2008-07-02 00:00:00
    Sell Price: 1261.52
    Updated Value: 7986.61

-------------------------

Buy Date: 
2009-04-27 00:00:00
Account Value: 7986.61
    Buy Price: 857.51
    Num Shares: 9.0
    Remaining Value: 269.02
Sell Date: 
2010-02-24 00:00:00
    Sell Price: 1105.24
    Updated Value: 10216.18

-------------------------

Buy Date: 
2010-03-24 00:00:00
Account Value: 10216.18
    Buy Price: 1167.72
    Num Shares: 8.0
    Remaining Value: 874.42
Sell Date: 
2010-06-04 00:00:00
    Sell Price: 1064.88
    Updated Value: 9393.46

-------------------------

Buy Date: 
2010-08-20 00:00:00
Account Value: 9393.46
    Buy Price: 1071.69
    Num Shares: 8.0
    Remaining Value: 819.94
Sell Date: 
2010-09-22 00:00:00
    Sell Price: 1134.28
    Updated Value: 9894.18

-------------------------

Buy Date: 
2010-09-27 00:00:00
Account Value: 9894.18
    Buy Price: 1142.16
    Num Shares: 8.0
    Remaining Value: 756.9
Sell Date: 
2011-06-22 00:00:00
    Sell Price: 1287.14
    Updated Value: 11054.02

-------------------------

Buy Date: 
2011-11-09 00:00:00
Account Value: 11054.02
    Buy Price: 1229.1
    Num Shares: 8.0
    Remaining Value: 1221.22
Sell Date: 
2012-05-21 00:00:00
    Sell Price: 1315.99
    Updated Value: 11749.14

-------------------------

Buy Date: 
2012-08-01 00:00:00
Account Value: 11749.14
    Buy Price: 1375.32
    Num Shares: 8.0
    Remaining Value: 746.58
Sell Date: 
2012-11-20 00:00:00
    Sell Price: 1387.81
    Updated Value: 11849.06

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 11849.06
    Buy Price: 1472.12
    Num Shares: 8.0
    Remaining Value: 72.1
Sell Date: 
2014-03-05 00:00:00
    Sell Price: 1873.81
    Updated Value: 15062.58

-------------------------

Buy Date: 
2014-03-12 00:00:00
Account Value: 15062.58
    Buy Price: 1868.2
    Num Shares: 8.0
    Remaining Value: 116.98
Sell Date: 
2014-10-21 00:00:00
    Sell Price: 1941.28
    Updated Value: 15647.22

-------------------------

Buy Date: 
2014-11-26 00:00:00
Account Value: 15647.22
    Buy Price: 2072.83
    Num Shares: 7.0
    Remaining Value: 1137.41
Sell Date: 
2015-02-12 00:00:00
    Sell Price: 2088.48
    Updated Value: 15756.77

-------------------------

Buy Date: 
2015-02-27 00:00:00
Account Value: 15756.77
    Buy Price: 2104.5
    Num Shares: 7.0
    Remaining Value: 1025.27
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 15739.69


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15739.69





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-06 00:00:00
Account Value: 10000
    Buy Price: 1270.03
    Num Shares: 7.0
    Remaining Value: 1109.79
Sell Date: 
2001-06-28 00:00:00
    Sell Price: 1226.2
    Updated Value: 9693.19

-------------------------

Buy Date: 
2001-12-31 00:00:00
Account Value: 9693.19
    Buy Price: 1148.08
    Num Shares: 8.0
    Remaining Value: 508.55
Sell Date: 
2002-04-30 00:00:00
    Sell Price: 1076.92
    Updated Value: 9123.91

-------------------------

Buy Date: 
2002-12-11 00:00:00
Account Value: 9123.91
    Buy Price: 904.96
    Num Shares: 10.0
    Remaining Value: 74.31
Sell Date: 
2003-02-14 00:00:00
    Sell Price: 834.89
    Updated Value: 8423.21

-------------------------

Buy Date: 
2003-05-07 00:00:00
Account Value: 8423.21
    Buy Price: 929.62
    Num Shares: 9.0
    Remaining Value: 56.63
Sell Date: 
2004-05-27 00:00:00
    Sell Price: 1121.28
    Updated Value: 10148.15

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 10148.15
    Buy Price: 1142.05
    Num Shares: 8.0
    Remaining Value: 1011.75
Sell Date: 
2005-04-22 00:00:00
    Sell Price: 1152.12
    Updated Value: 10228.71

-------------------------

Buy Date: 
2005-06-22 00:00:00
Account Value: 10228.71
    Buy Price: 1213.88
    Num Shares: 8.0
    Remaining Value: 517.67
Sell Date: 
2005-10-28 00:00:00
    Sell Price: 1198.41
    Updated Value: 10104.95

-------------------------

Buy Date: 
2005-12-01 00:00:00
Account Value: 10104.95
    Buy Price: 1264.67
    Num Shares: 7.0
    Remaining Value: 1252.26
Sell Date: 
2006-06-16 00:00:00
    Sell Price: 1251.54
    Updated Value: 10013.04

-------------------------

Buy Date: 
2006-09-08 00:00:00
Account Value: 10013.04
    Buy Price: 1298.92
    Num Shares: 7.0
    Remaining Value: 920.6
Sell Date: 
2007-08-30 00:00:00
    Sell Price: 1457.64
    Updated Value: 11124.08

-------------------------

Buy Date: 
2007-10-11 00:00:00
Account Value: 11124.08
    Buy Price: 1554.41
    Num Shares: 7.0
    Remaining Value: 243.21
Sell Date: 
2007-11-27 00:00:00
    Sell Price: 1428.23
    Updated Value: 10240.82

-------------------------

Buy Date: 
2008-05-29 00:00:00
Account Value: 10240.82
    Buy Price: 1398.26
    Num Shares: 7.0
    Remaining Value: 453.0
Sell Date: 
2008-07-03 00:00:00
    Sell Price: 1262.9
    Updated Value: 9293.3

-------------------------

Buy Date: 
2009-05-07 00:00:00
Account Value: 9293.3
    Buy Price: 907.39
    Num Shares: 10.0
    Remaining Value: 219.4
Sell Date: 
2010-06-10 00:00:00
    Sell Price: 1086.84
    Updated Value: 11087.8

-------------------------

Buy Date: 
2010-10-11 00:00:00
Account Value: 11087.8
    Buy Price: 1165.32
    Num Shares: 9.0
    Remaining Value: 599.92
Sell Date: 
2011-06-28 00:00:00
    Sell Price: 1296.67
    Updated Value: 12269.95

-------------------------

Buy Date: 
2011-12-05 00:00:00
Account Value: 12269.95
    Buy Price: 1257.08
    Num Shares: 9.0
    Remaining Value: 956.23
Sell Date: 
2011-12-12 00:00:00
    Sell Price: 1236.47
    Updated Value: 12084.46

-------------------------

Buy Date: 
2012-01-04 00:00:00
Account Value: 12084.46
    Buy Price: 1277.3
    Num Shares: 9.0
    Remaining Value: 588.76
Sell Date: 
2012-06-14 00:00:00
    Sell Price: 1329.1
    Updated Value: 12550.66

-------------------------

Buy Date: 
2012-08-10 00:00:00
Account Value: 12550.66
    Buy Price: 1405.87
    Num Shares: 8.0
    Remaining Value: 1303.7
Sell Date: 
2012-12-19 00:00:00
    Sell Price: 1435.81
    Updated Value: 12790.18

-------------------------

Buy Date: 
2012-12-26 00:00:00
Account Value: 12790.18
    Buy Price: 1419.83
    Num Shares: 9.0
    Remaining Value: 11.71
Sell Date: 
2014-11-04 00:00:00
    Sell Price: 2012.1
    Updated Value: 18120.61

-------------------------

Buy Date: 
2014-11-21 00:00:00
Account Value: 18120.61
    Buy Price: 2063.5
    Num Shares: 8.0
    Remaining Value: 1612.61
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 18429.09


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 18429.09





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 1312.83
    Num Shares: 7.0
    Remaining Value: 810.19
Sell Date: 
2001-07-19 00:00:00
    Sell Price: 1215.02
    Updated Value: 9315.33

-------------------------

Buy Date: 
2002-04-09 00:00:00
Account Value: 9315.33
    Buy Price: 1117.8
    Num Shares: 8.0
    Remaining Value: 372.93
Sell Date: 
2002-04-29 00:00:00
    Sell Price: 1065.45
    Updated Value: 8896.53

-------------------------

Buy Date: 
2003-05-01 00:00:00
Account Value: 8896.53
    Buy Price: 916.3
    Num Shares: 9.0
    Remaining Value: 649.83
Sell Date: 
2004-08-12 00:00:00
    Sell Price: 1063.23
    Updated Value: 10218.9

-------------------------

Buy Date: 
2004-11-08 00:00:00
Account Value: 10218.9
    Buy Price: 1164.89
    Num Shares: 8.0
    Remaining Value: 899.78
Sell Date: 
2005-11-11 00:00:00
    Sell Price: 1234.72
    Updated Value: 10777.54

-------------------------

Buy Date: 
2005-11-18 00:00:00
Account Value: 10777.54
    Buy Price: 1248.27
    Num Shares: 8.0
    Remaining Value: 791.38
Sell Date: 
2006-07-13 00:00:00
    Sell Price: 1242.28
    Updated Value: 10729.62

-------------------------

Buy Date: 
2006-08-30 00:00:00
Account Value: 10729.62
    Buy Price: 1305.37
    Num Shares: 8.0
    Remaining Value: 286.66
Sell Date: 
2007-12-11 00:00:00
    Sell Price: 1477.65
    Updated Value: 12107.86

-------------------------

Buy Date: 
2009-06-25 00:00:00
Account Value: 12107.86
    Buy Price: 920.26
    Num Shares: 13.0
    Remaining Value: 144.48
Sell Date: 
2010-06-23 00:00:00
    Sell Price: 1092.04
    Updated Value: 14341.0

-------------------------

Buy Date: 
2010-10-13 00:00:00
Account Value: 14341.0
    Buy Price: 1178.1
    Num Shares: 12.0
    Remaining Value: 203.8
Sell Date: 
2011-08-18 00:00:00
    Sell Price: 1140.65
    Updated Value: 13891.6

-------------------------

Buy Date: 
2012-01-30 00:00:00
Account Value: 13891.6
    Buy Price: 1313.01
    Num Shares: 10.0
    Remaining Value: 761.5
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21782.1


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21782.1





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 1288.49
    Num Shares: 7.0
    Remaining Value: 980.57
Sell Date: 
2001-08-02 00:00:00
    Sell Price: 1220.75
    Updated Value: 9525.82

-------------------------

Buy Date: 
2003-05-22 00:00:00
Account Value: 9525.82
    Buy Price: 931.87
    Num Shares: 10.0
    Remaining Value: 207.12
Sell Date: 
2004-09-15 00:00:00
    Sell Price: 1120.37
    Updated Value: 11410.82

-------------------------

Buy Date: 
2004-09-17 00:00:00
Account Value: 11410.82
    Buy Price: 1128.55
    Num Shares: 10.0
    Remaining Value: 125.32
Sell Date: 
2006-07-21 00:00:00
    Sell Price: 1240.29
    Updated Value: 12528.22

-------------------------

Buy Date: 
2006-07-25 00:00:00
Account Value: 12528.22
    Buy Price: 1268.88
    Num Shares: 9.0
    Remaining Value: 1108.3
Sell Date: 
2007-12-17 00:00:00
    Sell Price: 1445.9
    Updated Value: 14121.4

-------------------------

Buy Date: 
2009-08-14 00:00:00
Account Value: 14121.4
    Buy Price: 1004.09
    Num Shares: 14.0
    Remaining Value: 64.14
Sell Date: 
2010-07-13 00:00:00
    Sell Price: 1095.34
    Updated Value: 15398.9

-------------------------

Buy Date: 
2010-10-08 00:00:00
Account Value: 15398.9
    Buy Price: 1165.15
    Num Shares: 13.0
    Remaining Value: 251.95
Sell Date: 
2011-08-29 00:00:00
    Sell Price: 1210.08
    Updated Value: 15982.99

-------------------------

Buy Date: 
2012-02-02 00:00:00
Account Value: 15982.99
    Buy Price: 1325.54
    Num Shares: 12.0
    Remaining Value: 76.51
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 25301.23


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 25301.23





-----------------------------------------------------------------------
^GSPC Calculations, N = [30, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-15 00:00:00
Account Value: 10000
    Buy Price: 1249.44
    Num Shares: 8.0
    Remaining Value: 4.48
Sell Date: 
2001-08-15 00:00:00
    Sell Price: 1178.02
    Updated Value: 9428.64

-------------------------

Buy Date: 
2003-06-12 00:00:00
Account Value: 9428.64
    Buy Price: 998.51
    Num Shares: 9.0
    Remaining Value: 442.05
Sell Date: 
2008-01-18 00:00:00
    Sell Price: 1325.19
    Updated Value: 12368.76

-------------------------

Buy Date: 
2009-09-08 00:00:00
Account Value: 12368.76
    Buy Price: 1025.39
    Num Shares: 12.0
    Remaining Value: 64.08
Sell Date: 
2011-09-07 00:00:00
    Sell Price: 1198.62
    Updated Value: 14447.52

-------------------------

Buy Date: 
2012-01-31 00:00:00
Account Value: 14447.52
    Buy Price: 1312.41
    Num Shares: 11.0
    Remaining Value: 11.01
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23133.67


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23133.67





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 1288.49
    Num Shares: 7.0
    Remaining Value: 980.57
Sell Date: 
2001-07-13 00:00:00
    Sell Price: 1215.68
    Updated Value: 9490.33

-------------------------

Buy Date: 
2001-11-16 00:00:00
Account Value: 9490.33
    Buy Price: 1138.65
    Num Shares: 8.0
    Remaining Value: 381.13
Sell Date: 
2002-01-25 00:00:00
    Sell Price: 1133.28
    Updated Value: 9447.37

-------------------------

Buy Date: 
2002-01-28 00:00:00
Account Value: 9447.37
    Buy Price: 1133.06
    Num Shares: 8.0
    Remaining Value: 382.89
Sell Date: 
2002-02-04 00:00:00
    Sell Price: 1094.44
    Updated Value: 9138.41

-------------------------

Buy Date: 
2002-02-21 00:00:00
Account Value: 9138.41
    Buy Price: 1080.95
    Num Shares: 8.0
    Remaining Value: 490.81
Sell Date: 
2002-02-22 00:00:00
    Sell Price: 1089.84
    Updated Value: 9209.53

-------------------------

Buy Date: 
2002-04-04 00:00:00
Account Value: 9209.53
    Buy Price: 1126.34
    Num Shares: 8.0
    Remaining Value: 198.81
Sell Date: 
2002-05-07 00:00:00
    Sell Price: 1049.49
    Updated Value: 8594.73

-------------------------

Buy Date: 
2002-09-18 00:00:00
Account Value: 8594.73
    Buy Price: 869.46
    Num Shares: 9.0
    Remaining Value: 769.59
Sell Date: 
2002-10-14 00:00:00
    Sell Price: 841.44
    Updated Value: 8342.55

-------------------------

Buy Date: 
2002-11-22 00:00:00
Account Value: 8342.55
    Buy Price: 930.55
    Num Shares: 8.0
    Remaining Value: 898.15
Sell Date: 
2003-01-27 00:00:00
    Sell Price: 847.48
    Updated Value: 7677.99

-------------------------

Buy Date: 
2003-04-10 00:00:00
Account Value: 7677.99
    Buy Price: 871.58
    Num Shares: 8.0
    Remaining Value: 705.35
Sell Date: 
2003-08-13 00:00:00
    Sell Price: 984.03
    Updated Value: 8577.59

-------------------------

Buy Date: 
2003-08-26 00:00:00
Account Value: 8577.59
    Buy Price: 996.73
    Num Shares: 8.0
    Remaining Value: 603.75
Sell Date: 
2003-09-09 00:00:00
    Sell Price: 1023.17
    Updated Value: 8789.11

-------------------------

Buy Date: 
2003-09-17 00:00:00
Account Value: 8789.11
    Buy Price: 1025.97
    Num Shares: 8.0
    Remaining Value: 581.35
Sell Date: 
2004-03-24 00:00:00
    Sell Price: 1091.33
    Updated Value: 9311.99

-------------------------

Buy Date: 
2004-04-01 00:00:00
Account Value: 9311.99
    Buy Price: 1132.17
    Num Shares: 8.0
    Remaining Value: 254.63
Sell Date: 
2004-04-08 00:00:00
    Sell Price: 1139.32
    Updated Value: 9369.19

-------------------------

Buy Date: 
2004-05-18 00:00:00
Account Value: 9369.19
    Buy Price: 1091.49
    Num Shares: 8.0
    Remaining Value: 637.27
Sell Date: 
2004-06-03 00:00:00
    Sell Price: 1116.64
    Updated Value: 9570.39

-------------------------

Buy Date: 
2004-07-09 00:00:00
Account Value: 9570.39
    Buy Price: 1112.81
    Num Shares: 8.0
    Remaining Value: 667.91
Sell Date: 
2004-08-05 00:00:00
    Sell Price: 1080.7
    Updated Value: 9313.51

-------------------------

Buy Date: 
2004-10-01 00:00:00
Account Value: 9313.51
    Buy Price: 1131.5
    Num Shares: 8.0
    Remaining Value: 261.51
Sell Date: 
2004-11-16 00:00:00
    Sell Price: 1175.43
    Updated Value: 9664.95

-------------------------

Buy Date: 
2004-11-17 00:00:00
Account Value: 9664.95
    Buy Price: 1181.94
    Num Shares: 8.0
    Remaining Value: 209.43
Sell Date: 
2005-02-17 00:00:00
    Sell Price: 1200.75
    Updated Value: 9815.43

-------------------------

Buy Date: 
2005-03-14 00:00:00
Account Value: 9815.43
    Buy Price: 1206.83
    Num Shares: 8.0
    Remaining Value: 160.79
Sell Date: 
2005-04-14 00:00:00
    Sell Price: 1162.05
    Updated Value: 9457.19

-------------------------

Buy Date: 
2005-06-15 00:00:00
Account Value: 9457.19
    Buy Price: 1206.58
    Num Shares: 7.0
    Remaining Value: 1011.13
Sell Date: 
2005-09-22 00:00:00
    Sell Price: 1214.62
    Updated Value: 9513.47

-------------------------

Buy Date: 
2005-10-25 00:00:00
Account Value: 9513.47
    Buy Price: 1196.54
    Num Shares: 7.0
    Remaining Value: 1137.69
Sell Date: 
2005-11-01 00:00:00
    Sell Price: 1202.76
    Updated Value: 9557.01

-------------------------

Buy Date: 
2005-12-07 00:00:00
Account Value: 9557.01
    Buy Price: 1257.37
    Num Shares: 7.0
    Remaining Value: 755.42
Sell Date: 
2006-03-14 00:00:00
    Sell Price: 1297.48
    Updated Value: 9837.78

-------------------------

Buy Date: 
2006-03-23 00:00:00
Account Value: 9837.78
    Buy Price: 1301.67
    Num Shares: 7.0
    Remaining Value: 726.09
Sell Date: 
2006-05-23 00:00:00
    Sell Price: 1256.58
    Updated Value: 9522.15

-------------------------

Buy Date: 
2006-08-11 00:00:00
Account Value: 9522.15
    Buy Price: 1266.74
    Num Shares: 7.0
    Remaining Value: 654.97
Sell Date: 
2007-04-02 00:00:00
    Sell Price: 1424.55
    Updated Value: 10626.82

-------------------------

Buy Date: 
2007-05-02 00:00:00
Account Value: 10626.82
    Buy Price: 1495.92
    Num Shares: 7.0
    Remaining Value: 155.38
Sell Date: 
2007-07-27 00:00:00
    Sell Price: 1458.95
    Updated Value: 10368.03

-------------------------

Buy Date: 
2007-10-05 00:00:00
Account Value: 10368.03
    Buy Price: 1557.59
    Num Shares: 6.0
    Remaining Value: 1022.49
Sell Date: 
2007-11-27 00:00:00
    Sell Price: 1428.23
    Updated Value: 9591.87

-------------------------

Buy Date: 
2008-01-22 00:00:00
Account Value: 9591.87
    Buy Price: 1310.5
    Num Shares: 7.0
    Remaining Value: 418.37
Sell Date: 
2008-02-01 00:00:00
    Sell Price: 1395.42
    Updated Value: 10186.31

-------------------------

Buy Date: 
2008-03-28 00:00:00
Account Value: 10186.31
    Buy Price: 1315.22
    Num Shares: 7.0
    Remaining Value: 979.77
Sell Date: 
2008-03-31 00:00:00
    Sell Price: 1322.7
    Updated Value: 10238.67

-------------------------

Buy Date: 
2008-05-06 00:00:00
Account Value: 10238.67
    Buy Price: 1418.26
    Num Shares: 7.0
    Remaining Value: 310.85
Sell Date: 
2008-06-27 00:00:00
    Sell Price: 1278.38
    Updated Value: 9259.51

-------------------------

Buy Date: 
2008-09-08 00:00:00
Account Value: 9259.51
    Buy Price: 1267.79
    Num Shares: 7.0
    Remaining Value: 384.98
Sell Date: 
2008-10-01 00:00:00
    Sell Price: 1161.06
    Updated Value: 8512.4

-------------------------

Buy Date: 
2009-01-21 00:00:00
Account Value: 8512.4
    Buy Price: 840.24
    Num Shares: 10.0
    Remaining Value: 110.0
Sell Date: 
2009-02-12 00:00:00
    Sell Price: 835.19
    Updated Value: 8461.9

-------------------------

Buy Date: 
2009-04-28 00:00:00
Account Value: 8461.9
    Buy Price: 855.16
    Num Shares: 9.0
    Remaining Value: 765.46
Sell Date: 
2009-08-04 00:00:00
    Sell Price: 1005.65
    Updated Value: 9816.31

-------------------------

Buy Date: 
2009-08-17 00:00:00
Account Value: 9816.31
    Buy Price: 979.73
    Num Shares: 10.0
    Remaining Value: 19.01
Sell Date: 
2009-12-17 00:00:00
    Sell Price: 1096.08
    Updated Value: 10979.81

-------------------------

Buy Date: 
2009-12-24 00:00:00
Account Value: 10979.81
    Buy Price: 1126.48
    Num Shares: 9.0
    Remaining Value: 841.49
Sell Date: 
2010-03-01 00:00:00
    Sell Price: 1115.71
    Updated Value: 10882.88

-------------------------

Buy Date: 
2010-03-30 00:00:00
Account Value: 10882.88
    Buy Price: 1173.27
    Num Shares: 9.0
    Remaining Value: 323.45
Sell Date: 
2010-06-02 00:00:00
    Sell Price: 1098.38
    Updated Value: 10208.87

-------------------------

Buy Date: 
2010-08-03 00:00:00
Account Value: 10208.87
    Buy Price: 1120.46
    Num Shares: 9.0
    Remaining Value: 124.73
Sell Date: 
2010-08-13 00:00:00
    Sell Price: 1079.25
    Updated Value: 9837.98

-------------------------

Buy Date: 
2010-08-27 00:00:00
Account Value: 9837.98
    Buy Price: 1064.59
    Num Shares: 9.0
    Remaining Value: 256.67
Sell Date: 
2010-09-28 00:00:00
    Sell Price: 1147.7
    Updated Value: 10585.97

-------------------------

Buy Date: 
2010-10-15 00:00:00
Account Value: 10585.97
    Buy Price: 1176.19
    Num Shares: 9.0
    Remaining Value: 0.260000000007
Sell Date: 
2011-04-12 00:00:00
    Sell Price: 1314.16
    Updated Value: 11827.7

-------------------------

Buy Date: 
2011-05-10 00:00:00
Account Value: 11827.7
    Buy Price: 1357.16
    Num Shares: 8.0
    Remaining Value: 970.42
Sell Date: 
2011-06-24 00:00:00
    Sell Price: 1268.45
    Updated Value: 11118.02

-------------------------

Buy Date: 
2011-08-10 00:00:00
Account Value: 11118.02
    Buy Price: 1120.76
    Num Shares: 9.0
    Remaining Value: 1031.18
Sell Date: 
2011-08-26 00:00:00
    Sell Price: 1176.8
    Updated Value: 11622.38

-------------------------

Buy Date: 
2011-10-14 00:00:00
Account Value: 11622.38
    Buy Price: 1224.58
    Num Shares: 9.0
    Remaining Value: 601.16
Sell Date: 
2011-11-01 00:00:00
    Sell Price: 1218.28
    Updated Value: 11565.68

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 11565.68
    Buy Price: 1275.92
    Num Shares: 9.0
    Remaining Value: 82.4
Sell Date: 
2011-12-27 00:00:00
    Sell Price: 1265.43
    Updated Value: 11471.27

-------------------------

Buy Date: 
2012-01-23 00:00:00
Account Value: 11471.27
    Buy Price: 1316.0
    Num Shares: 8.0
    Remaining Value: 943.27
Sell Date: 
2012-05-17 00:00:00
    Sell Price: 1304.86
    Updated Value: 11382.15

-------------------------

Buy Date: 
2012-07-20 00:00:00
Account Value: 11382.15
    Buy Price: 1362.66
    Num Shares: 8.0
    Remaining Value: 480.87
Sell Date: 
2012-11-15 00:00:00
    Sell Price: 1353.33
    Updated Value: 11307.51

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 11307.51
    Buy Price: 1472.12
    Num Shares: 7.0
    Remaining Value: 1002.67
Sell Date: 
2013-07-16 00:00:00
    Sell Price: 1676.26
    Updated Value: 12736.49

-------------------------

Buy Date: 
2013-08-06 00:00:00
Account Value: 12736.49
    Buy Price: 1697.37
    Num Shares: 7.0
    Remaining Value: 854.9
Sell Date: 
2013-09-18 00:00:00
    Sell Price: 1725.52
    Updated Value: 12933.54

-------------------------

Buy Date: 
2013-10-17 00:00:00
Account Value: 12933.54
    Buy Price: 1733.15
    Num Shares: 7.0
    Remaining Value: 801.49
Sell Date: 
2014-02-28 00:00:00
    Sell Price: 1859.45
    Updated Value: 13817.64

-------------------------

Buy Date: 
2014-03-27 00:00:00
Account Value: 13817.64
    Buy Price: 1849.04
    Num Shares: 7.0
    Remaining Value: 874.36
Sell Date: 
2014-05-07 00:00:00
    Sell Price: 1878.21
    Updated Value: 14021.83

-------------------------

Buy Date: 
2014-05-15 00:00:00
Account Value: 14021.83
    Buy Price: 1870.85
    Num Shares: 7.0
    Remaining Value: 925.88
Sell Date: 
2014-09-04 00:00:00
    Sell Price: 1997.65
    Updated Value: 14909.43

-------------------------

Buy Date: 
2014-09-30 00:00:00
Account Value: 14909.43
    Buy Price: 1972.29
    Num Shares: 7.0
    Remaining Value: 1103.4
Sell Date: 
2014-10-23 00:00:00
    Sell Price: 1950.82
    Updated Value: 14759.14

-------------------------

Buy Date: 
2014-12-03 00:00:00
Account Value: 14759.14
    Buy Price: 2074.33
    Num Shares: 7.0
    Remaining Value: 238.83
Sell Date: 
2015-01-26 00:00:00
    Sell Price: 2057.09
    Updated Value: 14638.46

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 14638.46
    Buy Price: 2096.99
    Num Shares: 6.0
    Remaining Value: 2056.52
Sell Date: 
2015-02-26 00:00:00
    Sell Price: 2110.74
    Updated Value: 14720.96

-------------------------

Buy Date: 
2015-03-11 00:00:00
Account Value: 14720.96
    Buy Price: 2040.24
    Num Shares: 7.0
    Remaining Value: 439.28
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 15153.7


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15153.7





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-31 00:00:00
Account Value: 10000
    Buy Price: 1255.82
    Num Shares: 7.0
    Remaining Value: 1209.26
Sell Date: 
2001-07-24 00:00:00
    Sell Price: 1171.65
    Updated Value: 9410.81

-------------------------

Buy Date: 
2001-12-05 00:00:00
Account Value: 9410.81
    Buy Price: 1170.35
    Num Shares: 8.0
    Remaining Value: 48.01
Sell Date: 
2002-02-22 00:00:00
    Sell Price: 1089.84
    Updated Value: 8766.73

-------------------------

Buy Date: 
2002-04-17 00:00:00
Account Value: 8766.73
    Buy Price: 1126.07
    Num Shares: 7.0
    Remaining Value: 884.24
Sell Date: 
2002-05-15 00:00:00
    Sell Price: 1091.07
    Updated Value: 8521.73

-------------------------

Buy Date: 
2002-12-04 00:00:00
Account Value: 8521.73
    Buy Price: 917.58
    Num Shares: 9.0
    Remaining Value: 263.51
Sell Date: 
2003-01-31 00:00:00
    Sell Price: 855.7
    Updated Value: 7964.81

-------------------------

Buy Date: 
2003-04-30 00:00:00
Account Value: 7964.81
    Buy Price: 916.92
    Num Shares: 8.0
    Remaining Value: 629.45
Sell Date: 
2004-04-16 00:00:00
    Sell Price: 1134.61
    Updated Value: 9706.33

-------------------------

Buy Date: 
2004-07-20 00:00:00
Account Value: 9706.33
    Buy Price: 1108.67
    Num Shares: 8.0
    Remaining Value: 836.97
Sell Date: 
2004-08-17 00:00:00
    Sell Price: 1081.71
    Updated Value: 9490.65

-------------------------

Buy Date: 
2004-10-08 00:00:00
Account Value: 9490.65
    Buy Price: 1122.14
    Num Shares: 8.0
    Remaining Value: 513.53
Sell Date: 
2005-03-01 00:00:00
    Sell Price: 1210.41
    Updated Value: 10196.81

-------------------------

Buy Date: 
2005-03-22 00:00:00
Account Value: 10196.81
    Buy Price: 1171.71
    Num Shares: 8.0
    Remaining Value: 823.13
Sell Date: 
2005-04-27 00:00:00
    Sell Price: 1156.38
    Updated Value: 10074.17

-------------------------

Buy Date: 
2005-06-22 00:00:00
Account Value: 10074.17
    Buy Price: 1213.88
    Num Shares: 8.0
    Remaining Value: 363.13
Sell Date: 
2005-10-11 00:00:00
    Sell Price: 1184.87
    Updated Value: 9842.09

-------------------------

Buy Date: 
2005-12-12 00:00:00
Account Value: 9842.09
    Buy Price: 1260.43
    Num Shares: 7.0
    Remaining Value: 1019.08
Sell Date: 
2006-06-15 00:00:00
    Sell Price: 1256.16
    Updated Value: 9812.2

-------------------------

Buy Date: 
2006-08-24 00:00:00
Account Value: 9812.2
    Buy Price: 1296.06
    Num Shares: 7.0
    Remaining Value: 739.78
Sell Date: 
2007-04-09 00:00:00
    Sell Price: 1444.61
    Updated Value: 10852.05

-------------------------

Buy Date: 
2007-05-04 00:00:00
Account Value: 10852.05
    Buy Price: 1505.62
    Num Shares: 7.0
    Remaining Value: 312.71
Sell Date: 
2007-08-14 00:00:00
    Sell Price: 1426.54
    Updated Value: 10298.49

-------------------------

Buy Date: 
2007-10-18 00:00:00
Account Value: 10298.49
    Buy Price: 1540.08
    Num Shares: 6.0
    Remaining Value: 1058.01
Sell Date: 
2007-12-10 00:00:00
    Sell Price: 1515.96
    Updated Value: 10153.77

-------------------------

Buy Date: 
2008-05-07 00:00:00
Account Value: 10153.77
    Buy Price: 1392.57
    Num Shares: 7.0
    Remaining Value: 405.78
Sell Date: 
2008-07-09 00:00:00
    Sell Price: 1244.69
    Updated Value: 9118.61

-------------------------

Buy Date: 
2009-05-05 00:00:00
Account Value: 9118.61
    Buy Price: 903.8
    Num Shares: 10.0
    Remaining Value: 80.61
Sell Date: 
2010-03-08 00:00:00
    Sell Price: 1138.5
    Updated Value: 11465.61

-------------------------

Buy Date: 
2010-04-06 00:00:00
Account Value: 11465.61
    Buy Price: 1189.44
    Num Shares: 9.0
    Remaining Value: 760.65
Sell Date: 
2010-06-11 00:00:00
    Sell Price: 1091.6
    Updated Value: 10585.05

-------------------------

Buy Date: 
2010-08-30 00:00:00
Account Value: 10585.05
    Buy Price: 1048.92
    Num Shares: 10.0
    Remaining Value: 95.85
Sell Date: 
2011-06-30 00:00:00
    Sell Price: 1320.64
    Updated Value: 13302.25

-------------------------

Buy Date: 
2011-11-11 00:00:00
Account Value: 13302.25
    Buy Price: 1263.85
    Num Shares: 10.0
    Remaining Value: 663.75
Sell Date: 
2012-05-29 00:00:00
    Sell Price: 1332.42
    Updated Value: 13987.95

-------------------------

Buy Date: 
2012-08-07 00:00:00
Account Value: 13987.95
    Buy Price: 1401.35
    Num Shares: 9.0
    Remaining Value: 1375.8
Sell Date: 
2012-11-29 00:00:00
    Sell Price: 1415.95
    Updated Value: 14119.35

-------------------------

Buy Date: 
2013-01-17 00:00:00
Account Value: 14119.35
    Buy Price: 1480.94
    Num Shares: 9.0
    Remaining Value: 790.89
Sell Date: 
2013-10-10 00:00:00
    Sell Price: 1692.56
    Updated Value: 16023.93

-------------------------

Buy Date: 
2013-10-23 00:00:00
Account Value: 16023.93
    Buy Price: 1746.38
    Num Shares: 9.0
    Remaining Value: 306.51
Sell Date: 
2014-03-20 00:00:00
    Sell Price: 1872.01
    Updated Value: 17154.6

-------------------------

Buy Date: 
2014-03-24 00:00:00
Account Value: 17154.6
    Buy Price: 1857.44
    Num Shares: 9.0
    Remaining Value: 437.64
Sell Date: 
2014-11-03 00:00:00
    Sell Price: 2017.81
    Updated Value: 18597.93

-------------------------

Buy Date: 
2014-12-09 00:00:00
Account Value: 18597.93
    Buy Price: 2059.82
    Num Shares: 9.0
    Remaining Value: 59.55
Sell Date: 
2015-02-25 00:00:00
    Sell Price: 2113.86
    Updated Value: 19084.29

-------------------------

Buy Date: 
2015-03-12 00:00:00
Account Value: 19084.29
    Buy Price: 2065.95
    Num Shares: 9.0
    Remaining Value: 490.74
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 19409.28


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 19409.28





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-01-04 00:00:00
Account Value: 10000
    Buy Price: 1172.51
    Num Shares: 8.0
    Remaining Value: 619.92
Sell Date: 
2002-05-06 00:00:00
    Sell Price: 1052.67
    Updated Value: 9041.28

-------------------------

Buy Date: 
2002-12-16 00:00:00
Account Value: 9041.28
    Buy Price: 910.4
    Num Shares: 9.0
    Remaining Value: 847.68
Sell Date: 
2003-02-14 00:00:00
    Sell Price: 834.89
    Updated Value: 8361.69

-------------------------

Buy Date: 
2003-02-26 00:00:00
Account Value: 8361.69
    Buy Price: 827.55
    Num Shares: 10.0
    Remaining Value: 86.19
Sell Date: 
2003-03-03 00:00:00
    Sell Price: 834.81
    Updated Value: 8434.29

-------------------------

Buy Date: 
2003-05-12 00:00:00
Account Value: 8434.29
    Buy Price: 945.11
    Num Shares: 8.0
    Remaining Value: 873.41
Sell Date: 
2004-06-04 00:00:00
    Sell Price: 1122.5
    Updated Value: 9853.41

-------------------------

Buy Date: 
2004-10-14 00:00:00
Account Value: 9853.41
    Buy Price: 1103.29
    Num Shares: 8.0
    Remaining Value: 1027.09
Sell Date: 
2005-04-29 00:00:00
    Sell Price: 1156.85
    Updated Value: 10281.89

-------------------------

Buy Date: 
2005-06-29 00:00:00
Account Value: 10281.89
    Buy Price: 1199.85
    Num Shares: 8.0
    Remaining Value: 683.09
Sell Date: 
2005-11-07 00:00:00
    Sell Price: 1222.81
    Updated Value: 10465.57

-------------------------

Buy Date: 
2005-12-12 00:00:00
Account Value: 10465.57
    Buy Price: 1260.43
    Num Shares: 8.0
    Remaining Value: 382.13
Sell Date: 
2006-06-23 00:00:00
    Sell Price: 1244.5
    Updated Value: 10338.13

-------------------------

Buy Date: 
2006-09-18 00:00:00
Account Value: 10338.13
    Buy Price: 1321.18
    Num Shares: 7.0
    Remaining Value: 1089.87
Sell Date: 
2007-09-11 00:00:00
    Sell Price: 1471.49
    Updated Value: 11390.3

-------------------------

Buy Date: 
2007-10-24 00:00:00
Account Value: 11390.3
    Buy Price: 1515.88
    Num Shares: 7.0
    Remaining Value: 779.14
Sell Date: 
2007-12-10 00:00:00
    Sell Price: 1515.96
    Updated Value: 11390.86

-------------------------

Buy Date: 
2008-06-06 00:00:00
Account Value: 11390.86
    Buy Price: 1360.68
    Num Shares: 8.0
    Remaining Value: 505.42
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 1214.91
    Updated Value: 10224.7

-------------------------

Buy Date: 
2009-05-15 00:00:00
Account Value: 10224.7
    Buy Price: 882.88
    Num Shares: 11.0
    Remaining Value: 513.02
Sell Date: 
2010-06-22 00:00:00
    Sell Price: 1095.31
    Updated Value: 12561.43

-------------------------

Buy Date: 
2010-10-19 00:00:00
Account Value: 12561.43
    Buy Price: 1165.9
    Num Shares: 10.0
    Remaining Value: 902.43
Sell Date: 
2011-07-08 00:00:00
    Sell Price: 1343.8
    Updated Value: 14340.43

-------------------------

Buy Date: 
2011-12-14 00:00:00
Account Value: 14340.43
    Buy Price: 1211.82
    Num Shares: 11.0
    Remaining Value: 1010.41
Sell Date: 
2012-06-25 00:00:00
    Sell Price: 1313.72
    Updated Value: 15461.33

-------------------------

Buy Date: 
2012-08-22 00:00:00
Account Value: 15461.33
    Buy Price: 1413.49
    Num Shares: 10.0
    Remaining Value: 1326.43
Sell Date: 
2012-12-31 00:00:00
    Sell Price: 1426.19
    Updated Value: 15588.33

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 15588.33
    Buy Price: 1472.12
    Num Shares: 10.0
    Remaining Value: 867.13
Sell Date: 
2014-11-19 00:00:00
    Sell Price: 2048.72
    Updated Value: 21354.33

-------------------------

Buy Date: 
2014-11-26 00:00:00
Account Value: 21354.33
    Buy Price: 2072.83
    Num Shares: 10.0
    Remaining Value: 626.03
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21646.63


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21646.63





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-01 00:00:00
Account Value: 10000
    Buy Price: 1260.67
    Num Shares: 7.0
    Remaining Value: 1175.31
Sell Date: 
2001-07-30 00:00:00
    Sell Price: 1204.52
    Updated Value: 9606.95

-------------------------

Buy Date: 
2002-04-22 00:00:00
Account Value: 9606.95
    Buy Price: 1107.83
    Num Shares: 8.0
    Remaining Value: 744.31
Sell Date: 
2002-05-08 00:00:00
    Sell Price: 1088.85
    Updated Value: 9455.11

-------------------------

Buy Date: 
2003-05-09 00:00:00
Account Value: 9455.11
    Buy Price: 933.41
    Num Shares: 10.0
    Remaining Value: 121.01
Sell Date: 
2004-08-20 00:00:00
    Sell Price: 1098.35
    Updated Value: 11104.51

-------------------------

Buy Date: 
2004-11-10 00:00:00
Account Value: 11104.51
    Buy Price: 1162.91
    Num Shares: 9.0
    Remaining Value: 638.32
Sell Date: 
2006-07-18 00:00:00
    Sell Price: 1236.86
    Updated Value: 11770.06

-------------------------

Buy Date: 
2006-09-12 00:00:00
Account Value: 11770.06
    Buy Price: 1313.0
    Num Shares: 8.0
    Remaining Value: 1266.06
Sell Date: 
2007-12-19 00:00:00
    Sell Price: 1453.0
    Updated Value: 12890.06

-------------------------

Buy Date: 
2009-06-26 00:00:00
Account Value: 12890.06
    Buy Price: 918.9
    Num Shares: 14.0
    Remaining Value: 25.46
Sell Date: 
2010-06-30 00:00:00
    Sell Price: 1030.71
    Updated Value: 14455.4

-------------------------

Buy Date: 
2010-10-22 00:00:00
Account Value: 14455.4
    Buy Price: 1183.08
    Num Shares: 12.0
    Remaining Value: 258.44
Sell Date: 
2011-08-24 00:00:00
    Sell Price: 1177.6
    Updated Value: 14389.64

-------------------------

Buy Date: 
2012-02-02 00:00:00
Account Value: 14389.64
    Buy Price: 1325.54
    Num Shares: 10.0
    Remaining Value: 1134.24
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 22154.84


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 22154.84





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-25 00:00:00
Account Value: 10000
    Buy Price: 1277.89
    Num Shares: 7.0
    Remaining Value: 1054.77
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 1183.43
    Updated Value: 9338.78

-------------------------

Buy Date: 
2003-05-29 00:00:00
Account Value: 9338.78
    Buy Price: 949.64
    Num Shares: 9.0
    Remaining Value: 792.02
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 1110.06
    Updated Value: 10782.56

-------------------------

Buy Date: 
2004-10-04 00:00:00
Account Value: 10782.56
    Buy Price: 1135.17
    Num Shares: 9.0
    Remaining Value: 566.03
Sell Date: 
2007-12-31 00:00:00
    Sell Price: 1468.36
    Updated Value: 13781.27

-------------------------

Buy Date: 
2009-08-19 00:00:00
Account Value: 13781.27
    Buy Price: 996.46
    Num Shares: 13.0
    Remaining Value: 827.29
Sell Date: 
2010-07-15 00:00:00
    Sell Price: 1096.48
    Updated Value: 15081.53

-------------------------

Buy Date: 
2010-10-20 00:00:00
Account Value: 15081.53
    Buy Price: 1178.17
    Num Shares: 12.0
    Remaining Value: 943.49
Sell Date: 
2011-09-06 00:00:00
    Sell Price: 1165.24
    Updated Value: 14926.37

-------------------------

Buy Date: 
2012-02-10 00:00:00
Account Value: 14926.37
    Buy Price: 1342.64
    Num Shares: 11.0
    Remaining Value: 157.33
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23279.99


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23279.99





-----------------------------------------------------------------------
^GSPC Calculations, N = [40, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 1312.83
    Num Shares: 7.0
    Remaining Value: 810.19
Sell Date: 
2001-08-27 00:00:00
    Sell Price: 1179.21
    Updated Value: 9064.66

-------------------------

Buy Date: 
2003-06-17 00:00:00
Account Value: 9064.66
    Buy Price: 1011.66
    Num Shares: 8.0
    Remaining Value: 971.38
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 1380.95
    Updated Value: 12018.98

-------------------------

Buy Date: 
2009-09-14 00:00:00
Account Value: 12018.98
    Buy Price: 1049.34
    Num Shares: 11.0
    Remaining Value: 476.24
Sell Date: 
2011-09-16 00:00:00
    Sell Price: 1216.01
    Updated Value: 13852.35

-------------------------

Buy Date: 
2012-02-09 00:00:00
Account Value: 13852.35
    Buy Price: 1351.95
    Num Shares: 10.0
    Remaining Value: 332.85
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21353.45


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21353.45





-----------------------------------------------------------------------
^GSPC Calculations, N = [50, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-07 00:00:00
Account Value: 10000
    Buy Price: 1276.96
    Num Shares: 7.0
    Remaining Value: 1061.28
Sell Date: 
2001-07-31 00:00:00
    Sell Price: 1211.23
    Updated Value: 9539.89

-------------------------

Buy Date: 
2001-12-11 00:00:00
Account Value: 9539.89
    Buy Price: 1136.76
    Num Shares: 8.0
    Remaining Value: 445.81
Sell Date: 
2002-02-22 00:00:00
    Sell Price: 1089.84
    Updated Value: 9164.53

-------------------------

Buy Date: 
2002-04-24 00:00:00
Account Value: 9164.53
    Buy Price: 1093.14
    Num Shares: 8.0
    Remaining Value: 419.41
Sell Date: 
2002-05-24 00:00:00
    Sell Price: 1083.82
    Updated Value: 9089.97

-------------------------

Buy Date: 
2002-10-18 00:00:00
Account Value: 9089.97
    Buy Price: 884.39
    Num Shares: 10.0
    Remaining Value: 246.07
Sell Date: 
2002-10-31 00:00:00
    Sell Price: 885.76
    Updated Value: 9103.67

-------------------------

Buy Date: 
2002-12-13 00:00:00
Account Value: 9103.67
    Buy Price: 889.48
    Num Shares: 10.0
    Remaining Value: 208.87
Sell Date: 
2003-02-10 00:00:00
    Sell Price: 835.97
    Updated Value: 8568.57

-------------------------

Buy Date: 
2003-05-05 00:00:00
Account Value: 8568.57
    Buy Price: 926.55
    Num Shares: 9.0
    Remaining Value: 229.62
Sell Date: 
2004-04-23 00:00:00
    Sell Price: 1140.6
    Updated Value: 10495.02

-------------------------

Buy Date: 
2004-07-30 00:00:00
Account Value: 10495.02
    Buy Price: 1101.72
    Num Shares: 9.0
    Remaining Value: 579.54
Sell Date: 
2004-08-27 00:00:00
    Sell Price: 1107.77
    Updated Value: 10549.47

-------------------------

Buy Date: 
2004-10-18 00:00:00
Account Value: 10549.47
    Buy Price: 1114.02
    Num Shares: 9.0
    Remaining Value: 523.29
Sell Date: 
2005-03-11 00:00:00
    Sell Price: 1200.08
    Updated Value: 11324.01

-------------------------

Buy Date: 
2005-04-07 00:00:00
Account Value: 11324.01
    Buy Price: 1191.14
    Num Shares: 9.0
    Remaining Value: 603.75
Sell Date: 
2005-05-03 00:00:00
    Sell Price: 1161.17
    Updated Value: 11054.28

-------------------------

Buy Date: 
2005-06-30 00:00:00
Account Value: 11054.28
    Buy Price: 1191.33
    Num Shares: 9.0
    Remaining Value: 332.31
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 1186.57
    Updated Value: 11011.44

-------------------------

Buy Date: 
2005-12-22 00:00:00
Account Value: 11011.44
    Buy Price: 1268.12
    Num Shares: 8.0
    Remaining Value: 866.48
Sell Date: 
2006-06-16 00:00:00
    Sell Price: 1251.54
    Updated Value: 10878.8

-------------------------

Buy Date: 
2006-08-29 00:00:00
Account Value: 10878.8
    Buy Price: 1304.28
    Num Shares: 8.0
    Remaining Value: 444.56
Sell Date: 
2007-04-23 00:00:00
    Sell Price: 1480.93
    Updated Value: 12292.0

-------------------------

Buy Date: 
2007-05-16 00:00:00
Account Value: 12292.0
    Buy Price: 1514.14
    Num Shares: 8.0
    Remaining Value: 178.88
Sell Date: 
2007-08-15 00:00:00
    Sell Price: 1406.7
    Updated Value: 11432.48

-------------------------

Buy Date: 
2007-10-26 00:00:00
Account Value: 11432.48
    Buy Price: 1535.28
    Num Shares: 7.0
    Remaining Value: 685.52
Sell Date: 
2007-12-18 00:00:00
    Sell Price: 1454.98
    Updated Value: 10870.38

-------------------------

Buy Date: 
2008-05-19 00:00:00
Account Value: 10870.38
    Buy Price: 1426.63
    Num Shares: 7.0
    Remaining Value: 883.97
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 1214.91
    Updated Value: 9388.34

-------------------------

Buy Date: 
2009-05-14 00:00:00
Account Value: 9388.34
    Buy Price: 893.07
    Num Shares: 10.0
    Remaining Value: 457.64
Sell Date: 
2010-03-22 00:00:00
    Sell Price: 1165.81
    Updated Value: 12115.74

-------------------------

Buy Date: 
2010-04-16 00:00:00
Account Value: 12115.74
    Buy Price: 1192.13
    Num Shares: 10.0
    Remaining Value: 194.44
Sell Date: 
2010-06-18 00:00:00
    Sell Price: 1117.51
    Updated Value: 11369.54

-------------------------

Buy Date: 
2010-09-13 00:00:00
Account Value: 11369.54
    Buy Price: 1121.9
    Num Shares: 10.0
    Remaining Value: 150.54
Sell Date: 
2011-05-16 00:00:00
    Sell Price: 1329.47
    Updated Value: 13445.24

-------------------------

Buy Date: 
2011-05-25 00:00:00
Account Value: 13445.24
    Buy Price: 1320.47
    Num Shares: 10.0
    Remaining Value: 240.54
Sell Date: 
2011-07-11 00:00:00
    Sell Price: 1319.49
    Updated Value: 13435.44

-------------------------

Buy Date: 
2011-11-14 00:00:00
Account Value: 13435.44
    Buy Price: 1251.78
    Num Shares: 10.0
    Remaining Value: 917.64
Sell Date: 
2012-06-06 00:00:00
    Sell Price: 1315.13
    Updated Value: 14068.94

-------------------------

Buy Date: 
2012-08-14 00:00:00
Account Value: 14068.94
    Buy Price: 1403.93
    Num Shares: 10.0
    Remaining Value: 29.64
Sell Date: 
2012-12-06 00:00:00
    Sell Price: 1413.94
    Updated Value: 14169.04

-------------------------

Buy Date: 
2013-01-29 00:00:00
Account Value: 14169.04
    Buy Price: 1507.84
    Num Shares: 9.0
    Remaining Value: 598.48
Sell Date: 
2013-10-17 00:00:00
    Sell Price: 1733.15
    Updated Value: 16196.83

-------------------------

Buy Date: 
2013-11-01 00:00:00
Account Value: 16196.83
    Buy Price: 1761.64
    Num Shares: 9.0
    Remaining Value: 342.07
Sell Date: 
2014-04-02 00:00:00
    Sell Price: 1890.9
    Updated Value: 17360.17

-------------------------

Buy Date: 
2014-04-10 00:00:00
Account Value: 17360.17
    Buy Price: 1833.08
    Num Shares: 9.0
    Remaining Value: 862.45
Sell Date: 
2014-10-03 00:00:00
    Sell Price: 1967.9
    Updated Value: 18573.55

-------------------------

Buy Date: 
2014-10-15 00:00:00
Account Value: 18573.55
    Buy Price: 1862.49
    Num Shares: 9.0
    Remaining Value: 1811.14
Sell Date: 
2014-11-19 00:00:00
    Sell Price: 2048.72
    Updated Value: 20249.62

-------------------------

Buy Date: 
2014-12-19 00:00:00
Account Value: 20249.62
    Buy Price: 2070.65
    Num Shares: 9.0
    Remaining Value: 1613.77
Sell Date: 
2015-02-19 00:00:00
    Sell Price: 2097.45
    Updated Value: 20490.82

-------------------------

Buy Date: 
2015-02-27 00:00:00
Account Value: 20490.82
    Buy Price: 2104.5
    Num Shares: 9.0
    Remaining Value: 1550.32
Sell Date: 
2015-03-11 00:00:00
    Sell Price: 2040.24
    Updated Value: 19912.48

-------------------------

Buy Date: 
2015-03-19 00:00:00
Account Value: 19912.48
    Buy Price: 2089.27
    Num Shares: 9.0
    Remaining Value: 1109.05
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 20027.59


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 20027.59





-----------------------------------------------------------------------
^GSPC Calculations, N = [50, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-20 00:00:00
Account Value: 10000
    Buy Price: 1210.85
    Num Shares: 8.0
    Remaining Value: 313.2
Sell Date: 
2001-08-15 00:00:00
    Sell Price: 1178.02
    Updated Value: 9737.36

-------------------------

Buy Date: 
2002-01-14 00:00:00
Account Value: 9737.36
    Buy Price: 1138.41
    Num Shares: 8.0
    Remaining Value: 630.08
Sell Date: 
2002-04-09 00:00:00
    Sell Price: 1117.8
    Updated Value: 9572.48

-------------------------

Buy Date: 
2002-12-23 00:00:00
Account Value: 9572.48
    Buy Price: 897.38
    Num Shares: 10.0
    Remaining Value: 598.68
Sell Date: 
2003-03-06 00:00:00
    Sell Price: 822.1
    Updated Value: 8819.68

-------------------------

Buy Date: 
2003-05-22 00:00:00
Account Value: 8819.68
    Buy Price: 931.87
    Num Shares: 9.0
    Remaining Value: 432.85
Sell Date: 
2004-06-14 00:00:00
    Sell Price: 1125.29
    Updated Value: 10560.46

-------------------------

Buy Date: 
2004-10-26 00:00:00
Account Value: 10560.46
    Buy Price: 1111.09
    Num Shares: 9.0
    Remaining Value: 560.65
Sell Date: 
2005-05-05 00:00:00
    Sell Price: 1172.63
    Updated Value: 11114.32

-------------------------

Buy Date: 
2005-07-11 00:00:00
Account Value: 11114.32
    Buy Price: 1219.44
    Num Shares: 9.0
    Remaining Value: 139.36
Sell Date: 
2005-11-16 00:00:00
    Sell Price: 1231.21
    Updated Value: 11220.25

-------------------------

Buy Date: 
2005-12-22 00:00:00
Account Value: 11220.25
    Buy Price: 1268.12
    Num Shares: 8.0
    Remaining Value: 1075.29
Sell Date: 
2006-06-30 00:00:00
    Sell Price: 1270.2
    Updated Value: 11236.89

-------------------------

Buy Date: 
2006-09-26 00:00:00
Account Value: 11236.89
    Buy Price: 1336.35
    Num Shares: 8.0
    Remaining Value: 546.09
Sell Date: 
2007-09-19 00:00:00
    Sell Price: 1529.03
    Updated Value: 12778.33

-------------------------

Buy Date: 
2007-11-06 00:00:00
Account Value: 12778.33
    Buy Price: 1520.27
    Num Shares: 8.0
    Remaining Value: 616.17
Sell Date: 
2007-12-21 00:00:00
    Sell Price: 1484.46
    Updated Value: 12491.85

-------------------------

Buy Date: 
2008-06-11 00:00:00
Account Value: 12491.85
    Buy Price: 1335.49
    Num Shares: 9.0
    Remaining Value: 472.44
Sell Date: 
2008-07-23 00:00:00
    Sell Price: 1282.19
    Updated Value: 12012.15

-------------------------

Buy Date: 
2009-05-27 00:00:00
Account Value: 12012.15
    Buy Price: 893.06
    Num Shares: 13.0
    Remaining Value: 402.37
Sell Date: 
2010-07-01 00:00:00
    Sell Price: 1027.37
    Updated Value: 13758.18

-------------------------

Buy Date: 
2010-10-21 00:00:00
Account Value: 13758.18
    Buy Price: 1180.26
    Num Shares: 11.0
    Remaining Value: 775.32
Sell Date: 
2011-07-20 00:00:00
    Sell Price: 1325.84
    Updated Value: 15359.56

-------------------------

Buy Date: 
2011-12-22 00:00:00
Account Value: 15359.56
    Buy Price: 1254.0
    Num Shares: 12.0
    Remaining Value: 311.56
Sell Date: 
2012-06-29 00:00:00
    Sell Price: 1362.16
    Updated Value: 16657.48

-------------------------

Buy Date: 
2012-08-31 00:00:00
Account Value: 16657.48
    Buy Price: 1406.58
    Num Shares: 11.0
    Remaining Value: 1185.1
Sell Date: 
2013-01-10 00:00:00
    Sell Price: 1472.12
    Updated Value: 17378.42

-------------------------

Buy Date: 
2013-01-28 00:00:00
Account Value: 17378.42
    Buy Price: 1500.18
    Num Shares: 11.0
    Remaining Value: 876.44
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23999.1


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23999.1





-----------------------------------------------------------------------
^GSPC Calculations, N = [50, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-14 00:00:00
Account Value: 10000
    Buy Price: 1219.87
    Num Shares: 8.0
    Remaining Value: 241.04
Sell Date: 
2001-08-08 00:00:00
    Sell Price: 1183.53
    Updated Value: 9709.28

-------------------------

Buy Date: 
2002-05-03 00:00:00
Account Value: 9709.28
    Buy Price: 1073.43
    Num Shares: 9.0
    Remaining Value: 48.41
Sell Date: 
2002-05-22 00:00:00
    Sell Price: 1086.02
    Updated Value: 9822.59

-------------------------

Buy Date: 
2003-05-21 00:00:00
Account Value: 9822.59
    Buy Price: 923.42
    Num Shares: 10.0
    Remaining Value: 588.39
Sell Date: 
2004-08-27 00:00:00
    Sell Price: 1107.77
    Updated Value: 11666.09

-------------------------

Buy Date: 
2004-11-11 00:00:00
Account Value: 11666.09
    Buy Price: 1173.48
    Num Shares: 9.0
    Remaining Value: 1104.77
Sell Date: 
2006-07-26 00:00:00
    Sell Price: 1268.4
    Updated Value: 12520.37

-------------------------

Buy Date: 
2006-09-22 00:00:00
Account Value: 12520.37
    Buy Price: 1314.78
    Num Shares: 9.0
    Remaining Value: 687.35
Sell Date: 
2007-12-28 00:00:00
    Sell Price: 1478.49
    Updated Value: 13993.76

-------------------------

Buy Date: 
2009-07-02 00:00:00
Account Value: 13993.76
    Buy Price: 896.42
    Num Shares: 15.0
    Remaining Value: 547.46
Sell Date: 
2010-07-13 00:00:00
    Sell Price: 1095.34
    Updated Value: 16977.56

-------------------------

Buy Date: 
2010-11-02 00:00:00
Account Value: 16977.56
    Buy Price: 1193.57
    Num Shares: 14.0
    Remaining Value: 267.58
Sell Date: 
2011-08-22 00:00:00
    Sell Price: 1123.82
    Updated Value: 16001.06

-------------------------

Buy Date: 
2012-02-08 00:00:00
Account Value: 16001.06
    Buy Price: 1349.96
    Num Shares: 11.0
    Remaining Value: 1151.5
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 24274.16


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 24274.16





-----------------------------------------------------------------------
^GSPC Calculations, N = [50, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-05 00:00:00
Account Value: 10000
    Buy Price: 1283.57
    Num Shares: 7.0
    Remaining Value: 1015.01
Sell Date: 
2001-08-20 00:00:00
    Sell Price: 1171.41
    Updated Value: 9214.88

-------------------------

Buy Date: 
2003-06-04 00:00:00
Account Value: 9214.88
    Buy Price: 986.24
    Num Shares: 9.0
    Remaining Value: 338.72
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 1110.06
    Updated Value: 10329.26

-------------------------

Buy Date: 
2004-10-18 00:00:00
Account Value: 10329.26
    Buy Price: 1114.02
    Num Shares: 9.0
    Remaining Value: 303.08
Sell Date: 
2008-01-10 00:00:00
    Sell Price: 1420.33
    Updated Value: 13086.05

-------------------------

Buy Date: 
2009-08-20 00:00:00
Account Value: 13086.05
    Buy Price: 1007.37
    Num Shares: 12.0
    Remaining Value: 997.61
Sell Date: 
2010-07-26 00:00:00
    Sell Price: 1115.01
    Updated Value: 14377.73

-------------------------

Buy Date: 
2010-10-28 00:00:00
Account Value: 14377.73
    Buy Price: 1183.78
    Num Shares: 12.0
    Remaining Value: 172.37
Sell Date: 
2011-09-14 00:00:00
    Sell Price: 1188.68
    Updated Value: 14436.53

-------------------------

Buy Date: 
2012-02-16 00:00:00
Account Value: 14436.53
    Buy Price: 1358.04
    Num Shares: 10.0
    Remaining Value: 856.13
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21876.73


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21876.73





-----------------------------------------------------------------------
^GSPC Calculations, N = [50, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-31 00:00:00
Account Value: 10000
    Buy Price: 1255.82
    Num Shares: 7.0
    Remaining Value: 1209.26
Sell Date: 
2001-08-31 00:00:00
    Sell Price: 1133.58
    Updated Value: 9144.32

-------------------------

Buy Date: 
2003-06-24 00:00:00
Account Value: 9144.32
    Buy Price: 983.45
    Num Shares: 9.0
    Remaining Value: 293.27
Sell Date: 
2008-01-17 00:00:00
    Sell Price: 1333.25
    Updated Value: 12292.52

-------------------------

Buy Date: 
2009-09-21 00:00:00
Account Value: 12292.52
    Buy Price: 1064.66
    Num Shares: 11.0
    Remaining Value: 581.26
Sell Date: 
2011-09-27 00:00:00
    Sell Price: 1175.38
    Updated Value: 13510.44

-------------------------

Buy Date: 
2012-02-15 00:00:00
Account Value: 13510.44
    Buy Price: 1343.23
    Num Shares: 10.0
    Remaining Value: 78.14
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21098.74


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21098.74





-----------------------------------------------------------------------
^GSPC Calculations, N = [60, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-15 00:00:00
Account Value: 10000
    Buy Price: 1214.36
    Num Shares: 8.0
    Remaining Value: 285.12
Sell Date: 
2001-08-03 00:00:00
    Sell Price: 1214.35
    Updated Value: 9999.92

-------------------------

Buy Date: 
2001-12-18 00:00:00
Account Value: 9999.92
    Buy Price: 1142.92
    Num Shares: 8.0
    Remaining Value: 856.56
Sell Date: 
2002-02-27 00:00:00
    Sell Price: 1109.89
    Updated Value: 9735.68

-------------------------

Buy Date: 
2002-05-03 00:00:00
Account Value: 9735.68
    Buy Price: 1073.43
    Num Shares: 9.0
    Remaining Value: 74.81
Sell Date: 
2002-06-05 00:00:00
    Sell Price: 1049.9
    Updated Value: 9523.91

-------------------------

Buy Date: 
2002-10-22 00:00:00
Account Value: 9523.91
    Buy Price: 890.16
    Num Shares: 10.0
    Remaining Value: 622.31
Sell Date: 
2002-11-08 00:00:00
    Sell Price: 894.74
    Updated Value: 9569.71

-------------------------

Buy Date: 
2002-12-23 00:00:00
Account Value: 9569.71
    Buy Price: 897.38
    Num Shares: 10.0
    Remaining Value: 595.91
Sell Date: 
2003-02-20 00:00:00
    Sell Price: 837.1
    Updated Value: 8966.91

-------------------------

Buy Date: 
2003-05-08 00:00:00
Account Value: 8966.91
    Buy Price: 920.27
    Num Shares: 9.0
    Remaining Value: 684.48
Sell Date: 
2003-09-18 00:00:00
    Sell Price: 1039.58
    Updated Value: 10040.7

-------------------------

Buy Date: 
2003-09-19 00:00:00
Account Value: 10040.7
    Buy Price: 1036.3
    Num Shares: 9.0
    Remaining Value: 714.0
Sell Date: 
2004-04-28 00:00:00
    Sell Price: 1122.41
    Updated Value: 10815.69

-------------------------

Buy Date: 
2004-06-21 00:00:00
Account Value: 10815.69
    Buy Price: 1130.3
    Num Shares: 9.0
    Remaining Value: 642.99
Sell Date: 
2004-07-07 00:00:00
    Sell Price: 1118.33
    Updated Value: 10707.96

-------------------------

Buy Date: 
2004-08-11 00:00:00
Account Value: 10707.96
    Buy Price: 1075.79
    Num Shares: 9.0
    Remaining Value: 1025.85
Sell Date: 
2004-09-03 00:00:00
    Sell Price: 1113.63
    Updated Value: 11048.52

-------------------------

Buy Date: 
2004-10-25 00:00:00
Account Value: 11048.52
    Buy Price: 1094.8
    Num Shares: 10.0
    Remaining Value: 100.52
Sell Date: 
2005-03-22 00:00:00
    Sell Price: 1171.71
    Updated Value: 11817.62

-------------------------

Buy Date: 
2005-04-18 00:00:00
Account Value: 11817.62
    Buy Price: 1145.98
    Num Shares: 10.0
    Remaining Value: 357.82
Sell Date: 
2005-05-12 00:00:00
    Sell Price: 1159.36
    Updated Value: 11951.42

-------------------------

Buy Date: 
2005-07-12 00:00:00
Account Value: 11951.42
    Buy Price: 1222.21
    Num Shares: 9.0
    Remaining Value: 951.53
Sell Date: 
2005-10-20 00:00:00
    Sell Price: 1177.8
    Updated Value: 11551.73

-------------------------

Buy Date: 
2006-01-03 00:00:00
Account Value: 11551.73
    Buy Price: 1268.8
    Num Shares: 9.0
    Remaining Value: 132.53
Sell Date: 
2006-06-21 00:00:00
    Sell Price: 1252.2
    Updated Value: 11402.33

-------------------------

Buy Date: 
2006-09-07 00:00:00
Account Value: 11402.33
    Buy Price: 1294.02
    Num Shares: 8.0
    Remaining Value: 1050.17
Sell Date: 
2007-05-04 00:00:00
    Sell Price: 1505.62
    Updated Value: 13095.13

-------------------------

Buy Date: 
2007-05-29 00:00:00
Account Value: 13095.13
    Buy Price: 1518.11
    Num Shares: 8.0
    Remaining Value: 950.25
Sell Date: 
2007-08-21 00:00:00
    Sell Price: 1447.12
    Updated Value: 12527.21

-------------------------

Buy Date: 
2007-11-02 00:00:00
Account Value: 12527.21
    Buy Price: 1509.65
    Num Shares: 8.0
    Remaining Value: 450.01
Sell Date: 
2007-12-27 00:00:00
    Sell Price: 1476.27
    Updated Value: 12260.17

-------------------------

Buy Date: 
2008-06-02 00:00:00
Account Value: 12260.17
    Buy Price: 1385.67
    Num Shares: 8.0
    Remaining Value: 1174.81
Sell Date: 
2008-07-23 00:00:00
    Sell Price: 1282.19
    Updated Value: 11432.33

-------------------------

Buy Date: 
2009-02-25 00:00:00
Account Value: 11432.33
    Buy Price: 764.9
    Num Shares: 14.0
    Remaining Value: 723.73
Sell Date: 
2009-03-11 00:00:00
    Sell Price: 721.36
    Updated Value: 10822.77

-------------------------

Buy Date: 
2009-05-26 00:00:00
Account Value: 10822.77
    Buy Price: 910.33
    Num Shares: 11.0
    Remaining Value: 809.14
Sell Date: 
2010-04-05 00:00:00
    Sell Price: 1187.44
    Updated Value: 13870.98

-------------------------

Buy Date: 
2010-04-27 00:00:00
Account Value: 13870.98
    Buy Price: 1183.71
    Num Shares: 11.0
    Remaining Value: 850.17
Sell Date: 
2010-06-24 00:00:00
    Sell Price: 1073.69
    Updated Value: 12660.76

-------------------------

Buy Date: 
2010-09-01 00:00:00
Account Value: 12660.76
    Buy Price: 1080.29
    Num Shares: 11.0
    Remaining Value: 777.57
Sell Date: 
2010-09-10 00:00:00
    Sell Price: 1109.55
    Updated Value: 12982.62

-------------------------

Buy Date: 
2010-09-27 00:00:00
Account Value: 12982.62
    Buy Price: 1142.16
    Num Shares: 11.0
    Remaining Value: 418.86
Sell Date: 
2011-05-17 00:00:00
    Sell Price: 1328.98
    Updated Value: 15037.64

-------------------------

Buy Date: 
2011-06-07 00:00:00
Account Value: 15037.64
    Buy Price: 1284.94
    Num Shares: 11.0
    Remaining Value: 903.3
Sell Date: 
2011-07-21 00:00:00
    Sell Price: 1343.8
    Updated Value: 15685.1

-------------------------

Buy Date: 
2011-11-15 00:00:00
Account Value: 15685.1
    Buy Price: 1257.81
    Num Shares: 12.0
    Remaining Value: 591.38
Sell Date: 
2012-02-06 00:00:00
    Sell Price: 1344.33
    Updated Value: 16723.34

-------------------------

Buy Date: 
2012-02-15 00:00:00
Account Value: 16723.34
    Buy Price: 1343.23
    Num Shares: 12.0
    Remaining Value: 604.58
Sell Date: 
2012-06-13 00:00:00
    Sell Price: 1314.88
    Updated Value: 16383.14

-------------------------

Buy Date: 
2012-08-20 00:00:00
Account Value: 16383.14
    Buy Price: 1418.13
    Num Shares: 11.0
    Remaining Value: 783.71
Sell Date: 
2012-12-17 00:00:00
    Sell Price: 1430.36
    Updated Value: 16517.67

-------------------------

Buy Date: 
2013-02-06 00:00:00
Account Value: 16517.67
    Buy Price: 1512.12
    Num Shares: 10.0
    Remaining Value: 1396.47
Sell Date: 
2013-08-20 00:00:00
    Sell Price: 1652.35
    Updated Value: 17919.97

-------------------------

Buy Date: 
2013-09-04 00:00:00
Account Value: 17919.97
    Buy Price: 1653.08
    Num Shares: 10.0
    Remaining Value: 1389.17
Sell Date: 
2013-10-23 00:00:00
    Sell Price: 1746.38
    Updated Value: 18852.97

-------------------------

Buy Date: 
2013-11-13 00:00:00
Account Value: 18852.97
    Buy Price: 1782.0
    Num Shares: 10.0
    Remaining Value: 1032.97
Sell Date: 
2014-04-07 00:00:00
    Sell Price: 1845.04
    Updated Value: 19483.37

-------------------------

Buy Date: 
2014-04-24 00:00:00
Account Value: 19483.37
    Buy Price: 1878.61
    Num Shares: 10.0
    Remaining Value: 697.27
Sell Date: 
2014-10-13 00:00:00
    Sell Price: 1874.74
    Updated Value: 19444.67

-------------------------

Buy Date: 
2014-10-29 00:00:00
Account Value: 19444.67
    Buy Price: 1982.3
    Num Shares: 9.0
    Remaining Value: 1603.97
Sell Date: 
2014-11-26 00:00:00
    Sell Price: 2072.83
    Updated Value: 20259.44

-------------------------

Buy Date: 
2014-12-29 00:00:00
Account Value: 20259.44
    Buy Price: 2090.57
    Num Shares: 9.0
    Remaining Value: 1444.31
Sell Date: 
2015-02-26 00:00:00
    Sell Price: 2110.74
    Updated Value: 20440.97

-------------------------

Buy Date: 
2015-03-16 00:00:00
Account Value: 20440.97
    Buy Price: 2081.19
    Num Shares: 9.0
    Remaining Value: 1710.26
Sell Date: 
2015-04-07 00:00:00
    Sell Price: 2076.33
    Updated Value: 20397.23

-------------------------

Buy Date: 
2015-04-09 00:00:00
Account Value: 20397.23
    Buy Price: 2091.18
    Num Shares: 9.0
    Remaining Value: 1576.61
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 20495.15


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 20495.15





-----------------------------------------------------------------------
^GSPC Calculations, N = [60, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-19 00:00:00
Account Value: 10000
    Buy Price: 1215.02
    Num Shares: 8.0
    Remaining Value: 279.84
Sell Date: 
2001-08-30 00:00:00
    Sell Price: 1129.03
    Updated Value: 9312.08

-------------------------

Buy Date: 
2002-01-23 00:00:00
Account Value: 9312.08
    Buy Price: 1128.18
    Num Shares: 8.0
    Remaining Value: 286.64
Sell Date: 
2002-04-12 00:00:00
    Sell Price: 1111.01
    Updated Value: 9174.72

-------------------------

Buy Date: 
2003-01-03 00:00:00
Account Value: 9174.72
    Buy Price: 908.59
    Num Shares: 10.0
    Remaining Value: 88.82
Sell Date: 
2003-03-17 00:00:00
    Sell Price: 862.79
    Updated Value: 8716.72

-------------------------

Buy Date: 
2003-06-02 00:00:00
Account Value: 8716.72
    Buy Price: 967.0
    Num Shares: 9.0
    Remaining Value: 13.72
Sell Date: 
2004-06-03 00:00:00
    Sell Price: 1116.64
    Updated Value: 10063.48

-------------------------

Buy Date: 
2004-11-05 00:00:00
Account Value: 10063.48
    Buy Price: 1166.17
    Num Shares: 8.0
    Remaining Value: 734.12
Sell Date: 
2005-05-11 00:00:00
    Sell Price: 1171.11
    Updated Value: 10103.0

-------------------------

Buy Date: 
2005-07-22 00:00:00
Account Value: 10103.0
    Buy Price: 1233.68
    Num Shares: 8.0
    Remaining Value: 233.56
Sell Date: 
2005-12-01 00:00:00
    Sell Price: 1264.67
    Updated Value: 10350.92

-------------------------

Buy Date: 
2006-01-06 00:00:00
Account Value: 10350.92
    Buy Price: 1285.45
    Num Shares: 8.0
    Remaining Value: 67.32
Sell Date: 
2006-07-13 00:00:00
    Sell Price: 1242.28
    Updated Value: 10005.56

-------------------------

Buy Date: 
2006-10-04 00:00:00
Account Value: 10005.56
    Buy Price: 1350.2
    Num Shares: 7.0
    Remaining Value: 554.16
Sell Date: 
2007-09-27 00:00:00
    Sell Price: 1531.38
    Updated Value: 11273.82

-------------------------

Buy Date: 
2007-11-21 00:00:00
Account Value: 11273.82
    Buy Price: 1416.77
    Num Shares: 7.0
    Remaining Value: 1356.43
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 1390.19
    Updated Value: 11087.76

-------------------------

Buy Date: 
2008-06-19 00:00:00
Account Value: 11087.76
    Buy Price: 1342.83
    Num Shares: 8.0
    Remaining Value: 345.12
Sell Date: 
2008-08-01 00:00:00
    Sell Price: 1260.31
    Updated Value: 10427.6

-------------------------

Buy Date: 
2009-06-05 00:00:00
Account Value: 10427.6
    Buy Price: 940.09
    Num Shares: 11.0
    Remaining Value: 86.61
Sell Date: 
2010-07-14 00:00:00
    Sell Price: 1095.17
    Updated Value: 12133.48

-------------------------

Buy Date: 
2010-10-20 00:00:00
Account Value: 12133.48
    Buy Price: 1178.17
    Num Shares: 10.0
    Remaining Value: 351.78
Sell Date: 
2011-07-28 00:00:00
    Sell Price: 1300.67
    Updated Value: 13358.48

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 13358.48
    Buy Price: 1257.6
    Num Shares: 10.0
    Remaining Value: 782.48
Sell Date: 
2012-07-09 00:00:00
    Sell Price: 1352.46
    Updated Value: 14307.08

-------------------------

Buy Date: 
2012-09-11 00:00:00
Account Value: 14307.08
    Buy Price: 1433.56
    Num Shares: 9.0
    Remaining Value: 1405.04
Sell Date: 
2013-01-17 00:00:00
    Sell Price: 1480.94
    Updated Value: 14733.5

-------------------------

Buy Date: 
2013-02-08 00:00:00
Account Value: 14733.5
    Buy Price: 1517.93
    Num Shares: 9.0
    Remaining Value: 1072.13
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 19990.67


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 19990.67





-----------------------------------------------------------------------
^GSPC Calculations, N = [60, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-27 00:00:00
Account Value: 10000
    Buy Price: 1211.07
    Num Shares: 8.0
    Remaining Value: 311.44
Sell Date: 
2001-08-17 00:00:00
    Sell Price: 1161.97
    Updated Value: 9607.2

-------------------------

Buy Date: 
2002-05-17 00:00:00
Account Value: 9607.2
    Buy Price: 1106.59
    Num Shares: 8.0
    Remaining Value: 754.48
Sell Date: 
2002-06-07 00:00:00
    Sell Price: 1027.53
    Updated Value: 8974.72

-------------------------

Buy Date: 
2003-06-02 00:00:00
Account Value: 8974.72
    Buy Price: 967.0
    Num Shares: 9.0
    Remaining Value: 271.72
Sell Date: 
2004-09-03 00:00:00
    Sell Price: 1113.63
    Updated Value: 10294.39

-------------------------

Buy Date: 
2004-11-17 00:00:00
Account Value: 10294.39
    Buy Price: 1181.94
    Num Shares: 8.0
    Remaining Value: 838.87
Sell Date: 
2006-08-04 00:00:00
    Sell Price: 1279.36
    Updated Value: 11073.75

-------------------------

Buy Date: 
2006-09-29 00:00:00
Account Value: 11073.75
    Buy Price: 1335.85
    Num Shares: 8.0
    Remaining Value: 386.95
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 1390.19
    Updated Value: 11508.47

-------------------------

Buy Date: 
2009-07-08 00:00:00
Account Value: 11508.47
    Buy Price: 879.56
    Num Shares: 13.0
    Remaining Value: 74.19
Sell Date: 
2010-07-22 00:00:00
    Sell Price: 1093.67
    Updated Value: 14291.9

-------------------------

Buy Date: 
2010-11-09 00:00:00
Account Value: 14291.9
    Buy Price: 1213.4
    Num Shares: 11.0
    Remaining Value: 944.5
Sell Date: 
2011-08-24 00:00:00
    Sell Price: 1177.6
    Updated Value: 13898.1

-------------------------

Buy Date: 
2012-02-16 00:00:00
Account Value: 13898.1
    Buy Price: 1358.04
    Num Shares: 10.0
    Remaining Value: 317.7
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21338.3


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21338.3





-----------------------------------------------------------------------
^GSPC Calculations, N = [60, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-15 00:00:00
Account Value: 10000
    Buy Price: 1214.36
    Num Shares: 8.0
    Remaining Value: 285.12
Sell Date: 
2001-08-30 00:00:00
    Sell Price: 1129.03
    Updated Value: 9317.36

-------------------------

Buy Date: 
2003-06-09 00:00:00
Account Value: 9317.36
    Buy Price: 975.93
    Num Shares: 9.0
    Remaining Value: 533.99
Sell Date: 
2004-10-06 00:00:00
    Sell Price: 1142.05
    Updated Value: 10812.44

-------------------------

Buy Date: 
2004-11-04 00:00:00
Account Value: 10812.44
    Buy Price: 1161.67
    Num Shares: 9.0
    Remaining Value: 357.41
Sell Date: 
2008-01-18 00:00:00
    Sell Price: 1325.19
    Updated Value: 12284.12

-------------------------

Buy Date: 
2009-08-20 00:00:00
Account Value: 12284.12
    Buy Price: 1007.37
    Num Shares: 12.0
    Remaining Value: 195.68
Sell Date: 
2010-08-05 00:00:00
    Sell Price: 1125.81
    Updated Value: 13705.4

-------------------------

Buy Date: 
2010-11-05 00:00:00
Account Value: 13705.4
    Buy Price: 1225.85
    Num Shares: 11.0
    Remaining Value: 221.05
Sell Date: 
2011-09-21 00:00:00
    Sell Price: 1166.76
    Updated Value: 13055.41

-------------------------

Buy Date: 
2012-02-24 00:00:00
Account Value: 13055.41
    Buy Price: 1365.74
    Num Shares: 9.0
    Remaining Value: 763.75
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 19682.29


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 19682.29





-----------------------------------------------------------------------
^GSPC Calculations, N = [60, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2003-07-01 00:00:00
Account Value: 10000
    Buy Price: 982.32
    Num Shares: 10.0
    Remaining Value: 176.8
Sell Date: 
2008-01-25 00:00:00
    Sell Price: 1330.61
    Updated Value: 13482.9

-------------------------

Buy Date: 
2009-09-28 00:00:00
Account Value: 13482.9
    Buy Price: 1062.98
    Num Shares: 12.0
    Remaining Value: 727.14
Sell Date: 
2011-10-05 00:00:00
    Sell Price: 1144.03
    Updated Value: 14455.5

-------------------------

Buy Date: 
2012-02-24 00:00:00
Account Value: 14455.5
    Buy Price: 1365.74
    Num Shares: 10.0
    Remaining Value: 798.1
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21818.7


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21818.7





-----------------------------------------------------------------------
^GSPC Calculations, N = [80, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-01 00:00:00
Account Value: 10000
    Buy Price: 1215.93
    Num Shares: 8.0
    Remaining Value: 272.56
Sell Date: 
2001-09-24 00:00:00
    Sell Price: 1003.45
    Updated Value: 8300.16

-------------------------

Buy Date: 
2002-02-05 00:00:00
Account Value: 8300.16
    Buy Price: 1090.02
    Num Shares: 7.0
    Remaining Value: 670.02
Sell Date: 
2002-04-29 00:00:00
    Sell Price: 1065.45
    Updated Value: 8128.17

-------------------------

Buy Date: 
2003-01-31 00:00:00
Account Value: 8128.17
    Buy Price: 855.7
    Num Shares: 9.0
    Remaining Value: 426.87
Sell Date: 
2003-04-01 00:00:00
    Sell Price: 858.48
    Updated Value: 8153.19

-------------------------

Buy Date: 
2003-06-17 00:00:00
Account Value: 8153.19
    Buy Price: 1011.66
    Num Shares: 8.0
    Remaining Value: 59.91
Sell Date: 
2004-06-17 00:00:00
    Sell Price: 1132.05
    Updated Value: 9116.31

-------------------------

Buy Date: 
2004-12-02 00:00:00
Account Value: 9116.31
    Buy Price: 1190.33
    Num Shares: 7.0
    Remaining Value: 784.0
Sell Date: 
2005-05-04 00:00:00
    Sell Price: 1175.65
    Updated Value: 9013.55

-------------------------

Buy Date: 
2005-08-12 00:00:00
Account Value: 9013.55
    Buy Price: 1230.39
    Num Shares: 7.0
    Remaining Value: 400.82
Sell Date: 
2005-12-08 00:00:00
    Sell Price: 1255.84
    Updated Value: 9191.7

-------------------------

Buy Date: 
2005-12-16 00:00:00
Account Value: 9191.7
    Buy Price: 1267.32
    Num Shares: 7.0
    Remaining Value: 320.46
Sell Date: 
2005-12-28 00:00:00
    Sell Price: 1258.17
    Updated Value: 9127.65

-------------------------

Buy Date: 
2006-01-23 00:00:00
Account Value: 9127.65
    Buy Price: 1263.82
    Num Shares: 7.0
    Remaining Value: 280.91
Sell Date: 
2006-07-26 00:00:00
    Sell Price: 1268.4
    Updated Value: 9159.71

-------------------------

Buy Date: 
2006-10-17 00:00:00
Account Value: 9159.71
    Buy Price: 1364.05
    Num Shares: 6.0
    Remaining Value: 975.41
Sell Date: 
2007-10-08 00:00:00
    Sell Price: 1552.58
    Updated Value: 10290.89

-------------------------

Buy Date: 
2007-12-14 00:00:00
Account Value: 10290.89
    Buy Price: 1467.95
    Num Shares: 7.0
    Remaining Value: 15.24
Sell Date: 
2008-02-01 00:00:00
    Sell Price: 1395.42
    Updated Value: 9783.18

-------------------------

Buy Date: 
2008-07-03 00:00:00
Account Value: 9783.18
    Buy Price: 1262.9
    Num Shares: 7.0
    Remaining Value: 942.88
Sell Date: 
2008-08-25 00:00:00
    Sell Price: 1266.84
    Updated Value: 9810.76

-------------------------

Buy Date: 
2009-06-26 00:00:00
Account Value: 9810.76
    Buy Price: 918.9
    Num Shares: 10.0
    Remaining Value: 621.76
Sell Date: 
2010-08-04 00:00:00
    Sell Price: 1127.24
    Updated Value: 11894.16

-------------------------

Buy Date: 
2010-10-27 00:00:00
Account Value: 11894.16
    Buy Price: 1182.45
    Num Shares: 10.0
    Remaining Value: 69.66
Sell Date: 
2011-08-17 00:00:00
    Sell Price: 1193.89
    Updated Value: 12008.56

-------------------------

Buy Date: 
2012-01-18 00:00:00
Account Value: 12008.56
    Buy Price: 1308.04
    Num Shares: 9.0
    Remaining Value: 236.2
Sell Date: 
2012-07-23 00:00:00
    Sell Price: 1350.52
    Updated Value: 12390.88

-------------------------

Buy Date: 
2012-09-26 00:00:00
Account Value: 12390.88
    Buy Price: 1433.32
    Num Shares: 8.0
    Remaining Value: 924.32
Sell Date: 
2013-02-05 00:00:00
    Sell Price: 1511.29
    Updated Value: 13014.64

-------------------------

Buy Date: 
2013-03-07 00:00:00
Account Value: 13014.64
    Buy Price: 1544.26
    Num Shares: 8.0
    Remaining Value: 660.56
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17477.04


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17477.04





-----------------------------------------------------------------------
^GSPC Calculations, N = [80, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-27 00:00:00
Account Value: 10000
    Buy Price: 1205.82
    Num Shares: 8.0
    Remaining Value: 353.44
Sell Date: 
2001-09-05 00:00:00
    Sell Price: 1131.74
    Updated Value: 9407.36

-------------------------

Buy Date: 
2002-06-03 00:00:00
Account Value: 9407.36
    Buy Price: 1040.68
    Num Shares: 9.0
    Remaining Value: 41.24
Sell Date: 
2002-06-28 00:00:00
    Sell Price: 989.82
    Updated Value: 8949.62

-------------------------

Buy Date: 
2003-06-13 00:00:00
Account Value: 8949.62
    Buy Price: 988.61
    Num Shares: 9.0
    Remaining Value: 52.13
Sell Date: 
2004-08-27 00:00:00
    Sell Price: 1107.77
    Updated Value: 10022.06

-------------------------

Buy Date: 
2004-12-06 00:00:00
Account Value: 10022.06
    Buy Price: 1190.25
    Num Shares: 8.0
    Remaining Value: 500.06
Sell Date: 
2006-08-23 00:00:00
    Sell Price: 1292.99
    Updated Value: 10843.98

-------------------------

Buy Date: 
2006-10-17 00:00:00
Account Value: 10843.98
    Buy Price: 1364.05
    Num Shares: 7.0
    Remaining Value: 1295.63
Sell Date: 
2008-01-22 00:00:00
    Sell Price: 1310.5
    Updated Value: 10469.13

-------------------------

Buy Date: 
2009-07-17 00:00:00
Account Value: 10469.13
    Buy Price: 940.38
    Num Shares: 11.0
    Remaining Value: 124.95
Sell Date: 
2010-08-13 00:00:00
    Sell Price: 1079.25
    Updated Value: 11996.7

-------------------------

Buy Date: 
2010-12-02 00:00:00
Account Value: 11996.7
    Buy Price: 1221.53
    Num Shares: 9.0
    Remaining Value: 1002.93
Sell Date: 
2011-09-07 00:00:00
    Sell Price: 1198.62
    Updated Value: 11790.51

-------------------------

Buy Date: 
2012-02-21 00:00:00
Account Value: 11790.51
    Buy Price: 1362.21
    Num Shares: 8.0
    Remaining Value: 892.83
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17709.31


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17709.31





-----------------------------------------------------------------------
^GSPC Calculations, N = [80, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-11 00:00:00
Account Value: 10000
    Buy Price: 1180.18
    Num Shares: 8.0
    Remaining Value: 558.56
Sell Date: 
2001-09-20 00:00:00
    Sell Price: 984.54
    Updated Value: 8434.88

-------------------------

Buy Date: 
2003-06-23 00:00:00
Account Value: 8434.88
    Buy Price: 981.64
    Num Shares: 8.0
    Remaining Value: 581.76
Sell Date: 
2004-10-22 00:00:00
    Sell Price: 1095.74
    Updated Value: 9347.68

-------------------------

Buy Date: 
2004-12-02 00:00:00
Account Value: 9347.68
    Buy Price: 1190.33
    Num Shares: 7.0
    Remaining Value: 1015.37
Sell Date: 
2008-02-05 00:00:00
    Sell Price: 1336.64
    Updated Value: 10371.85

-------------------------

Buy Date: 
2009-08-26 00:00:00
Account Value: 10371.85
    Buy Price: 1028.12
    Num Shares: 10.0
    Remaining Value: 90.65
Sell Date: 
2010-08-25 00:00:00
    Sell Price: 1055.33
    Updated Value: 10643.95

-------------------------

Buy Date: 
2010-11-11 00:00:00
Account Value: 10643.95
    Buy Price: 1213.54
    Num Shares: 8.0
    Remaining Value: 935.63
Sell Date: 
2011-09-26 00:00:00
    Sell Price: 1162.95
    Updated Value: 10239.23

-------------------------

Buy Date: 
2012-03-13 00:00:00
Account Value: 10239.23
    Buy Price: 1395.95
    Num Shares: 7.0
    Remaining Value: 467.58
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 15182.0


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 15182.0





-----------------------------------------------------------------------
^GSPC Calculations, N = [80, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2003-07-15 00:00:00
Account Value: 10000
    Buy Price: 1000.42
    Num Shares: 9.0
    Remaining Value: 996.22
Sell Date: 
2008-02-11 00:00:00
    Sell Price: 1339.13
    Updated Value: 13048.39

-------------------------

Buy Date: 
2009-10-08 00:00:00
Account Value: 13048.39
    Buy Price: 1065.48
    Num Shares: 12.0
    Remaining Value: 262.63
Sell Date: 
2010-10-12 00:00:00
    Sell Price: 1169.77
    Updated Value: 14299.87

-------------------------

Buy Date: 
2010-10-19 00:00:00
Account Value: 14299.87
    Buy Price: 1165.9
    Num Shares: 12.0
    Remaining Value: 309.07
Sell Date: 
2011-10-25 00:00:00
    Sell Price: 1229.05
    Updated Value: 15057.67

-------------------------

Buy Date: 
2012-03-19 00:00:00
Account Value: 15057.67
    Buy Price: 1409.75
    Num Shares: 10.0
    Remaining Value: 960.17
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 21980.77


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 21980.77





-----------------------------------------------------------------------
^GSPC Calculations, N = [100, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-16 00:00:00
Account Value: 10000
    Buy Price: 1181.66
    Num Shares: 8.0
    Remaining Value: 546.72
Sell Date: 
2001-10-08 00:00:00
    Sell Price: 1062.44
    Updated Value: 9046.24

-------------------------

Buy Date: 
2002-02-20 00:00:00
Account Value: 9046.24
    Buy Price: 1097.98
    Num Shares: 8.0
    Remaining Value: 262.4
Sell Date: 
2002-05-03 00:00:00
    Sell Price: 1073.43
    Updated Value: 8849.84

-------------------------

Buy Date: 
2003-01-02 00:00:00
Account Value: 8849.84
    Buy Price: 909.03
    Num Shares: 9.0
    Remaining Value: 668.57
Sell Date: 
2003-01-15 00:00:00
    Sell Price: 918.22
    Updated Value: 8932.55

-------------------------

Buy Date: 
2003-02-25 00:00:00
Account Value: 8932.55
    Buy Price: 838.57
    Num Shares: 10.0
    Remaining Value: 546.85
Sell Date: 
2003-04-10 00:00:00
    Sell Price: 871.58
    Updated Value: 9262.65

-------------------------

Buy Date: 
2003-07-07 00:00:00
Account Value: 9262.65
    Buy Price: 1004.42
    Num Shares: 9.0
    Remaining Value: 222.87
Sell Date: 
2004-06-29 00:00:00
    Sell Price: 1136.2
    Updated Value: 10448.67

-------------------------

Buy Date: 
2004-10-13 00:00:00
Account Value: 10448.67
    Buy Price: 1113.65
    Num Shares: 9.0
    Remaining Value: 425.82
Sell Date: 
2004-11-05 00:00:00
    Sell Price: 1166.17
    Updated Value: 10921.35

-------------------------

Buy Date: 
2004-12-16 00:00:00
Account Value: 10921.35
    Buy Price: 1203.21
    Num Shares: 9.0
    Remaining Value: 92.46
Sell Date: 
2005-05-18 00:00:00
    Sell Price: 1185.56
    Updated Value: 10762.5

-------------------------

Buy Date: 
2005-06-23 00:00:00
Account Value: 10762.5
    Buy Price: 1200.73
    Num Shares: 8.0
    Remaining Value: 1156.66
Sell Date: 
2005-07-12 00:00:00
    Sell Price: 1222.21
    Updated Value: 10934.34

-------------------------

Buy Date: 
2005-08-31 00:00:00
Account Value: 10934.34
    Buy Price: 1220.33
    Num Shares: 8.0
    Remaining Value: 1171.7
Sell Date: 
2005-12-27 00:00:00
    Sell Price: 1256.54
    Updated Value: 11224.02

-------------------------

Buy Date: 
2006-01-24 00:00:00
Account Value: 11224.02
    Buy Price: 1266.86
    Num Shares: 8.0
    Remaining Value: 1089.14
Sell Date: 
2006-08-10 00:00:00
    Sell Price: 1271.81
    Updated Value: 11263.62

-------------------------

Buy Date: 
2006-11-01 00:00:00
Account Value: 11263.62
    Buy Price: 1367.81
    Num Shares: 8.0
    Remaining Value: 321.14
Sell Date: 
2007-10-19 00:00:00
    Sell Price: 1500.63
    Updated Value: 12326.18

-------------------------

Buy Date: 
2008-01-09 00:00:00
Account Value: 12326.18
    Buy Price: 1409.13
    Num Shares: 8.0
    Remaining Value: 1053.14
Sell Date: 
2008-02-20 00:00:00
    Sell Price: 1360.03
    Updated Value: 11933.38

-------------------------

Buy Date: 
2008-07-14 00:00:00
Account Value: 11933.38
    Buy Price: 1228.3
    Num Shares: 9.0
    Remaining Value: 878.68
Sell Date: 
2008-07-17 00:00:00
    Sell Price: 1260.32
    Updated Value: 12221.56

-------------------------

Buy Date: 
2008-07-31 00:00:00
Account Value: 12221.56
    Buy Price: 1267.38
    Num Shares: 9.0
    Remaining Value: 815.14
Sell Date: 
2008-09-11 00:00:00
    Sell Price: 1249.05
    Updated Value: 12056.59

-------------------------

Buy Date: 
2009-07-16 00:00:00
Account Value: 12056.59
    Buy Price: 940.74
    Num Shares: 12.0
    Remaining Value: 767.71
Sell Date: 
2010-08-18 00:00:00
    Sell Price: 1094.16
    Updated Value: 13897.63

-------------------------

Buy Date: 
2010-11-04 00:00:00
Account Value: 13897.63
    Buy Price: 1221.06
    Num Shares: 11.0
    Remaining Value: 465.97
Sell Date: 
2011-07-27 00:00:00
    Sell Price: 1304.89
    Updated Value: 14819.76

-------------------------

Buy Date: 
2011-08-08 00:00:00
Account Value: 14819.76
    Buy Price: 1119.46
    Num Shares: 13.0
    Remaining Value: 266.78
Sell Date: 
2011-08-29 00:00:00
    Sell Price: 1210.08
    Updated Value: 15997.82

-------------------------

Buy Date: 
2012-01-23 00:00:00
Account Value: 15997.82
    Buy Price: 1316.0
    Num Shares: 12.0
    Remaining Value: 205.82
Sell Date: 
2012-08-09 00:00:00
    Sell Price: 1402.8
    Updated Value: 17039.42

-------------------------

Buy Date: 
2012-10-15 00:00:00
Account Value: 17039.42
    Buy Price: 1440.13
    Num Shares: 11.0
    Remaining Value: 1197.99
Sell Date: 
2013-02-28 00:00:00
    Sell Price: 1514.68
    Updated Value: 17859.47

-------------------------

Buy Date: 
2013-03-25 00:00:00
Account Value: 17859.47
    Buy Price: 1551.69
    Num Shares: 11.0
    Remaining Value: 790.88
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 23913.54


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 23913.54





-----------------------------------------------------------------------
^GSPC Calculations, N = [100, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-29 00:00:00
Account Value: 10000
    Buy Price: 1148.56
    Num Shares: 8.0
    Remaining Value: 811.52
Sell Date: 
2001-09-17 00:00:00
    Sell Price: 1038.77
    Updated Value: 9121.68

-------------------------

Buy Date: 
2002-04-26 00:00:00
Account Value: 9121.68
    Buy Price: 1076.32
    Num Shares: 8.0
    Remaining Value: 511.12
Sell Date: 
2002-07-01 00:00:00
    Sell Price: 968.65
    Updated Value: 8260.32

-------------------------

Buy Date: 
2003-06-30 00:00:00
Account Value: 8260.32
    Buy Price: 974.5
    Num Shares: 8.0
    Remaining Value: 464.32
Sell Date: 
2004-09-08 00:00:00
    Sell Price: 1116.27
    Updated Value: 9394.48

-------------------------

Buy Date: 
2004-12-20 00:00:00
Account Value: 9394.48
    Buy Price: 1194.65
    Num Shares: 7.0
    Remaining Value: 1031.93
Sell Date: 
2005-08-11 00:00:00
    Sell Price: 1237.81
    Updated Value: 9696.6

-------------------------

Buy Date: 
2005-09-06 00:00:00
Account Value: 9696.6
    Buy Price: 1233.39
    Num Shares: 7.0
    Remaining Value: 1062.87
Sell Date: 
2006-09-13 00:00:00
    Sell Price: 1318.07
    Updated Value: 10289.36

-------------------------

Buy Date: 
2006-11-03 00:00:00
Account Value: 10289.36
    Buy Price: 1364.3
    Num Shares: 7.0
    Remaining Value: 739.26
Sell Date: 
2007-12-27 00:00:00
    Sell Price: 1476.27
    Updated Value: 11073.15

-------------------------

Buy Date: 
2009-07-31 00:00:00
Account Value: 11073.15
    Buy Price: 987.48
    Num Shares: 11.0
    Remaining Value: 210.87
Sell Date: 
2010-09-02 00:00:00
    Sell Price: 1090.1
    Updated Value: 12201.97

-------------------------

Buy Date: 
2010-12-15 00:00:00
Account Value: 12201.97
    Buy Price: 1235.23
    Num Shares: 9.0
    Remaining Value: 1084.9
Sell Date: 
2011-09-20 00:00:00
    Sell Price: 1202.09
    Updated Value: 11903.71

-------------------------

Buy Date: 
2012-03-02 00:00:00
Account Value: 11903.71
    Buy Price: 1369.63
    Num Shares: 8.0
    Remaining Value: 946.67
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17763.15


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17763.15





-----------------------------------------------------------------------
^GSPC Calculations, N = [100, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-07 00:00:00
Account Value: 10000
    Buy Price: 1204.4
    Num Shares: 8.0
    Remaining Value: 364.8
Sell Date: 
2001-10-01 00:00:00
    Sell Price: 1038.55
    Updated Value: 8673.2

-------------------------

Buy Date: 
2003-07-07 00:00:00
Account Value: 8673.2
    Buy Price: 1004.42
    Num Shares: 8.0
    Remaining Value: 637.84
Sell Date: 
2004-11-09 00:00:00
    Sell Price: 1164.08
    Updated Value: 9950.48

-------------------------

Buy Date: 
2004-12-29 00:00:00
Account Value: 9950.48
    Buy Price: 1213.45
    Num Shares: 8.0
    Remaining Value: 242.88
Sell Date: 
2008-02-21 00:00:00
    Sell Price: 1342.53
    Updated Value: 10983.12

-------------------------

Buy Date: 
2009-09-03 00:00:00
Account Value: 10983.12
    Buy Price: 1003.24
    Num Shares: 10.0
    Remaining Value: 950.72
Sell Date: 
2010-09-16 00:00:00
    Sell Price: 1124.66
    Updated Value: 12197.32

-------------------------

Buy Date: 
2010-12-02 00:00:00
Account Value: 12197.32
    Buy Price: 1221.53
    Num Shares: 9.0
    Remaining Value: 1203.55
Sell Date: 
2011-10-07 00:00:00
    Sell Price: 1155.46
    Updated Value: 11602.69

-------------------------

Buy Date: 
2012-03-20 00:00:00
Account Value: 11602.69
    Buy Price: 1405.52
    Num Shares: 8.0
    Remaining Value: 358.53
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 17175.01


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 17175.01





-----------------------------------------------------------------------
^GSPC Calculations, N = [100, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2003-07-29 00:00:00
Account Value: 10000
    Buy Price: 989.28
    Num Shares: 10.0
    Remaining Value: 107.2
Sell Date: 
2008-02-29 00:00:00
    Sell Price: 1330.63
    Updated Value: 13413.5

-------------------------

Buy Date: 
2009-10-14 00:00:00
Account Value: 13413.5
    Buy Price: 1092.02
    Num Shares: 12.0
    Remaining Value: 309.26
Sell Date: 
2010-10-07 00:00:00
    Sell Price: 1158.06
    Updated Value: 14205.98

-------------------------

Buy Date: 
2010-10-29 00:00:00
Account Value: 14205.98
    Buy Price: 1183.26
    Num Shares: 12.0
    Remaining Value: 6.86
Sell Date: 
2011-11-04 00:00:00
    Sell Price: 1253.23
    Updated Value: 15045.62

-------------------------

Buy Date: 
2012-03-29 00:00:00
Account Value: 15045.62
    Buy Price: 1403.28
    Num Shares: 10.0
    Remaining Value: 1012.82
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 2102.06
    Updated Value: 22033.42


===============================

^GSPC:
Final Value Basic: 14714.42
Final Value Crossover: 22033.42




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<h4 id="gspc-s-p-sorted-returns">GSPC (S&amp;P) Sorted Returns</h4>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[144]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># sorting runs based on net_results</span>
<span class="n">gspc_sorted</span> <span class="o">=</span> <span class="nb">sorted</span><span class="p">([(</span><span class="n">n</span><span class="p">,</span> <span class="n">gspc_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;net_result&#39;</span><span class="p">],</span> <span class="n">gspc_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;N&#39;</span><span class="p">])</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">gspc_runs</span><span class="p">],</span> <span class="n">key</span><span class="o">=</span><span class="k">lambda</span> <span class="n">x</span><span class="p">:</span><span class="n">x</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="n">reverse</span><span class="o">=</span><span class="bp">True</span><span class="p">)</span>
<span class="n">gspc_sorted</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[144]:</div>


<div class="output_text output_subarea output_pyout">
<pre>
[(&apos;[30, 250]&apos;, 10586.809999999996, [30, 250]),
 (&apos;[20, 200]&apos;, 9677.3899999999976, [20, 200]),
 (&apos;[50, 200]&apos;, 9559.7399999999998, [50, 200]),
 (&apos;[15, 200]&apos;, 9384.850000000004, [15, 200]),
 (&apos;[50, 125]&apos;, 9284.6800000000057, [50, 125]),
 (&apos;[100, 125]&apos;, 9199.1199999999972, [100, 125]),
 (&apos;[10, 300]&apos;, 8908.7700000000059, [10, 300]),
 (&apos;[40, 250]&apos;, 8565.5699999999979, [40, 250]),
 (&apos;[20, 300]&apos;, 8519.2000000000025, [20, 300]),
 (&apos;[15, 250]&apos;, 8464.6399999999976, [15, 250]),
 (&apos;[30, 300]&apos;, 8419.2499999999982, [30, 300]),
 (&apos;[40, 200]&apos;, 7440.4199999999964, [40, 200]),
 (&apos;[100, 300]&apos;, 7319.0000000000018, [100, 300]),
 (&apos;[80, 300]&apos;, 7266.3499999999967, [80, 300]),
 (&apos;[50, 250]&apos;, 7162.3099999999959, [50, 250]),
 (&apos;[10, 250]&apos;, 7120.5700000000052, [10, 250]),
 (&apos;[60, 300]&apos;, 7104.279999999997, [60, 300]),
 (&apos;[30, 200]&apos;, 7067.6800000000057, [30, 200]),
 (&apos;[40, 125]&apos;, 6932.2100000000009, [40, 125]),
 (&apos;[40, 300]&apos;, 6639.0300000000043, [40, 300]),
 (&apos;[60, 200]&apos;, 6623.8800000000028, [60, 200]),
 (&apos;[15, 300]&apos;, 6548.6599999999944, [15, 300]),
 (&apos;[10, 200]&apos;, 6468.8399999999947, [10, 200]),
 (&apos;[50, 300]&apos;, 6384.3199999999979, [50, 300]),
 (&apos;[10, 75]&apos;, 6170.0100000000039, [10, 75]),
 (&apos;[60, 75]&apos;, 5780.7300000000087, [60, 75]),
 (&apos;[50, 75]&apos;, 5313.1700000000037, [50, 75]),
 (&apos;[60, 125]&apos;, 5276.2500000000018, [60, 125]),
 (&apos;[20, 250]&apos;, 5109.6700000000037, [20, 250]),
 (&apos;[60, 250]&apos;, 4967.8700000000008, [60, 250]),
 (&apos;[40, 75]&apos;, 4694.8599999999988, [40, 75]),
 (&apos;[30, 125]&apos;, 3714.6700000000001, [30, 125]),
 (&apos;[15, 125]&apos;, 3303.3099999999995, [15, 125]),
 (&apos;[100, 200]&apos;, 3048.7299999999941, [100, 200]),
 (&apos;[80, 200]&apos;, 2994.8899999999976, [80, 200]),
 (&apos;[80, 125]&apos;, 2762.6200000000008, [80, 125]),
 (&apos;[10, 125]&apos;, 2740.4899999999961, [10, 125]),
 (&apos;[20, 75]&apos;, 2593.4099999999944, [20, 75]),
 (&apos;[100, 250]&apos;, 2460.5899999999983, [100, 250]),
 (&apos;[15, 75]&apos;, 1124.9000000000051, [15, 75]),
 (&apos;[30, 75]&apos;, 1025.2700000000059, [30, 75]),
 (&apos;[15, 30]&apos;, 578.9600000000064, [15, 30]),
 (&apos;[80, 250]&apos;, 467.58000000000357, [80, 250]),
 (&apos;[10, 50]&apos;, 463.20000000000618, [10, 50]),
 (&apos;[40, 50]&apos;, 439.28000000000975, [40, 50]),
 (&apos;[20, 125]&apos;, -325.94000000000051, [20, 125]),
 (&apos;[30, 50]&apos;, -561.27000000000044, [30, 50]),
 (&apos;[15, 50]&apos;, -957.45999999999185, [15, 50]),
 (&apos;[10, 30]&apos;, -2627.6199999999881, [10, 30]),
 (&apos;[20, 30]&apos;, -2775.5500000000065, [20, 30]),
 (&apos;[20, 50]&apos;, -3072.4399999999932, [20, 50])]
</pre>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h3 id="ixic-nasdaq-">IXIC (Nasdaq)</h3>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[61]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">ixic_runs</span> <span class="o">=</span> <span class="n">crossover_brute_force_analysis</span><span class="p">(</span><span class="n">IXIC</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-01-24 00:00:00
Account Value: 10000
    Buy Price: 2859.15
    Num Shares: 3.0
    Remaining Value: 1422.55
Sell Date: 
2001-02-14 00:00:00
    Sell Price: 2491.4
    Updated Value: 8896.75

-------------------------

Buy Date: 
2001-04-23 00:00:00
Account Value: 8896.75
    Buy Price: 2059.32
    Num Shares: 4.0
    Remaining Value: 659.47
Sell Date: 
2001-06-11 00:00:00
    Sell Price: 2170.78
    Updated Value: 9342.59

-------------------------

Buy Date: 
2001-06-14 00:00:00
Account Value: 9342.59
    Buy Price: 2044.07
    Num Shares: 4.0
    Remaining Value: 1166.31
Sell Date: 
2001-06-19 00:00:00
    Sell Price: 1992.66
    Updated Value: 9136.95

-------------------------

Buy Date: 
2001-10-17 00:00:00
Account Value: 9136.95
    Buy Price: 1646.34
    Num Shares: 5.0
    Remaining Value: 905.25
Sell Date: 
2002-01-24 00:00:00
    Sell Price: 1942.58
    Updated Value: 10618.15

-------------------------

Buy Date: 
2002-03-13 00:00:00
Account Value: 10618.15
    Buy Price: 1862.03
    Num Shares: 5.0
    Remaining Value: 1308.0
Sell Date: 
2002-04-05 00:00:00
    Sell Price: 1770.03
    Updated Value: 10158.15

-------------------------

Buy Date: 
2002-05-28 00:00:00
Account Value: 10158.15
    Buy Price: 1652.17
    Num Shares: 6.0
    Remaining Value: 245.13
Sell Date: 
2002-05-31 00:00:00
    Sell Price: 1615.73
    Updated Value: 9939.51

-------------------------

Buy Date: 
2002-08-21 00:00:00
Account Value: 9939.51
    Buy Price: 1409.25
    Num Shares: 7.0
    Remaining Value: 74.76
Sell Date: 
2002-09-10 00:00:00
    Sell Price: 1320.09
    Updated Value: 9315.39

-------------------------

Buy Date: 
2002-10-23 00:00:00
Account Value: 9315.39
    Buy Price: 1320.23
    Num Shares: 7.0
    Remaining Value: 73.78
Sell Date: 
2002-12-17 00:00:00
    Sell Price: 1392.05
    Updated Value: 9818.13

-------------------------

Buy Date: 
2003-01-14 00:00:00
Account Value: 9818.13
    Buy Price: 1460.99
    Num Shares: 6.0
    Remaining Value: 1052.19
Sell Date: 
2003-01-29 00:00:00
    Sell Price: 1358.06
    Updated Value: 9200.55

-------------------------

Buy Date: 
2003-03-03 00:00:00
Account Value: 9200.55
    Buy Price: 1320.29
    Num Shares: 6.0
    Remaining Value: 1278.81
Sell Date: 
2003-03-10 00:00:00
    Sell Price: 1278.37
    Updated Value: 8949.03

-------------------------

Buy Date: 
2003-03-18 00:00:00
Account Value: 8949.03
    Buy Price: 1400.55
    Num Shares: 6.0
    Remaining Value: 545.73
Sell Date: 
2003-08-11 00:00:00
    Sell Price: 1661.51
    Updated Value: 10514.79

-------------------------

Buy Date: 
2003-08-25 00:00:00
Account Value: 10514.79
    Buy Price: 1764.31
    Num Shares: 5.0
    Remaining Value: 1693.24
Sell Date: 
2003-10-07 00:00:00
    Sell Price: 1907.85
    Updated Value: 11232.49

-------------------------

Buy Date: 
2003-10-13 00:00:00
Account Value: 11232.49
    Buy Price: 1933.53
    Num Shares: 5.0
    Remaining Value: 1564.84
Sell Date: 
2003-11-21 00:00:00
    Sell Price: 1893.88
    Updated Value: 11034.24

-------------------------

Buy Date: 
2003-12-03 00:00:00
Account Value: 11034.24
    Buy Price: 1960.25
    Num Shares: 5.0
    Remaining Value: 1232.99
Sell Date: 
2003-12-16 00:00:00
    Sell Price: 1924.29
    Updated Value: 10854.44

-------------------------

Buy Date: 
2003-12-24 00:00:00
Account Value: 10854.44
    Buy Price: 1969.23
    Num Shares: 5.0
    Remaining Value: 1008.29
Sell Date: 
2004-02-09 00:00:00
    Sell Price: 2060.57
    Updated Value: 11311.14

-------------------------

Buy Date: 
2004-04-07 00:00:00
Account Value: 11311.14
    Buy Price: 2050.24
    Num Shares: 5.0
    Remaining Value: 1059.94
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 10846.24

-------------------------

Buy Date: 
2004-06-04 00:00:00
Account Value: 10846.24
    Buy Price: 1978.62
    Num Shares: 5.0
    Remaining Value: 953.14
Sell Date: 
2004-07-13 00:00:00
    Sell Price: 1931.66
    Updated Value: 10611.44

-------------------------

Buy Date: 
2004-08-31 00:00:00
Account Value: 10611.44
    Buy Price: 1838.1
    Num Shares: 5.0
    Remaining Value: 1420.94
Sell Date: 
2005-01-11 00:00:00
    Sell Price: 2079.62
    Updated Value: 11819.04

-------------------------

Buy Date: 
2005-02-15 00:00:00
Account Value: 11819.04
    Buy Price: 2089.21
    Num Shares: 5.0
    Remaining Value: 1372.99
Sell Date: 
2005-03-03 00:00:00
    Sell Price: 2058.4
    Updated Value: 11664.99

-------------------------

Buy Date: 
2005-03-09 00:00:00
Account Value: 11664.99
    Buy Price: 2061.29
    Num Shares: 5.0
    Remaining Value: 1358.54
Sell Date: 
2005-03-11 00:00:00
    Sell Price: 2041.6
    Updated Value: 11566.54

-------------------------

Buy Date: 
2005-05-16 00:00:00
Account Value: 11566.54
    Buy Price: 1994.43
    Num Shares: 5.0
    Remaining Value: 1594.39
Sell Date: 
2005-07-05 00:00:00
    Sell Price: 2078.75
    Updated Value: 11988.14

-------------------------

Buy Date: 
2005-07-12 00:00:00
Account Value: 11988.14
    Buy Price: 2143.15
    Num Shares: 5.0
    Remaining Value: 1272.39
Sell Date: 
2005-08-18 00:00:00
    Sell Price: 2136.08
    Updated Value: 11952.79

-------------------------

Buy Date: 
2005-09-14 00:00:00
Account Value: 11952.79
    Buy Price: 2149.33
    Num Shares: 5.0
    Remaining Value: 1206.14
Sell Date: 
2005-09-26 00:00:00
    Sell Price: 2121.46
    Updated Value: 11813.44

-------------------------

Buy Date: 
2005-11-03 00:00:00
Account Value: 11813.44
    Buy Price: 2160.22
    Num Shares: 5.0
    Remaining Value: 1012.34
Sell Date: 
2005-12-29 00:00:00
    Sell Price: 2218.16
    Updated Value: 12103.14

-------------------------

Buy Date: 
2006-01-11 00:00:00
Account Value: 12103.14
    Buy Price: 2331.36
    Num Shares: 5.0
    Remaining Value: 446.34
Sell Date: 
2006-02-13 00:00:00
    Sell Price: 2239.81
    Updated Value: 11645.39

-------------------------

Buy Date: 
2006-02-28 00:00:00
Account Value: 11645.39
    Buy Price: 2281.39
    Num Shares: 5.0
    Remaining Value: 238.44
Sell Date: 
2006-05-04 00:00:00
    Sell Price: 2323.9
    Updated Value: 11857.94

-------------------------

Buy Date: 
2006-07-12 00:00:00
Account Value: 11857.94
    Buy Price: 2090.24
    Num Shares: 5.0
    Remaining Value: 1406.74
Sell Date: 
2006-07-17 00:00:00
    Sell Price: 2037.72
    Updated Value: 11595.34

-------------------------

Buy Date: 
2006-08-16 00:00:00
Account Value: 11595.34
    Buy Price: 2149.54
    Num Shares: 5.0
    Remaining Value: 847.64
Sell Date: 
2006-12-26 00:00:00
    Sell Price: 2413.51
    Updated Value: 12915.19

-------------------------

Buy Date: 
2007-01-11 00:00:00
Account Value: 12915.19
    Buy Price: 2484.85
    Num Shares: 5.0
    Remaining Value: 490.94
Sell Date: 
2007-03-06 00:00:00
    Sell Price: 2385.14
    Updated Value: 12416.64

-------------------------

Buy Date: 
2007-04-02 00:00:00
Account Value: 12416.64
    Buy Price: 2422.26
    Num Shares: 5.0
    Remaining Value: 305.34
Sell Date: 
2007-08-02 00:00:00
    Sell Price: 2575.98
    Updated Value: 13185.24

-------------------------

Buy Date: 
2007-09-05 00:00:00
Account Value: 13185.24
    Buy Price: 2605.95
    Num Shares: 5.0
    Remaining Value: 155.49
Sell Date: 
2007-11-13 00:00:00
    Sell Price: 2673.65
    Updated Value: 13523.74

-------------------------

Buy Date: 
2007-12-17 00:00:00
Account Value: 13523.74
    Buy Price: 2574.46
    Num Shares: 5.0
    Remaining Value: 651.44
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 2440.51
    Updated Value: 12853.99

-------------------------

Buy Date: 
2008-04-01 00:00:00
Account Value: 12853.99
    Buy Price: 2362.75
    Num Shares: 5.0
    Remaining Value: 1040.24
Sell Date: 
2008-06-13 00:00:00
    Sell Price: 2454.5
    Updated Value: 13312.74

-------------------------

Buy Date: 
2008-08-04 00:00:00
Account Value: 13312.74
    Buy Price: 2285.56
    Num Shares: 5.0
    Remaining Value: 1884.94
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 2269.76
    Updated Value: 13233.74

-------------------------

Buy Date: 
2008-12-17 00:00:00
Account Value: 13233.74
    Buy Price: 1579.31
    Num Shares: 8.0
    Remaining Value: 599.26
Sell Date: 
2009-01-21 00:00:00
    Sell Price: 1507.07
    Updated Value: 12655.82

-------------------------

Buy Date: 
2009-02-18 00:00:00
Account Value: 12655.82
    Buy Price: 1467.97
    Num Shares: 8.0
    Remaining Value: 912.06
Sell Date: 
2009-02-23 00:00:00
    Sell Price: 1387.72
    Updated Value: 12013.82

-------------------------

Buy Date: 
2009-03-24 00:00:00
Account Value: 12013.82
    Buy Price: 1516.52
    Num Shares: 7.0
    Remaining Value: 1398.18
Sell Date: 
2009-07-06 00:00:00
    Sell Price: 1787.4
    Updated Value: 13909.98

-------------------------

Buy Date: 
2009-07-22 00:00:00
Account Value: 13909.98
    Buy Price: 1926.38
    Num Shares: 7.0
    Remaining Value: 425.32
Sell Date: 
2009-11-03 00:00:00
    Sell Price: 2057.32
    Updated Value: 14826.56

-------------------------

Buy Date: 
2009-11-18 00:00:00
Account Value: 14826.56
    Buy Price: 2193.14
    Num Shares: 6.0
    Remaining Value: 1667.72
Sell Date: 
2010-01-29 00:00:00
    Sell Price: 2147.35
    Updated Value: 14551.82

-------------------------

Buy Date: 
2010-02-26 00:00:00
Account Value: 14551.82
    Buy Price: 2238.26
    Num Shares: 6.0
    Remaining Value: 1122.26
Sell Date: 
2010-05-10 00:00:00
    Sell Price: 2374.67
    Updated Value: 15370.28

-------------------------

Buy Date: 
2010-06-24 00:00:00
Account Value: 15370.28
    Buy Price: 2217.42
    Num Shares: 6.0
    Remaining Value: 2065.76
Sell Date: 
2010-07-02 00:00:00
    Sell Price: 2091.79
    Updated Value: 14616.5

-------------------------

Buy Date: 
2010-07-26 00:00:00
Account Value: 14616.5
    Buy Price: 2296.43
    Num Shares: 6.0
    Remaining Value: 837.92
Sell Date: 
2010-08-19 00:00:00
    Sell Price: 2178.95
    Updated Value: 13911.62

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 13911.62
    Buy Price: 2301.32
    Num Shares: 6.0
    Remaining Value: 103.7
Sell Date: 
2010-11-29 00:00:00
    Sell Price: 2525.22
    Updated Value: 15255.02

-------------------------

Buy Date: 
2010-12-02 00:00:00
Account Value: 15255.02
    Buy Price: 2579.35
    Num Shares: 5.0
    Remaining Value: 2358.27
Sell Date: 
2011-03-07 00:00:00
    Sell Price: 2745.63
    Updated Value: 16086.42

-------------------------

Buy Date: 
2011-04-04 00:00:00
Account Value: 16086.42
    Buy Price: 2789.19
    Num Shares: 5.0
    Remaining Value: 2140.47
Sell Date: 
2011-05-25 00:00:00
    Sell Price: 2761.38
    Updated Value: 15947.37

-------------------------

Buy Date: 
2011-07-06 00:00:00
Account Value: 15947.37
    Buy Price: 2834.02
    Num Shares: 5.0
    Remaining Value: 1777.27
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 2532.41
    Updated Value: 14439.32

-------------------------

Buy Date: 
2011-09-09 00:00:00
Account Value: 14439.32
    Buy Price: 2467.99
    Num Shares: 5.0
    Remaining Value: 2099.37
Sell Date: 
2011-10-03 00:00:00
    Sell Price: 2335.83
    Updated Value: 13778.52

-------------------------

Buy Date: 
2011-10-17 00:00:00
Account Value: 13778.52
    Buy Price: 2614.92
    Num Shares: 5.0
    Remaining Value: 703.92
Sell Date: 
2011-11-21 00:00:00
    Sell Price: 2523.14
    Updated Value: 13319.62

-------------------------

Buy Date: 
2011-12-13 00:00:00
Account Value: 13319.62
    Buy Price: 2579.27
    Num Shares: 5.0
    Remaining Value: 423.27
Sell Date: 
2011-12-19 00:00:00
    Sell Price: 2523.14
    Updated Value: 13038.97

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 13038.97
    Buy Price: 2605.15
    Num Shares: 5.0
    Remaining Value: 13.22
Sell Date: 
2012-04-18 00:00:00
    Sell Price: 3031.45
    Updated Value: 15170.47

-------------------------

Buy Date: 
2012-06-21 00:00:00
Account Value: 15170.47
    Buy Price: 2859.09
    Num Shares: 5.0
    Remaining Value: 875.02
Sell Date: 
2012-08-03 00:00:00
    Sell Price: 2967.9
    Updated Value: 15714.52

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 15714.52
    Buy Price: 2989.91
    Num Shares: 5.0
    Remaining Value: 764.97
Sell Date: 
2012-10-09 00:00:00
    Sell Price: 3065.02
    Updated Value: 16090.07

-------------------------

Buy Date: 
2012-12-04 00:00:00
Account Value: 16090.07
    Buy Price: 2996.69
    Num Shares: 5.0
    Remaining Value: 1106.62
Sell Date: 
2013-03-05 00:00:00
    Sell Price: 3224.13
    Updated Value: 17227.27

-------------------------

Buy Date: 
2013-03-08 00:00:00
Account Value: 17227.27
    Buy Price: 3244.37
    Num Shares: 5.0
    Remaining Value: 1005.42
Sell Date: 
2013-04-16 00:00:00
    Sell Price: 3264.63
    Updated Value: 17328.57

-------------------------

Buy Date: 
2013-04-17 00:00:00
Account Value: 17328.57
    Buy Price: 3204.67
    Num Shares: 5.0
    Remaining Value: 1305.22
Sell Date: 
2013-04-18 00:00:00
    Sell Price: 3166.36
    Updated Value: 17137.02

-------------------------

Buy Date: 
2013-04-19 00:00:00
Account Value: 17137.02
    Buy Price: 3206.06
    Num Shares: 5.0
    Remaining Value: 1106.72
Sell Date: 
2013-04-25 00:00:00
    Sell Price: 3289.99
    Updated Value: 17556.67

-------------------------

Buy Date: 
2013-05-01 00:00:00
Account Value: 17556.67
    Buy Price: 3299.13
    Num Shares: 5.0
    Remaining Value: 1061.02
Sell Date: 
2013-06-14 00:00:00
    Sell Price: 3423.56
    Updated Value: 18178.82

-------------------------

Buy Date: 
2013-07-11 00:00:00
Account Value: 18178.82
    Buy Price: 3578.3
    Num Shares: 5.0
    Remaining Value: 287.32
Sell Date: 
2013-08-27 00:00:00
    Sell Price: 3578.52
    Updated Value: 18179.92

-------------------------

Buy Date: 
2013-09-12 00:00:00
Account Value: 18179.92
    Buy Price: 3715.97
    Num Shares: 4.0
    Remaining Value: 3316.04
Sell Date: 
2014-02-04 00:00:00
    Sell Price: 4031.52
    Updated Value: 19442.12

-------------------------

Buy Date: 
2014-02-20 00:00:00
Account Value: 19442.12
    Buy Price: 4267.55
    Num Shares: 4.0
    Remaining Value: 2371.92
Sell Date: 
2014-03-26 00:00:00
    Sell Price: 4173.58
    Updated Value: 19066.24

-------------------------

Buy Date: 
2014-05-21 00:00:00
Account Value: 19066.24
    Buy Price: 4131.54
    Num Shares: 4.0
    Remaining Value: 2540.08
Sell Date: 
2014-08-07 00:00:00
    Sell Price: 4334.97
    Updated Value: 19879.96

-------------------------

Buy Date: 
2014-08-21 00:00:00
Account Value: 19879.96
    Buy Price: 4532.1
    Num Shares: 4.0
    Remaining Value: 1751.56
Sell Date: 
2014-09-26 00:00:00
    Sell Price: 4512.19
    Updated Value: 19800.32

-------------------------

Buy Date: 
2014-10-31 00:00:00
Account Value: 19800.32
    Buy Price: 4630.74
    Num Shares: 4.0
    Remaining Value: 1277.36
Sell Date: 
2014-12-19 00:00:00
    Sell Price: 4765.38
    Updated Value: 20338.88

-------------------------

Buy Date: 
2014-12-31 00:00:00
Account Value: 20338.88
    Buy Price: 4736.05
    Num Shares: 4.0
    Remaining Value: 1394.68
Sell Date: 
2015-01-12 00:00:00
    Sell Price: 4664.71
    Updated Value: 20053.52

-------------------------

Buy Date: 
2015-02-04 00:00:00
Account Value: 20053.52
    Buy Price: 4716.7
    Num Shares: 4.0
    Remaining Value: 1186.72
Sell Date: 
2015-02-06 00:00:00
    Sell Price: 4744.4
    Updated Value: 20164.32

-------------------------

Buy Date: 
2015-02-11 00:00:00
Account Value: 20164.32
    Buy Price: 4801.18
    Num Shares: 4.0
    Remaining Value: 959.6
Sell Date: 
2015-04-02 00:00:00
    Sell Price: 4886.94
    Updated Value: 20507.36


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20507.36





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 2116.24
    Num Shares: 4.0
    Remaining Value: 1535.04
Sell Date: 
2001-06-21 00:00:00
    Sell Price: 2058.76
    Updated Value: 9770.08

-------------------------

Buy Date: 
2001-10-31 00:00:00
Account Value: 9770.08
    Buy Price: 1690.2
    Num Shares: 5.0
    Remaining Value: 1319.08
Sell Date: 
2002-01-28 00:00:00
    Sell Price: 1943.91
    Updated Value: 11038.63

-------------------------

Buy Date: 
2002-03-21 00:00:00
Account Value: 11038.63
    Buy Price: 1868.83
    Num Shares: 5.0
    Remaining Value: 1694.48
Sell Date: 
2002-03-22 00:00:00
    Sell Price: 1851.39
    Updated Value: 10951.43

-------------------------

Buy Date: 
2002-08-28 00:00:00
Account Value: 10951.43
    Buy Price: 1314.38
    Num Shares: 8.0
    Remaining Value: 436.39
Sell Date: 
2002-09-05 00:00:00
    Sell Price: 1251.0
    Updated Value: 10444.39

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 10444.39
    Buy Price: 1315.83
    Num Shares: 7.0
    Remaining Value: 1233.58
Sell Date: 
2002-12-30 00:00:00
    Sell Price: 1339.54
    Updated Value: 10610.36

-------------------------

Buy Date: 
2003-01-14 00:00:00
Account Value: 10610.36
    Buy Price: 1460.99
    Num Shares: 7.0
    Remaining Value: 383.43
Sell Date: 
2003-01-27 00:00:00
    Sell Price: 1325.27
    Updated Value: 9660.32

-------------------------

Buy Date: 
2003-03-24 00:00:00
Account Value: 9660.32
    Buy Price: 1369.78
    Num Shares: 7.0
    Remaining Value: 71.86
Sell Date: 
2003-08-18 00:00:00
    Sell Price: 1739.49
    Updated Value: 12248.29

-------------------------

Buy Date: 
2003-08-20 00:00:00
Account Value: 12248.29
    Buy Price: 1760.54
    Num Shares: 6.0
    Remaining Value: 1685.05
Sell Date: 
2003-12-18 00:00:00
    Sell Price: 1956.18
    Updated Value: 13422.13

-------------------------

Buy Date: 
2003-12-23 00:00:00
Account Value: 13422.13
    Buy Price: 1974.78
    Num Shares: 6.0
    Remaining Value: 1573.45
Sell Date: 
2004-03-01 00:00:00
    Sell Price: 2057.8
    Updated Value: 13920.25

-------------------------

Buy Date: 
2004-04-12 00:00:00
Account Value: 13920.25
    Buy Price: 2065.48
    Num Shares: 6.0
    Remaining Value: 1527.37
Sell Date: 
2004-05-03 00:00:00
    Sell Price: 1938.72
    Updated Value: 13159.69

-------------------------

Buy Date: 
2004-05-04 00:00:00
Account Value: 13159.69
    Buy Price: 1950.48
    Num Shares: 6.0
    Remaining Value: 1456.81
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 13200.37

-------------------------

Buy Date: 
2004-06-10 00:00:00
Account Value: 13200.37
    Buy Price: 1999.87
    Num Shares: 6.0
    Remaining Value: 1201.15
Sell Date: 
2004-07-16 00:00:00
    Sell Price: 1883.15
    Updated Value: 12500.05

-------------------------

Buy Date: 
2004-09-15 00:00:00
Account Value: 12500.05
    Buy Price: 1896.52
    Num Shares: 6.0
    Remaining Value: 1120.93
Sell Date: 
2005-01-14 00:00:00
    Sell Price: 2087.91
    Updated Value: 13648.39

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 13648.39
    Buy Price: 2046.42
    Num Shares: 6.0
    Remaining Value: 1369.87
Sell Date: 
2005-09-06 00:00:00
    Sell Price: 2166.86
    Updated Value: 14371.03

-------------------------

Buy Date: 
2005-09-12 00:00:00
Account Value: 14371.03
    Buy Price: 2182.83
    Num Shares: 6.0
    Remaining Value: 1274.05
Sell Date: 
2005-09-21 00:00:00
    Sell Price: 2106.64
    Updated Value: 13913.89

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 13913.89
    Buy Price: 2196.68
    Num Shares: 6.0
    Remaining Value: 733.81
Sell Date: 
2006-02-15 00:00:00
    Sell Price: 2276.43
    Updated Value: 14392.39

-------------------------

Buy Date: 
2006-02-23 00:00:00
Account Value: 14392.39
    Buy Price: 2279.32
    Num Shares: 6.0
    Remaining Value: 716.47
Sell Date: 
2006-03-16 00:00:00
    Sell Price: 2299.56
    Updated Value: 14513.83

-------------------------

Buy Date: 
2006-03-23 00:00:00
Account Value: 14513.83
    Buy Price: 2300.15
    Num Shares: 6.0
    Remaining Value: 712.93
Sell Date: 
2006-05-15 00:00:00
    Sell Price: 2238.52
    Updated Value: 14144.05

-------------------------

Buy Date: 
2006-08-23 00:00:00
Account Value: 14144.05
    Buy Price: 2134.66
    Num Shares: 6.0
    Remaining Value: 1336.09
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 2374.64
    Updated Value: 15583.93

-------------------------

Buy Date: 
2007-04-13 00:00:00
Account Value: 15583.93
    Buy Price: 2491.94
    Num Shares: 6.0
    Remaining Value: 632.29
Sell Date: 
2007-08-03 00:00:00
    Sell Price: 2511.25
    Updated Value: 15699.79

-------------------------

Buy Date: 
2007-09-21 00:00:00
Account Value: 15699.79
    Buy Price: 2671.22
    Num Shares: 5.0
    Remaining Value: 2343.69
Sell Date: 
2007-11-16 00:00:00
    Sell Price: 2637.24
    Updated Value: 15529.89

-------------------------

Buy Date: 
2008-04-04 00:00:00
Account Value: 15529.89
    Buy Price: 2370.98
    Num Shares: 6.0
    Remaining Value: 1304.01
Sell Date: 
2008-06-23 00:00:00
    Sell Price: 2385.74
    Updated Value: 15618.45

-------------------------

Buy Date: 
2008-08-14 00:00:00
Account Value: 15618.45
    Buy Price: 2453.67
    Num Shares: 6.0
    Remaining Value: 896.43
Sell Date: 
2008-09-11 00:00:00
    Sell Price: 2258.22
    Updated Value: 14445.75

-------------------------

Buy Date: 
2009-01-08 00:00:00
Account Value: 14445.75
    Buy Price: 1617.01
    Num Shares: 8.0
    Remaining Value: 1509.67
Sell Date: 
2009-01-26 00:00:00
    Sell Price: 1489.46
    Updated Value: 13425.35

-------------------------

Buy Date: 
2009-03-26 00:00:00
Account Value: 13425.35
    Buy Price: 1587.0
    Num Shares: 8.0
    Remaining Value: 729.35
Sell Date: 
2009-11-06 00:00:00
    Sell Price: 2112.44
    Updated Value: 17628.87

-------------------------

Buy Date: 
2009-11-16 00:00:00
Account Value: 17628.87
    Buy Price: 2197.85
    Num Shares: 8.0
    Remaining Value: 46.07
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 2190.91
    Updated Value: 17573.35

-------------------------

Buy Date: 
2010-03-05 00:00:00
Account Value: 17573.35
    Buy Price: 2326.35
    Num Shares: 7.0
    Remaining Value: 1288.9
Sell Date: 
2010-05-13 00:00:00
    Sell Price: 2394.36
    Updated Value: 18049.42

-------------------------

Buy Date: 
2010-07-27 00:00:00
Account Value: 18049.42
    Buy Price: 2288.25
    Num Shares: 7.0
    Remaining Value: 2031.67
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 2179.76
    Updated Value: 17289.99

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 17289.99
    Buy Price: 2301.32
    Num Shares: 7.0
    Remaining Value: 1180.75
Sell Date: 
2011-03-16 00:00:00
    Sell Price: 2616.82
    Updated Value: 19498.49

-------------------------

Buy Date: 
2011-04-06 00:00:00
Account Value: 19498.49
    Buy Price: 2799.82
    Num Shares: 6.0
    Remaining Value: 2699.57
Sell Date: 
2011-06-02 00:00:00
    Sell Price: 2773.31
    Updated Value: 19339.43

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 19339.43
    Buy Price: 2802.62
    Num Shares: 6.0
    Remaining Value: 2523.71
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 2357.69
    Updated Value: 16669.85

-------------------------

Buy Date: 
2011-10-17 00:00:00
Account Value: 16669.85
    Buy Price: 2614.92
    Num Shares: 6.0
    Remaining Value: 980.33
Sell Date: 
2011-11-29 00:00:00
    Sell Price: 2515.51
    Updated Value: 16073.39

-------------------------

Buy Date: 
2011-12-09 00:00:00
Account Value: 16073.39
    Buy Price: 2646.85
    Num Shares: 6.0
    Remaining Value: 192.29
Sell Date: 
2011-12-16 00:00:00
    Sell Price: 2555.33
    Updated Value: 15524.27

-------------------------

Buy Date: 
2012-01-09 00:00:00
Account Value: 15524.27
    Buy Price: 2676.56
    Num Shares: 5.0
    Remaining Value: 2141.47
Sell Date: 
2012-04-27 00:00:00
    Sell Price: 3069.2
    Updated Value: 17487.47

-------------------------

Buy Date: 
2012-04-30 00:00:00
Account Value: 17487.47
    Buy Price: 3046.36
    Num Shares: 5.0
    Remaining Value: 2255.67
Sell Date: 
2012-05-01 00:00:00
    Sell Price: 3050.44
    Updated Value: 17507.87

-------------------------

Buy Date: 
2012-05-08 00:00:00
Account Value: 17507.87
    Buy Price: 2946.27
    Num Shares: 5.0
    Remaining Value: 2776.52
Sell Date: 
2012-05-09 00:00:00
    Sell Price: 2934.71
    Updated Value: 17450.07

-------------------------

Buy Date: 
2012-07-10 00:00:00
Account Value: 17450.07
    Buy Price: 2902.33
    Num Shares: 6.0
    Remaining Value: 36.09
Sell Date: 
2012-10-18 00:00:00
    Sell Price: 3072.87
    Updated Value: 18473.31

-------------------------

Buy Date: 
2012-12-19 00:00:00
Account Value: 18473.31
    Buy Price: 3044.36
    Num Shares: 6.0
    Remaining Value: 207.15
Sell Date: 
2013-07-01 00:00:00
    Sell Price: 3434.49
    Updated Value: 20814.09

-------------------------

Buy Date: 
2013-07-10 00:00:00
Account Value: 20814.09
    Buy Price: 3520.76
    Num Shares: 5.0
    Remaining Value: 3210.29
Sell Date: 
2014-02-06 00:00:00
    Sell Price: 4057.12
    Updated Value: 23495.89

-------------------------

Buy Date: 
2014-02-18 00:00:00
Account Value: 23495.89
    Buy Price: 4272.78
    Num Shares: 5.0
    Remaining Value: 2131.99
Sell Date: 
2014-04-04 00:00:00
    Sell Price: 4127.73
    Updated Value: 22770.64

-------------------------

Buy Date: 
2014-05-30 00:00:00
Account Value: 22770.64
    Buy Price: 4242.62
    Num Shares: 5.0
    Remaining Value: 1557.54
Sell Date: 
2014-08-13 00:00:00
    Sell Price: 4434.13
    Updated Value: 23728.19

-------------------------

Buy Date: 
2014-08-19 00:00:00
Account Value: 23728.19
    Buy Price: 4527.51
    Num Shares: 5.0
    Remaining Value: 1090.64
Sell Date: 
2014-10-07 00:00:00
    Sell Price: 4385.2
    Updated Value: 23016.64

-------------------------

Buy Date: 
2014-11-04 00:00:00
Account Value: 23016.64
    Buy Price: 4623.64
    Num Shares: 4.0
    Remaining Value: 4522.08
Sell Date: 
2015-01-14 00:00:00
    Sell Price: 4639.32
    Updated Value: 23079.36

-------------------------

Buy Date: 
2015-02-12 00:00:00
Account Value: 23079.36
    Buy Price: 4857.61
    Num Shares: 4.0
    Remaining Value: 3648.92
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 23632.84


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 23632.84





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 2305.59
    Num Shares: 4.0
    Remaining Value: 777.64
Sell Date: 
2001-07-17 00:00:00
    Sell Price: 2067.32
    Updated Value: 9046.92

-------------------------

Buy Date: 
2001-11-14 00:00:00
Account Value: 9046.92
    Buy Price: 1903.19
    Num Shares: 4.0
    Remaining Value: 1434.16
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1818.88
    Updated Value: 8709.68

-------------------------

Buy Date: 
2002-10-29 00:00:00
Account Value: 8709.68
    Buy Price: 1300.54
    Num Shares: 6.0
    Remaining Value: 906.44
Sell Date: 
2003-01-30 00:00:00
    Sell Price: 1322.35
    Updated Value: 8840.54

-------------------------

Buy Date: 
2003-03-25 00:00:00
Account Value: 8840.54
    Buy Price: 1391.01
    Num Shares: 6.0
    Remaining Value: 494.48
Sell Date: 
2004-03-15 00:00:00
    Sell Price: 1939.2
    Updated Value: 12129.68

-------------------------

Buy Date: 
2004-04-16 00:00:00
Account Value: 12129.68
    Buy Price: 1995.74
    Num Shares: 6.0
    Remaining Value: 155.24
Sell Date: 
2004-04-19 00:00:00
    Sell Price: 2020.43
    Updated Value: 12277.82

-------------------------

Buy Date: 
2004-06-09 00:00:00
Account Value: 12277.82
    Buy Price: 1990.61
    Num Shares: 6.0
    Remaining Value: 334.16
Sell Date: 
2004-07-14 00:00:00
    Sell Price: 1914.88
    Updated Value: 11823.44

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 11823.44
    Buy Price: 1971.03
    Num Shares: 5.0
    Remaining Value: 1968.29
Sell Date: 
2005-01-31 00:00:00
    Sell Price: 2062.41
    Updated Value: 12280.34

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 12280.34
    Buy Price: 2071.24
    Num Shares: 5.0
    Remaining Value: 1924.14
Sell Date: 
2005-09-29 00:00:00
    Sell Price: 2141.22
    Updated Value: 12630.24

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 12630.24
    Buy Price: 2202.47
    Num Shares: 5.0
    Remaining Value: 1617.89
Sell Date: 
2006-05-18 00:00:00
    Sell Price: 2180.32
    Updated Value: 12519.49

-------------------------

Buy Date: 
2006-08-28 00:00:00
Account Value: 12519.49
    Buy Price: 2160.7
    Num Shares: 5.0
    Remaining Value: 1715.99
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 2374.64
    Updated Value: 13589.19

-------------------------

Buy Date: 
2007-04-12 00:00:00
Account Value: 13589.19
    Buy Price: 2480.32
    Num Shares: 5.0
    Remaining Value: 1187.59
Sell Date: 
2007-08-07 00:00:00
    Sell Price: 2561.6
    Updated Value: 13995.59

-------------------------

Buy Date: 
2007-09-21 00:00:00
Account Value: 13995.59
    Buy Price: 2671.22
    Num Shares: 5.0
    Remaining Value: 639.49
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 2562.15
    Updated Value: 13450.24

-------------------------

Buy Date: 
2008-04-23 00:00:00
Account Value: 13450.24
    Buy Price: 2405.21
    Num Shares: 5.0
    Remaining Value: 1424.19
Sell Date: 
2008-07-01 00:00:00
    Sell Price: 2304.97
    Updated Value: 12949.04

-------------------------

Buy Date: 
2008-08-19 00:00:00
Account Value: 12949.04
    Buy Price: 2384.36
    Num Shares: 5.0
    Remaining Value: 1027.24
Sell Date: 
2008-08-29 00:00:00
    Sell Price: 2367.52
    Updated Value: 12864.84

-------------------------

Buy Date: 
2009-03-31 00:00:00
Account Value: 12864.84
    Buy Price: 1528.59
    Num Shares: 8.0
    Remaining Value: 636.12
Sell Date: 
2010-02-08 00:00:00
    Sell Price: 2126.05
    Updated Value: 17644.52

-------------------------

Buy Date: 
2010-02-25 00:00:00
Account Value: 17644.52
    Buy Price: 2234.22
    Num Shares: 7.0
    Remaining Value: 2004.98
Sell Date: 
2010-05-24 00:00:00
    Sell Price: 2213.55
    Updated Value: 17499.83

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 17499.83
    Buy Price: 2301.32
    Num Shares: 7.0
    Remaining Value: 1390.59
Sell Date: 
2011-03-22 00:00:00
    Sell Price: 2683.87
    Updated Value: 20177.68

-------------------------

Buy Date: 
2011-04-01 00:00:00
Account Value: 20177.68
    Buy Price: 2789.6
    Num Shares: 7.0
    Remaining Value: 650.48
Sell Date: 
2011-06-06 00:00:00
    Sell Price: 2702.56
    Updated Value: 19568.4

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 19568.4
    Buy Price: 2802.62
    Num Shares: 6.0
    Remaining Value: 2752.68
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 2556.39
    Updated Value: 18091.02

-------------------------

Buy Date: 
2011-10-21 00:00:00
Account Value: 18091.02
    Buy Price: 2637.46
    Num Shares: 6.0
    Remaining Value: 2266.26
Sell Date: 
2011-12-01 00:00:00
    Sell Price: 2626.2
    Updated Value: 18023.46

-------------------------

Buy Date: 
2011-12-08 00:00:00
Account Value: 18023.46
    Buy Price: 2596.38
    Num Shares: 6.0
    Remaining Value: 2445.18
Sell Date: 
2011-12-23 00:00:00
    Sell Price: 2618.64
    Updated Value: 18157.02

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 18157.02
    Buy Price: 2605.15
    Num Shares: 6.0
    Remaining Value: 2526.12
Sell Date: 
2012-05-15 00:00:00
    Sell Price: 2893.76
    Updated Value: 19888.68

-------------------------

Buy Date: 
2012-07-31 00:00:00
Account Value: 19888.68
    Buy Price: 2939.52
    Num Shares: 6.0
    Remaining Value: 2251.56
Sell Date: 
2012-08-01 00:00:00
    Sell Price: 2920.21
    Updated Value: 19772.82

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 19772.82
    Buy Price: 2989.91
    Num Shares: 6.0
    Remaining Value: 1833.36
Sell Date: 
2012-11-01 00:00:00
    Sell Price: 3020.06
    Updated Value: 19953.72

-------------------------

Buy Date: 
2013-01-09 00:00:00
Account Value: 19953.72
    Buy Price: 3105.81
    Num Shares: 6.0
    Remaining Value: 1318.86
Sell Date: 
2014-04-08 00:00:00
    Sell Price: 4112.99
    Updated Value: 25996.8

-------------------------

Buy Date: 
2014-06-05 00:00:00
Account Value: 25996.8
    Buy Price: 4296.23
    Num Shares: 6.0
    Remaining Value: 219.42
Sell Date: 
2014-10-10 00:00:00
    Sell Price: 4276.24
    Updated Value: 25876.86

-------------------------

Buy Date: 
2014-11-03 00:00:00
Account Value: 25876.86
    Buy Price: 4638.91
    Num Shares: 5.0
    Remaining Value: 2682.31
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 27662.21


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 27662.21





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-12-05 00:00:00
Account Value: 10000
    Buy Price: 2046.84
    Num Shares: 4.0
    Remaining Value: 1812.64
Sell Date: 
2002-02-27 00:00:00
    Sell Price: 1751.88
    Updated Value: 8820.16

-------------------------

Buy Date: 
2002-03-08 00:00:00
Account Value: 8820.16
    Buy Price: 1929.67
    Num Shares: 4.0
    Remaining Value: 1101.48
Sell Date: 
2002-04-03 00:00:00
    Sell Price: 1784.35
    Updated Value: 8238.88

-------------------------

Buy Date: 
2002-11-15 00:00:00
Account Value: 8238.88
    Buy Price: 1411.14
    Num Shares: 5.0
    Remaining Value: 1183.18
Sell Date: 
2003-02-07 00:00:00
    Sell Price: 1282.47
    Updated Value: 7595.53

-------------------------

Buy Date: 
2003-02-27 00:00:00
Account Value: 7595.53
    Buy Price: 1323.94
    Num Shares: 5.0
    Remaining Value: 975.83
Sell Date: 
2003-03-07 00:00:00
    Sell Price: 1305.29
    Updated Value: 7502.28

-------------------------

Buy Date: 
2003-03-20 00:00:00
Account Value: 7502.28
    Buy Price: 1402.77
    Num Shares: 5.0
    Remaining Value: 488.43
Sell Date: 
2004-03-22 00:00:00
    Sell Price: 1909.9
    Updated Value: 10037.93

-------------------------

Buy Date: 
2004-04-06 00:00:00
Account Value: 10037.93
    Buy Price: 2059.9
    Num Shares: 4.0
    Remaining Value: 1798.33
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 9627.37

-------------------------

Buy Date: 
2004-10-13 00:00:00
Account Value: 9627.37
    Buy Price: 1920.53
    Num Shares: 5.0
    Remaining Value: 24.72
Sell Date: 
2005-03-23 00:00:00
    Sell Price: 1990.22
    Updated Value: 9975.82

-------------------------

Buy Date: 
2005-06-03 00:00:00
Account Value: 9975.82
    Buy Price: 2071.43
    Num Shares: 4.0
    Remaining Value: 1690.1
Sell Date: 
2005-10-18 00:00:00
    Sell Price: 2056.0
    Updated Value: 9914.1

-------------------------

Buy Date: 
2005-11-03 00:00:00
Account Value: 9914.1
    Buy Price: 2160.22
    Num Shares: 4.0
    Remaining Value: 1273.22
Sell Date: 
2006-05-19 00:00:00
    Sell Price: 2193.88
    Updated Value: 10048.74

-------------------------

Buy Date: 
2006-09-21 00:00:00
Account Value: 10048.74
    Buy Price: 2237.75
    Num Shares: 4.0
    Remaining Value: 1097.74
Sell Date: 
2007-03-14 00:00:00
    Sell Price: 2371.74
    Updated Value: 10584.7

-------------------------

Buy Date: 
2007-03-23 00:00:00
Account Value: 10584.7
    Buy Price: 2448.93
    Num Shares: 4.0
    Remaining Value: 788.98
Sell Date: 
2007-08-22 00:00:00
    Sell Price: 2552.8
    Updated Value: 11000.18

-------------------------

Buy Date: 
2007-08-30 00:00:00
Account Value: 11000.18
    Buy Price: 2565.3
    Num Shares: 4.0
    Remaining Value: 738.98
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 2562.15
    Updated Value: 10987.58

-------------------------

Buy Date: 
2007-12-10 00:00:00
Account Value: 10987.58
    Buy Price: 2718.95
    Num Shares: 4.0
    Remaining Value: 111.78
Sell Date: 
2007-12-24 00:00:00
    Sell Price: 2713.5
    Updated Value: 10965.78

-------------------------

Buy Date: 
2008-01-02 00:00:00
Account Value: 10965.78
    Buy Price: 2609.63
    Num Shares: 4.0
    Remaining Value: 527.26
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 2440.51
    Updated Value: 10289.3

-------------------------

Buy Date: 
2008-05-14 00:00:00
Account Value: 10289.3
    Buy Price: 2496.7
    Num Shares: 4.0
    Remaining Value: 302.5
Sell Date: 
2008-07-03 00:00:00
    Sell Price: 2245.38
    Updated Value: 9284.02

-------------------------

Buy Date: 
2008-08-13 00:00:00
Account Value: 9284.02
    Buy Price: 2428.62
    Num Shares: 3.0
    Remaining Value: 1998.16
Sell Date: 
2008-09-05 00:00:00
    Sell Price: 2255.88
    Updated Value: 8765.8

-------------------------

Buy Date: 
2009-04-07 00:00:00
Account Value: 8765.8
    Buy Price: 1561.61
    Num Shares: 5.0
    Remaining Value: 957.75
Sell Date: 
2010-05-27 00:00:00
    Sell Price: 2277.68
    Updated Value: 12346.15

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 12346.15
    Buy Price: 2381.22
    Num Shares: 5.0
    Remaining Value: 440.05
Sell Date: 
2011-06-13 00:00:00
    Sell Price: 2639.69
    Updated Value: 13638.5

-------------------------

Buy Date: 
2011-07-08 00:00:00
Account Value: 13638.5
    Buy Price: 2859.81
    Num Shares: 4.0
    Remaining Value: 2199.26
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 2532.41
    Updated Value: 12328.9

-------------------------

Buy Date: 
2011-11-03 00:00:00
Account Value: 12328.9
    Buy Price: 2697.97
    Num Shares: 4.0
    Remaining Value: 1537.02
Sell Date: 
2011-11-22 00:00:00
    Sell Price: 2521.28
    Updated Value: 11622.14

-------------------------

Buy Date: 
2011-12-13 00:00:00
Account Value: 11622.14
    Buy Price: 2579.27
    Num Shares: 4.0
    Remaining Value: 1305.06
Sell Date: 
2011-12-14 00:00:00
    Sell Price: 2539.31
    Updated Value: 11462.3

-------------------------

Buy Date: 
2012-01-04 00:00:00
Account Value: 11462.3
    Buy Price: 2648.36
    Num Shares: 4.0
    Remaining Value: 868.86
Sell Date: 
2012-05-31 00:00:00
    Sell Price: 2827.34
    Updated Value: 12178.22

-------------------------

Buy Date: 
2012-07-13 00:00:00
Account Value: 12178.22
    Buy Price: 2908.47
    Num Shares: 4.0
    Remaining Value: 544.34
Sell Date: 
2012-07-16 00:00:00
    Sell Price: 2896.94
    Updated Value: 12132.1

-------------------------

Buy Date: 
2012-08-10 00:00:00
Account Value: 12132.1
    Buy Price: 3020.86
    Num Shares: 4.0
    Remaining Value: 48.66
Sell Date: 
2012-11-14 00:00:00
    Sell Price: 2846.81
    Updated Value: 11435.9

-------------------------

Buy Date: 
2012-12-06 00:00:00
Account Value: 11435.9
    Buy Price: 2989.27
    Num Shares: 3.0
    Remaining Value: 2468.09
Sell Date: 
2012-12-14 00:00:00
    Sell Price: 2971.33
    Updated Value: 11382.08

-------------------------

Buy Date: 
2012-12-19 00:00:00
Account Value: 11382.08
    Buy Price: 3044.36
    Num Shares: 3.0
    Remaining Value: 2249.0
Sell Date: 
2014-04-21 00:00:00
    Sell Price: 4121.55
    Updated Value: 14613.65

-------------------------

Buy Date: 
2014-04-30 00:00:00
Account Value: 14613.65
    Buy Price: 4114.56
    Num Shares: 3.0
    Remaining Value: 2269.97
Sell Date: 
2014-05-06 00:00:00
    Sell Price: 4080.76
    Updated Value: 14512.25

-------------------------

Buy Date: 
2014-05-30 00:00:00
Account Value: 14512.25
    Buy Price: 4242.62
    Num Shares: 3.0
    Remaining Value: 1784.39
Sell Date: 
2014-10-20 00:00:00
    Sell Price: 4316.07
    Updated Value: 14732.6

-------------------------

Buy Date: 
2014-10-29 00:00:00
Account Value: 14732.6
    Buy Price: 4549.23
    Num Shares: 3.0
    Remaining Value: 1084.91
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 16072.85


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 16072.85





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 2128.86
    Num Shares: 4.0
    Remaining Value: 1484.56
Sell Date: 
2001-06-20 00:00:00
    Sell Price: 2031.24
    Updated Value: 9609.52

-------------------------

Buy Date: 
2001-12-12 00:00:00
Account Value: 9609.52
    Buy Price: 2011.38
    Num Shares: 4.0
    Remaining Value: 1564.0
Sell Date: 
2002-01-28 00:00:00
    Sell Price: 1943.91
    Updated Value: 9339.64

-------------------------

Buy Date: 
2003-03-25 00:00:00
Account Value: 9339.64
    Buy Price: 1391.01
    Num Shares: 6.0
    Remaining Value: 993.58
Sell Date: 
2004-05-18 00:00:00
    Sell Price: 1897.82
    Updated Value: 12380.5

-------------------------

Buy Date: 
2004-06-03 00:00:00
Account Value: 12380.5
    Buy Price: 1960.26
    Num Shares: 6.0
    Remaining Value: 618.94
Sell Date: 
2004-07-15 00:00:00
    Sell Price: 1912.71
    Updated Value: 12095.2

-------------------------

Buy Date: 
2004-11-05 00:00:00
Account Value: 12095.2
    Buy Price: 2038.94
    Num Shares: 5.0
    Remaining Value: 1900.5
Sell Date: 
2005-04-21 00:00:00
    Sell Price: 1962.41
    Updated Value: 11712.55

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 11712.55
    Buy Price: 2042.58
    Num Shares: 5.0
    Remaining Value: 1499.65
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 2198.24
    Updated Value: 12490.85

-------------------------

Buy Date: 
2006-09-27 00:00:00
Account Value: 12490.85
    Buy Price: 2263.39
    Num Shares: 5.0
    Remaining Value: 1173.9
Sell Date: 
2008-01-10 00:00:00
    Sell Price: 2488.52
    Updated Value: 13616.5

-------------------------

Buy Date: 
2009-06-03 00:00:00
Account Value: 13616.5
    Buy Price: 1825.92
    Num Shares: 7.0
    Remaining Value: 835.06
Sell Date: 
2010-07-02 00:00:00
    Sell Price: 2091.79
    Updated Value: 15477.59

-------------------------

Buy Date: 
2010-08-02 00:00:00
Account Value: 15477.59
    Buy Price: 2295.36
    Num Shares: 6.0
    Remaining Value: 1705.43
Sell Date: 
2010-08-17 00:00:00
    Sell Price: 2209.44
    Updated Value: 14962.07

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 14962.07
    Buy Price: 2334.55
    Num Shares: 6.0
    Remaining Value: 954.77
Sell Date: 
2011-08-09 00:00:00
    Sell Price: 2482.52
    Updated Value: 15849.89

-------------------------

Buy Date: 
2012-01-17 00:00:00
Account Value: 15849.89
    Buy Price: 2728.08
    Num Shares: 5.0
    Remaining Value: 2209.49
Sell Date: 
2012-11-12 00:00:00
    Sell Price: 2904.25
    Updated Value: 16730.74

-------------------------

Buy Date: 
2012-12-06 00:00:00
Account Value: 16730.74
    Buy Price: 2989.27
    Num Shares: 5.0
    Remaining Value: 1784.39
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 26764.29


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 26764.29





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-01 00:00:00
Account Value: 10000
    Buy Price: 2168.24
    Num Shares: 4.0
    Remaining Value: 1327.04
Sell Date: 
2001-05-04 00:00:00
    Sell Price: 2191.53
    Updated Value: 10093.16

-------------------------

Buy Date: 
2001-05-07 00:00:00
Account Value: 10093.16
    Buy Price: 2173.57
    Num Shares: 4.0
    Remaining Value: 1398.88
Sell Date: 
2001-06-22 00:00:00
    Sell Price: 2034.84
    Updated Value: 9538.24

-------------------------

Buy Date: 
2003-04-24 00:00:00
Account Value: 9538.24
    Buy Price: 1457.23
    Num Shares: 6.0
    Remaining Value: 794.86
Sell Date: 
2004-07-21 00:00:00
    Sell Price: 1874.37
    Updated Value: 12041.08

-------------------------

Buy Date: 
2004-11-08 00:00:00
Account Value: 12041.08
    Buy Price: 2039.25
    Num Shares: 5.0
    Remaining Value: 1844.83
Sell Date: 
2005-04-20 00:00:00
    Sell Price: 1913.76
    Updated Value: 11413.63

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 11413.63
    Buy Price: 2042.58
    Num Shares: 5.0
    Remaining Value: 1200.73
Sell Date: 
2005-10-19 00:00:00
    Sell Price: 2091.24
    Updated Value: 11656.93

-------------------------

Buy Date: 
2005-10-27 00:00:00
Account Value: 11656.93
    Buy Price: 2063.81
    Num Shares: 5.0
    Remaining Value: 1337.88
Sell Date: 
2006-05-31 00:00:00
    Sell Price: 2178.88
    Updated Value: 12232.28

-------------------------

Buy Date: 
2006-09-21 00:00:00
Account Value: 12232.28
    Buy Price: 2237.75
    Num Shares: 5.0
    Remaining Value: 1043.53
Sell Date: 
2008-01-14 00:00:00
    Sell Price: 2478.3
    Updated Value: 13435.03

-------------------------

Buy Date: 
2009-07-21 00:00:00
Account Value: 13435.03
    Buy Price: 1916.2
    Num Shares: 7.0
    Remaining Value: 21.63
Sell Date: 
2010-07-08 00:00:00
    Sell Price: 2175.4
    Updated Value: 15249.43

-------------------------

Buy Date: 
2010-07-19 00:00:00
Account Value: 15249.43
    Buy Price: 2198.23
    Num Shares: 6.0
    Remaining Value: 2060.05
Sell Date: 
2010-08-23 00:00:00
    Sell Price: 2159.63
    Updated Value: 15017.83

-------------------------

Buy Date: 
2010-09-16 00:00:00
Account Value: 15017.83
    Buy Price: 2303.25
    Num Shares: 6.0
    Remaining Value: 1198.33
Sell Date: 
2011-08-12 00:00:00
    Sell Price: 2507.98
    Updated Value: 16246.21

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 16246.21
    Buy Price: 2727.49
    Num Shares: 5.0
    Remaining Value: 2608.76
Sell Date: 
2011-11-10 00:00:00
    Sell Price: 2625.15
    Updated Value: 15734.51

-------------------------

Buy Date: 
2012-01-19 00:00:00
Account Value: 15734.51
    Buy Price: 2788.33
    Num Shares: 5.0
    Remaining Value: 1792.86
Sell Date: 
2012-11-21 00:00:00
    Sell Price: 2926.55
    Updated Value: 16425.61

-------------------------

Buy Date: 
2012-11-28 00:00:00
Account Value: 16425.61
    Buy Price: 2991.78
    Num Shares: 5.0
    Remaining Value: 1466.71
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 26446.61


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 26446.61





-----------------------------------------------------------------------
^IXIC Calculations, N = [10, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 2116.24
    Num Shares: 4.0
    Remaining Value: 1535.04
Sell Date: 
2001-06-25 00:00:00
    Sell Price: 2050.87
    Updated Value: 9738.52

-------------------------

Buy Date: 
2001-07-03 00:00:00
Account Value: 9738.52
    Buy Price: 2140.8
    Num Shares: 4.0
    Remaining Value: 1175.32
Sell Date: 
2001-07-16 00:00:00
    Sell Price: 2029.12
    Updated Value: 9291.8

-------------------------

Buy Date: 
2003-05-09 00:00:00
Account Value: 9291.8
    Buy Price: 1520.15
    Num Shares: 6.0
    Remaining Value: 170.9
Sell Date: 
2004-08-03 00:00:00
    Sell Price: 1859.42
    Updated Value: 11327.42

-------------------------

Buy Date: 
2004-10-12 00:00:00
Account Value: 11327.42
    Buy Price: 1925.17
    Num Shares: 5.0
    Remaining Value: 1701.57
Sell Date: 
2004-10-19 00:00:00
    Sell Price: 1922.9
    Updated Value: 11316.07

-------------------------

Buy Date: 
2004-11-02 00:00:00
Account Value: 11316.07
    Buy Price: 1984.79
    Num Shares: 5.0
    Remaining Value: 1392.12
Sell Date: 
2005-04-18 00:00:00
    Sell Price: 1912.92
    Updated Value: 10956.72

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 10956.72
    Buy Price: 2042.58
    Num Shares: 5.0
    Remaining Value: 743.82
Sell Date: 
2006-06-15 00:00:00
    Sell Price: 2144.15
    Updated Value: 11464.57

-------------------------

Buy Date: 
2006-09-20 00:00:00
Account Value: 11464.57
    Buy Price: 2252.89
    Num Shares: 5.0
    Remaining Value: 200.12
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 2417.59
    Updated Value: 12288.07

-------------------------

Buy Date: 
2009-07-29 00:00:00
Account Value: 12288.07
    Buy Price: 1967.76
    Num Shares: 6.0
    Remaining Value: 481.51
Sell Date: 
2010-09-01 00:00:00
    Sell Price: 2176.84
    Updated Value: 13542.55

-------------------------

Buy Date: 
2010-09-09 00:00:00
Account Value: 13542.55
    Buy Price: 2236.2
    Num Shares: 6.0
    Remaining Value: 125.35
Sell Date: 
2011-08-17 00:00:00
    Sell Price: 2511.48
    Updated Value: 15194.23

-------------------------

Buy Date: 
2011-09-23 00:00:00
Account Value: 15194.23
    Buy Price: 2483.23
    Num Shares: 6.0
    Remaining Value: 294.85
Sell Date: 
2011-09-29 00:00:00
    Sell Price: 2480.76
    Updated Value: 15179.41

-------------------------

Buy Date: 
2011-10-20 00:00:00
Account Value: 15179.41
    Buy Price: 2598.62
    Num Shares: 5.0
    Remaining Value: 2186.31
Sell Date: 
2011-11-22 00:00:00
    Sell Price: 2521.28
    Updated Value: 14792.71

-------------------------

Buy Date: 
2012-01-17 00:00:00
Account Value: 14792.71
    Buy Price: 2728.08
    Num Shares: 5.0
    Remaining Value: 1152.31
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 26132.21


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 26132.21





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-01-29 00:00:00
Account Value: 10000
    Buy Price: 2838.34
    Num Shares: 3.0
    Remaining Value: 1484.98
Sell Date: 
2001-02-20 00:00:00
    Sell Price: 2318.35
    Updated Value: 8440.03

-------------------------

Buy Date: 
2001-04-26 00:00:00
Account Value: 8440.03
    Buy Price: 2034.88
    Num Shares: 4.0
    Remaining Value: 300.51
Sell Date: 
2001-06-15 00:00:00
    Sell Price: 2028.43
    Updated Value: 8414.23

-------------------------

Buy Date: 
2001-10-19 00:00:00
Account Value: 8414.23
    Buy Price: 1671.31
    Num Shares: 5.0
    Remaining Value: 57.68
Sell Date: 
2002-01-30 00:00:00
    Sell Price: 1913.44
    Updated Value: 9624.88

-------------------------

Buy Date: 
2002-03-15 00:00:00
Account Value: 9624.88
    Buy Price: 1868.3
    Num Shares: 5.0
    Remaining Value: 283.38
Sell Date: 
2002-04-09 00:00:00
    Sell Price: 1742.57
    Updated Value: 8996.23

-------------------------

Buy Date: 
2002-06-03 00:00:00
Account Value: 8996.23
    Buy Price: 1562.56
    Num Shares: 5.0
    Remaining Value: 1183.43
Sell Date: 
2002-06-07 00:00:00
    Sell Price: 1535.48
    Updated Value: 8860.83

-------------------------

Buy Date: 
2002-08-26 00:00:00
Account Value: 8860.83
    Buy Price: 1391.74
    Num Shares: 6.0
    Remaining Value: 510.39
Sell Date: 
2002-09-16 00:00:00
    Sell Price: 1275.88
    Updated Value: 8165.67

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 8165.67
    Buy Price: 1315.83
    Num Shares: 6.0
    Remaining Value: 270.69
Sell Date: 
2002-12-23 00:00:00
    Sell Price: 1381.69
    Updated Value: 8560.83

-------------------------

Buy Date: 
2003-01-16 00:00:00
Account Value: 8560.83
    Buy Price: 1423.75
    Num Shares: 6.0
    Remaining Value: 18.33
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 1306.15
    Updated Value: 7855.23

-------------------------

Buy Date: 
2003-03-07 00:00:00
Account Value: 7855.23
    Buy Price: 1305.29
    Num Shares: 6.0
    Remaining Value: 23.49
Sell Date: 
2003-08-12 00:00:00
    Sell Price: 1687.01
    Updated Value: 10145.55

-------------------------

Buy Date: 
2003-08-28 00:00:00
Account Value: 10145.55
    Buy Price: 1800.18
    Num Shares: 5.0
    Remaining Value: 1144.65
Sell Date: 
2003-10-10 00:00:00
    Sell Price: 1915.31
    Updated Value: 10721.2

-------------------------

Buy Date: 
2003-10-17 00:00:00
Account Value: 10721.2
    Buy Price: 1912.36
    Num Shares: 5.0
    Remaining Value: 1159.4
Sell Date: 
2003-12-04 00:00:00
    Sell Price: 1968.8
    Updated Value: 11003.4

-------------------------

Buy Date: 
2003-12-12 00:00:00
Account Value: 11003.4
    Buy Price: 1949.0
    Num Shares: 5.0
    Remaining Value: 1258.4
Sell Date: 
2004-02-12 00:00:00
    Sell Price: 2073.61
    Updated Value: 11626.45

-------------------------

Buy Date: 
2004-04-13 00:00:00
Account Value: 11626.45
    Buy Price: 2030.08
    Num Shares: 5.0
    Remaining Value: 1476.05
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 11262.35

-------------------------

Buy Date: 
2004-06-08 00:00:00
Account Value: 11262.35
    Buy Price: 2023.53
    Num Shares: 5.0
    Remaining Value: 1144.7
Sell Date: 
2004-07-16 00:00:00
    Sell Price: 1883.15
    Updated Value: 10560.45

-------------------------

Buy Date: 
2004-09-07 00:00:00
Account Value: 10560.45
    Buy Price: 1858.56
    Num Shares: 5.0
    Remaining Value: 1267.65
Sell Date: 
2005-01-13 00:00:00
    Sell Price: 2070.56
    Updated Value: 11620.45

-------------------------

Buy Date: 
2005-02-18 00:00:00
Account Value: 11620.45
    Buy Price: 2058.62
    Num Shares: 5.0
    Remaining Value: 1327.35
Sell Date: 
2005-03-09 00:00:00
    Sell Price: 2061.29
    Updated Value: 11633.8

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 11633.8
    Buy Price: 2042.58
    Num Shares: 5.0
    Remaining Value: 1420.9
Sell Date: 
2005-07-13 00:00:00
    Sell Price: 2144.11
    Updated Value: 12141.45

-------------------------

Buy Date: 
2005-07-15 00:00:00
Account Value: 12141.45
    Buy Price: 2156.78
    Num Shares: 5.0
    Remaining Value: 1357.55
Sell Date: 
2005-08-23 00:00:00
    Sell Price: 2137.25
    Updated Value: 12043.8

-------------------------

Buy Date: 
2005-09-19 00:00:00
Account Value: 12043.8
    Buy Price: 2145.26
    Num Shares: 5.0
    Remaining Value: 1317.5
Sell Date: 
2005-10-03 00:00:00
    Sell Price: 2155.43
    Updated Value: 12094.65

-------------------------

Buy Date: 
2005-11-08 00:00:00
Account Value: 12094.65
    Buy Price: 2172.07
    Num Shares: 5.0
    Remaining Value: 1234.3
Sell Date: 
2005-12-30 00:00:00
    Sell Price: 2205.32
    Updated Value: 12260.9

-------------------------

Buy Date: 
2006-01-13 00:00:00
Account Value: 12260.9
    Buy Price: 2317.04
    Num Shares: 5.0
    Remaining Value: 675.7
Sell Date: 
2006-02-09 00:00:00
    Sell Price: 2255.87
    Updated Value: 11955.05

-------------------------

Buy Date: 
2006-03-03 00:00:00
Account Value: 11955.05
    Buy Price: 2302.6
    Num Shares: 5.0
    Remaining Value: 442.05
Sell Date: 
2006-05-10 00:00:00
    Sell Price: 2320.74
    Updated Value: 12045.75

-------------------------

Buy Date: 
2006-07-17 00:00:00
Account Value: 12045.75
    Buy Price: 2037.72
    Num Shares: 5.0
    Remaining Value: 1857.15
Sell Date: 
2006-07-21 00:00:00
    Sell Price: 2020.39
    Updated Value: 11959.1

-------------------------

Buy Date: 
2006-08-17 00:00:00
Account Value: 11959.1
    Buy Price: 2157.61
    Num Shares: 5.0
    Remaining Value: 1171.05
Sell Date: 
2006-12-27 00:00:00
    Sell Price: 2431.22
    Updated Value: 13327.15

-------------------------

Buy Date: 
2007-01-18 00:00:00
Account Value: 13327.15
    Buy Price: 2443.21
    Num Shares: 5.0
    Remaining Value: 1111.1
Sell Date: 
2007-03-09 00:00:00
    Sell Price: 2387.55
    Updated Value: 13048.85

-------------------------

Buy Date: 
2007-04-04 00:00:00
Account Value: 13048.85
    Buy Price: 2458.69
    Num Shares: 5.0
    Remaining Value: 755.4
Sell Date: 
2007-08-07 00:00:00
    Sell Price: 2561.6
    Updated Value: 13563.4

-------------------------

Buy Date: 
2007-09-07 00:00:00
Account Value: 13563.4
    Buy Price: 2565.7
    Num Shares: 5.0
    Remaining Value: 734.9
Sell Date: 
2007-11-14 00:00:00
    Sell Price: 2644.32
    Updated Value: 13956.5

-------------------------

Buy Date: 
2007-12-18 00:00:00
Account Value: 13956.5
    Buy Price: 2596.03
    Num Shares: 5.0
    Remaining Value: 976.35
Sell Date: 
2008-01-07 00:00:00
    Sell Price: 2499.46
    Updated Value: 13473.65

-------------------------

Buy Date: 
2008-04-07 00:00:00
Account Value: 13473.65
    Buy Price: 2364.83
    Num Shares: 5.0
    Remaining Value: 1649.5
Sell Date: 
2008-06-12 00:00:00
    Sell Price: 2404.35
    Updated Value: 13671.25

-------------------------

Buy Date: 
2008-06-16 00:00:00
Account Value: 13671.25
    Buy Price: 2474.78
    Num Shares: 5.0
    Remaining Value: 1297.35
Sell Date: 
2008-06-19 00:00:00
    Sell Price: 2462.06
    Updated Value: 13607.65

-------------------------

Buy Date: 
2008-08-05 00:00:00
Account Value: 13607.65
    Buy Price: 2349.83
    Num Shares: 5.0
    Remaining Value: 1858.5
Sell Date: 
2008-09-09 00:00:00
    Sell Price: 2209.81
    Updated Value: 12907.55

-------------------------

Buy Date: 
2008-12-22 00:00:00
Account Value: 12907.55
    Buy Price: 1532.35
    Num Shares: 8.0
    Remaining Value: 648.75
Sell Date: 
2009-01-27 00:00:00
    Sell Price: 1504.9
    Updated Value: 12687.95

-------------------------

Buy Date: 
2009-02-23 00:00:00
Account Value: 12687.95
    Buy Price: 1387.72
    Num Shares: 9.0
    Remaining Value: 198.47
Sell Date: 
2009-03-02 00:00:00
    Sell Price: 1322.85
    Updated Value: 12104.12

-------------------------

Buy Date: 
2009-03-27 00:00:00
Account Value: 12104.12
    Buy Price: 1545.2
    Num Shares: 7.0
    Remaining Value: 1287.72
Sell Date: 
2009-07-07 00:00:00
    Sell Price: 1746.17
    Updated Value: 13510.91

-------------------------

Buy Date: 
2009-07-24 00:00:00
Account Value: 13510.91
    Buy Price: 1965.96
    Num Shares: 6.0
    Remaining Value: 1715.15
Sell Date: 
2009-10-21 00:00:00
    Sell Price: 2150.73
    Updated Value: 14619.53

-------------------------

Buy Date: 
2009-10-22 00:00:00
Account Value: 14619.53
    Buy Price: 2165.29
    Num Shares: 6.0
    Remaining Value: 1627.79
Sell Date: 
2009-11-09 00:00:00
    Sell Price: 2154.06
    Updated Value: 14552.15

-------------------------

Buy Date: 
2009-11-24 00:00:00
Account Value: 14552.15
    Buy Price: 2169.18
    Num Shares: 6.0
    Remaining Value: 1537.07
Sell Date: 
2010-02-01 00:00:00
    Sell Price: 2171.2
    Updated Value: 14564.27

-------------------------

Buy Date: 
2010-03-03 00:00:00
Account Value: 14564.27
    Buy Price: 2280.68
    Num Shares: 6.0
    Remaining Value: 880.19
Sell Date: 
2010-05-13 00:00:00
    Sell Price: 2394.36
    Updated Value: 15246.35

-------------------------

Buy Date: 
2010-06-29 00:00:00
Account Value: 15246.35
    Buy Price: 2135.18
    Num Shares: 7.0
    Remaining Value: 300.09
Sell Date: 
2010-07-08 00:00:00
    Sell Price: 2175.4
    Updated Value: 15527.89

-------------------------

Buy Date: 
2010-07-28 00:00:00
Account Value: 15527.89
    Buy Price: 2264.56
    Num Shares: 6.0
    Remaining Value: 1940.53
Sell Date: 
2010-08-24 00:00:00
    Sell Price: 2123.76
    Updated Value: 14683.09

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 14683.09
    Buy Price: 2355.83
    Num Shares: 6.0
    Remaining Value: 548.11
Sell Date: 
2010-12-02 00:00:00
    Sell Price: 2579.35
    Updated Value: 16024.21

-------------------------

Buy Date: 
2010-12-09 00:00:00
Account Value: 16024.21
    Buy Price: 2616.67
    Num Shares: 6.0
    Remaining Value: 324.19
Sell Date: 
2011-03-11 00:00:00
    Sell Price: 2715.61
    Updated Value: 16617.85

-------------------------

Buy Date: 
2011-04-08 00:00:00
Account Value: 16617.85
    Buy Price: 2780.42
    Num Shares: 5.0
    Remaining Value: 2715.75
Sell Date: 
2011-05-31 00:00:00
    Sell Price: 2835.3
    Updated Value: 16892.25

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 16892.25
    Buy Price: 2802.62
    Num Shares: 6.0
    Remaining Value: 76.53
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 2357.69
    Updated Value: 14222.67

-------------------------

Buy Date: 
2011-09-13 00:00:00
Account Value: 14222.67
    Buy Price: 2532.15
    Num Shares: 5.0
    Remaining Value: 1561.92
Sell Date: 
2011-10-06 00:00:00
    Sell Price: 2506.82
    Updated Value: 14096.02

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 14096.02
    Buy Price: 2699.44
    Num Shares: 5.0
    Remaining Value: 598.82
Sell Date: 
2011-11-23 00:00:00
    Sell Price: 2460.08
    Updated Value: 12899.22

-------------------------

Buy Date: 
2011-12-20 00:00:00
Account Value: 12899.22
    Buy Price: 2603.73
    Num Shares: 4.0
    Remaining Value: 2484.3
Sell Date: 
2012-04-20 00:00:00
    Sell Price: 3000.45
    Updated Value: 14486.1

-------------------------

Buy Date: 
2012-06-25 00:00:00
Account Value: 14486.1
    Buy Price: 2836.16
    Num Shares: 5.0
    Remaining Value: 305.3
Sell Date: 
2012-07-30 00:00:00
    Sell Price: 2945.84
    Updated Value: 15034.5

-------------------------

Buy Date: 
2012-08-01 00:00:00
Account Value: 15034.5
    Buy Price: 2920.21
    Num Shares: 5.0
    Remaining Value: 433.45
Sell Date: 
2012-08-10 00:00:00
    Sell Price: 3020.86
    Updated Value: 15537.75

-------------------------

Buy Date: 
2012-08-13 00:00:00
Account Value: 15537.75
    Buy Price: 3022.52
    Num Shares: 5.0
    Remaining Value: 425.15
Sell Date: 
2012-10-12 00:00:00
    Sell Price: 3044.11
    Updated Value: 15645.7

-------------------------

Buy Date: 
2012-12-10 00:00:00
Account Value: 15645.7
    Buy Price: 2986.96
    Num Shares: 5.0
    Remaining Value: 710.9
Sell Date: 
2013-03-12 00:00:00
    Sell Price: 3242.32
    Updated Value: 16922.5

-------------------------

Buy Date: 
2013-03-13 00:00:00
Account Value: 16922.5
    Buy Price: 3245.12
    Num Shares: 5.0
    Remaining Value: 696.9
Sell Date: 
2013-04-18 00:00:00
    Sell Price: 3166.36
    Updated Value: 16528.7

-------------------------

Buy Date: 
2013-04-25 00:00:00
Account Value: 16528.7
    Buy Price: 3289.99
    Num Shares: 5.0
    Remaining Value: 78.75
Sell Date: 
2013-06-18 00:00:00
    Sell Price: 3482.18
    Updated Value: 17489.65

-------------------------

Buy Date: 
2013-07-16 00:00:00
Account Value: 17489.65
    Buy Price: 3598.5
    Num Shares: 4.0
    Remaining Value: 3095.65
Sell Date: 
2013-09-03 00:00:00
    Sell Price: 3612.61
    Updated Value: 17546.09

-------------------------

Buy Date: 
2013-09-17 00:00:00
Account Value: 17546.09
    Buy Price: 3745.7
    Num Shares: 4.0
    Remaining Value: 2563.29
Sell Date: 
2014-02-06 00:00:00
    Sell Price: 4057.12
    Updated Value: 18791.77

-------------------------

Buy Date: 
2014-02-25 00:00:00
Account Value: 18791.77
    Buy Price: 4287.59
    Num Shares: 4.0
    Remaining Value: 1641.41
Sell Date: 
2014-03-28 00:00:00
    Sell Price: 4155.76
    Updated Value: 18264.45

-------------------------

Buy Date: 
2014-05-16 00:00:00
Account Value: 18264.45
    Buy Price: 4090.59
    Num Shares: 4.0
    Remaining Value: 1902.09
Sell Date: 
2014-08-08 00:00:00
    Sell Price: 4370.9
    Updated Value: 19385.69

-------------------------

Buy Date: 
2014-08-26 00:00:00
Account Value: 19385.69
    Buy Price: 4570.64
    Num Shares: 4.0
    Remaining Value: 1103.13
Sell Date: 
2014-09-29 00:00:00
    Sell Price: 4505.85
    Updated Value: 19126.53

-------------------------

Buy Date: 
2014-11-05 00:00:00
Account Value: 19126.53
    Buy Price: 4620.72
    Num Shares: 4.0
    Remaining Value: 643.65
Sell Date: 
2014-12-24 00:00:00
    Sell Price: 4773.47
    Updated Value: 19737.53

-------------------------

Buy Date: 
2015-01-08 00:00:00
Account Value: 19737.53
    Buy Price: 4736.19
    Num Shares: 4.0
    Remaining Value: 792.77
Sell Date: 
2015-01-16 00:00:00
    Sell Price: 4634.38
    Updated Value: 19330.29

-------------------------

Buy Date: 
2015-02-09 00:00:00
Account Value: 19330.29
    Buy Price: 4726.01
    Num Shares: 4.0
    Remaining Value: 426.25
Sell Date: 
2015-03-26 00:00:00
    Sell Price: 4863.36
    Updated Value: 19879.69

-------------------------

Buy Date: 
2015-04-07 00:00:00
Account Value: 19879.69
    Buy Price: 4910.23
    Num Shares: 4.0
    Remaining Value: 238.77
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20222.69


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20222.69





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-02 00:00:00
Account Value: 10000
    Buy Price: 2220.6
    Num Shares: 4.0
    Remaining Value: 1117.6
Sell Date: 
2001-06-26 00:00:00
    Sell Price: 2064.62
    Updated Value: 9376.08

-------------------------

Buy Date: 
2001-10-31 00:00:00
Account Value: 9376.08
    Buy Price: 1690.2
    Num Shares: 5.0
    Remaining Value: 925.08
Sell Date: 
2002-02-01 00:00:00
    Sell Price: 1911.24
    Updated Value: 10481.28

-------------------------

Buy Date: 
2002-03-25 00:00:00
Account Value: 10481.28
    Buy Price: 1812.49
    Num Shares: 5.0
    Remaining Value: 1418.83
Sell Date: 
2002-04-03 00:00:00
    Sell Price: 1784.35
    Updated Value: 10340.58

-------------------------

Buy Date: 
2002-09-04 00:00:00
Account Value: 10340.58
    Buy Price: 1292.31
    Num Shares: 8.0
    Remaining Value: 2.1
Sell Date: 
2002-09-13 00:00:00
    Sell Price: 1291.4
    Updated Value: 10333.3

-------------------------

Buy Date: 
2002-10-31 00:00:00
Account Value: 10333.3
    Buy Price: 1329.75
    Num Shares: 7.0
    Remaining Value: 1025.05
Sell Date: 
2002-12-31 00:00:00
    Sell Price: 1335.51
    Updated Value: 10373.62

-------------------------

Buy Date: 
2003-01-22 00:00:00
Account Value: 10373.62
    Buy Price: 1359.48
    Num Shares: 7.0
    Remaining Value: 857.26
Sell Date: 
2003-01-29 00:00:00
    Sell Price: 1358.06
    Updated Value: 10363.68

-------------------------

Buy Date: 
2003-03-27 00:00:00
Account Value: 10363.68
    Buy Price: 1384.25
    Num Shares: 7.0
    Remaining Value: 673.93
Sell Date: 
2004-03-03 00:00:00
    Sell Price: 2033.36
    Updated Value: 14907.45

-------------------------

Buy Date: 
2004-04-16 00:00:00
Account Value: 14907.45
    Buy Price: 1995.74
    Num Shares: 7.0
    Remaining Value: 937.27
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 14638.09

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 14638.09
    Buy Price: 1998.23
    Num Shares: 7.0
    Remaining Value: 650.48
Sell Date: 
2004-07-21 00:00:00
    Sell Price: 1874.37
    Updated Value: 13771.07

-------------------------

Buy Date: 
2004-09-16 00:00:00
Account Value: 13771.07
    Buy Price: 1904.08
    Num Shares: 7.0
    Remaining Value: 442.51
Sell Date: 
2005-01-21 00:00:00
    Sell Price: 2034.27
    Updated Value: 14682.4

-------------------------

Buy Date: 
2005-05-24 00:00:00
Account Value: 14682.4
    Buy Price: 2061.62
    Num Shares: 7.0
    Remaining Value: 251.06
Sell Date: 
2005-09-07 00:00:00
    Sell Price: 2172.03
    Updated Value: 15455.27

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 15455.27
    Buy Price: 2202.47
    Num Shares: 7.0
    Remaining Value: 37.98
Sell Date: 
2006-02-23 00:00:00
    Sell Price: 2279.32
    Updated Value: 15993.22

-------------------------

Buy Date: 
2006-02-28 00:00:00
Account Value: 15993.22
    Buy Price: 2281.39
    Num Shares: 7.0
    Remaining Value: 23.49
Sell Date: 
2006-05-17 00:00:00
    Sell Price: 2195.8
    Updated Value: 15394.09

-------------------------

Buy Date: 
2006-08-28 00:00:00
Account Value: 15394.09
    Buy Price: 2160.7
    Num Shares: 7.0
    Remaining Value: 269.19
Sell Date: 
2007-03-12 00:00:00
    Sell Price: 2402.29
    Updated Value: 17085.22

-------------------------

Buy Date: 
2007-04-13 00:00:00
Account Value: 17085.22
    Buy Price: 2491.94
    Num Shares: 6.0
    Remaining Value: 2133.58
Sell Date: 
2007-08-09 00:00:00
    Sell Price: 2556.49
    Updated Value: 17472.52

-------------------------

Buy Date: 
2007-09-20 00:00:00
Account Value: 17472.52
    Buy Price: 2654.29
    Num Shares: 6.0
    Remaining Value: 1546.78
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 2562.15
    Updated Value: 16919.68

-------------------------

Buy Date: 
2008-04-10 00:00:00
Account Value: 16919.68
    Buy Price: 2351.7
    Num Shares: 7.0
    Remaining Value: 457.78
Sell Date: 
2008-06-25 00:00:00
    Sell Price: 2401.26
    Updated Value: 17266.6

-------------------------

Buy Date: 
2008-08-18 00:00:00
Account Value: 17266.6
    Buy Price: 2416.98
    Num Shares: 7.0
    Remaining Value: 347.74
Sell Date: 
2008-09-16 00:00:00
    Sell Price: 2207.9
    Updated Value: 15803.04

-------------------------

Buy Date: 
2009-01-07 00:00:00
Account Value: 15803.04
    Buy Price: 1599.06
    Num Shares: 9.0
    Remaining Value: 1411.5
Sell Date: 
2009-02-02 00:00:00
    Sell Price: 1494.43
    Updated Value: 14861.37

-------------------------

Buy Date: 
2009-03-31 00:00:00
Account Value: 14861.37
    Buy Price: 1528.59
    Num Shares: 9.0
    Remaining Value: 1104.06
Sell Date: 
2009-11-12 00:00:00
    Sell Price: 2149.02
    Updated Value: 20445.24

-------------------------

Buy Date: 
2009-11-20 00:00:00
Account Value: 20445.24
    Buy Price: 2146.04
    Num Shares: 9.0
    Remaining Value: 1130.88
Sell Date: 
2010-02-08 00:00:00
    Sell Price: 2126.05
    Updated Value: 20265.33

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 20265.33
    Buy Price: 2340.68
    Num Shares: 8.0
    Remaining Value: 1539.89
Sell Date: 
2010-05-18 00:00:00
    Sell Price: 2317.26
    Updated Value: 20077.97

-------------------------

Buy Date: 
2010-07-29 00:00:00
Account Value: 20077.97
    Buy Price: 2251.69
    Num Shares: 8.0
    Remaining Value: 2064.45
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 2118.69
    Updated Value: 19013.97

-------------------------

Buy Date: 
2010-09-21 00:00:00
Account Value: 19013.97
    Buy Price: 2349.35
    Num Shares: 8.0
    Remaining Value: 219.17
Sell Date: 
2011-03-17 00:00:00
    Sell Price: 2636.05
    Updated Value: 21307.57

-------------------------

Buy Date: 
2011-04-12 00:00:00
Account Value: 21307.57
    Buy Price: 2744.79
    Num Shares: 7.0
    Remaining Value: 2094.04
Sell Date: 
2011-06-03 00:00:00
    Sell Price: 2732.78
    Updated Value: 21223.5

-------------------------

Buy Date: 
2011-07-15 00:00:00
Account Value: 21223.5
    Buy Price: 2789.8
    Num Shares: 7.0
    Remaining Value: 1694.9
Sell Date: 
2011-08-11 00:00:00
    Sell Price: 2492.68
    Updated Value: 19143.66

-------------------------

Buy Date: 
2011-10-14 00:00:00
Account Value: 19143.66
    Buy Price: 2667.85
    Num Shares: 7.0
    Remaining Value: 468.71
Sell Date: 
2011-10-18 00:00:00
    Sell Price: 2657.43
    Updated Value: 19070.72

-------------------------

Buy Date: 
2011-10-19 00:00:00
Account Value: 19070.72
    Buy Price: 2604.04
    Num Shares: 7.0
    Remaining Value: 842.44
Sell Date: 
2011-12-06 00:00:00
    Sell Price: 2649.56
    Updated Value: 19389.36

-------------------------

Buy Date: 
2012-01-11 00:00:00
Account Value: 19389.36
    Buy Price: 2710.76
    Num Shares: 7.0
    Remaining Value: 414.04
Sell Date: 
2012-05-03 00:00:00
    Sell Price: 3024.3
    Updated Value: 21584.14

-------------------------

Buy Date: 
2012-07-09 00:00:00
Account Value: 21584.14
    Buy Price: 2931.77
    Num Shares: 7.0
    Remaining Value: 1061.75
Sell Date: 
2012-10-22 00:00:00
    Sell Price: 3016.96
    Updated Value: 22180.47

-------------------------

Buy Date: 
2012-12-18 00:00:00
Account Value: 22180.47
    Buy Price: 3054.53
    Num Shares: 7.0
    Remaining Value: 798.76
Sell Date: 
2013-07-05 00:00:00
    Sell Price: 3479.38
    Updated Value: 25154.42

-------------------------

Buy Date: 
2013-07-16 00:00:00
Account Value: 25154.42
    Buy Price: 3598.5
    Num Shares: 6.0
    Remaining Value: 3563.42
Sell Date: 
2014-02-13 00:00:00
    Sell Price: 4240.67
    Updated Value: 29007.44

-------------------------

Buy Date: 
2014-02-20 00:00:00
Account Value: 29007.44
    Buy Price: 4267.55
    Num Shares: 6.0
    Remaining Value: 3402.14
Sell Date: 
2014-04-10 00:00:00
    Sell Price: 4054.11
    Updated Value: 27726.8

-------------------------

Buy Date: 
2014-06-02 00:00:00
Account Value: 27726.8
    Buy Price: 4237.2
    Num Shares: 6.0
    Remaining Value: 2303.6
Sell Date: 
2014-08-20 00:00:00
    Sell Price: 4526.48
    Updated Value: 29462.48

-------------------------

Buy Date: 
2014-08-21 00:00:00
Account Value: 29462.48
    Buy Price: 4532.1
    Num Shares: 6.0
    Remaining Value: 2269.88
Sell Date: 
2014-10-10 00:00:00
    Sell Price: 4276.24
    Updated Value: 27927.32

-------------------------

Buy Date: 
2014-11-07 00:00:00
Account Value: 27927.32
    Buy Price: 4632.53
    Num Shares: 6.0
    Remaining Value: 132.14
Sell Date: 
2015-01-20 00:00:00
    Sell Price: 4654.85
    Updated Value: 28061.24

-------------------------

Buy Date: 
2015-02-11 00:00:00
Account Value: 28061.24
    Buy Price: 4801.18
    Num Shares: 5.0
    Remaining Value: 4055.34
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 29035.24


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 29035.24





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 2305.59
    Num Shares: 4.0
    Remaining Value: 777.64
Sell Date: 
2001-07-20 00:00:00
    Sell Price: 2029.37
    Updated Value: 8895.12

-------------------------

Buy Date: 
2001-11-19 00:00:00
Account Value: 8895.12
    Buy Price: 1934.42
    Num Shares: 4.0
    Remaining Value: 1157.44
Sell Date: 
2002-02-11 00:00:00
    Sell Price: 1846.66
    Updated Value: 8544.08

-------------------------

Buy Date: 
2002-11-01 00:00:00
Account Value: 8544.08
    Buy Price: 1360.7
    Num Shares: 6.0
    Remaining Value: 379.88
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 1306.15
    Updated Value: 8216.78

-------------------------

Buy Date: 
2003-04-01 00:00:00
Account Value: 8216.78
    Buy Price: 1348.3
    Num Shares: 6.0
    Remaining Value: 126.98
Sell Date: 
2004-03-16 00:00:00
    Sell Price: 1943.09
    Updated Value: 11785.52

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 11785.52
    Buy Price: 1998.23
    Num Shares: 5.0
    Remaining Value: 1794.37
Sell Date: 
2004-07-16 00:00:00
    Sell Price: 1883.15
    Updated Value: 11210.12

-------------------------

Buy Date: 
2004-10-05 00:00:00
Account Value: 11210.12
    Buy Price: 1955.5
    Num Shares: 5.0
    Remaining Value: 1432.62
Sell Date: 
2005-02-02 00:00:00
    Sell Price: 2075.06
    Updated Value: 11807.92

-------------------------

Buy Date: 
2005-06-01 00:00:00
Account Value: 11807.92
    Buy Price: 2087.86
    Num Shares: 5.0
    Remaining Value: 1368.62
Sell Date: 
2005-10-04 00:00:00
    Sell Price: 2139.36
    Updated Value: 12065.42

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 12065.42
    Buy Price: 2187.93
    Num Shares: 5.0
    Remaining Value: 1125.77
Sell Date: 
2006-05-19 00:00:00
    Sell Price: 2193.88
    Updated Value: 12095.17

-------------------------

Buy Date: 
2006-08-31 00:00:00
Account Value: 12095.17
    Buy Price: 2183.75
    Num Shares: 5.0
    Remaining Value: 1176.42
Sell Date: 
2007-03-13 00:00:00
    Sell Price: 2350.57
    Updated Value: 12929.27

-------------------------

Buy Date: 
2007-04-11 00:00:00
Account Value: 12929.27
    Buy Price: 2459.31
    Num Shares: 5.0
    Remaining Value: 632.72
Sell Date: 
2007-08-13 00:00:00
    Sell Price: 2542.24
    Updated Value: 13343.92

-------------------------

Buy Date: 
2007-09-20 00:00:00
Account Value: 13343.92
    Buy Price: 2654.29
    Num Shares: 5.0
    Remaining Value: 72.47
Sell Date: 
2007-11-28 00:00:00
    Sell Price: 2662.91
    Updated Value: 13387.02

-------------------------

Buy Date: 
2008-04-21 00:00:00
Account Value: 13387.02
    Buy Price: 2408.04
    Num Shares: 5.0
    Remaining Value: 1346.82
Sell Date: 
2008-07-03 00:00:00
    Sell Price: 2245.38
    Updated Value: 12573.72

-------------------------

Buy Date: 
2008-08-26 00:00:00
Account Value: 12573.72
    Buy Price: 2361.97
    Num Shares: 5.0
    Remaining Value: 763.87
Sell Date: 
2008-09-05 00:00:00
    Sell Price: 2255.88
    Updated Value: 12043.27

-------------------------

Buy Date: 
2009-04-03 00:00:00
Account Value: 12043.27
    Buy Price: 1621.87
    Num Shares: 7.0
    Remaining Value: 690.18
Sell Date: 
2010-02-11 00:00:00
    Sell Price: 2177.41
    Updated Value: 15932.05

-------------------------

Buy Date: 
2010-03-03 00:00:00
Account Value: 15932.05
    Buy Price: 2280.68
    Num Shares: 6.0
    Remaining Value: 2247.97
Sell Date: 
2010-05-25 00:00:00
    Sell Price: 2210.95
    Updated Value: 15513.67

-------------------------

Buy Date: 
2010-08-19 00:00:00
Account Value: 15513.67
    Buy Price: 2178.95
    Num Shares: 7.0
    Remaining Value: 261.02
Sell Date: 
2010-08-23 00:00:00
    Sell Price: 2159.63
    Updated Value: 15378.43

-------------------------

Buy Date: 
2010-09-21 00:00:00
Account Value: 15378.43
    Buy Price: 2349.35
    Num Shares: 6.0
    Remaining Value: 1282.33
Sell Date: 
2011-03-25 00:00:00
    Sell Price: 2743.06
    Updated Value: 17740.69

-------------------------

Buy Date: 
2011-04-07 00:00:00
Account Value: 17740.69
    Buy Price: 2796.14
    Num Shares: 6.0
    Remaining Value: 963.85
Sell Date: 
2011-06-10 00:00:00
    Sell Price: 2643.73
    Updated Value: 16826.23

-------------------------

Buy Date: 
2011-07-18 00:00:00
Account Value: 16826.23
    Buy Price: 2765.11
    Num Shares: 6.0
    Remaining Value: 235.57
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 2532.41
    Updated Value: 15430.03

-------------------------

Buy Date: 
2011-10-27 00:00:00
Account Value: 15430.03
    Buy Price: 2738.63
    Num Shares: 5.0
    Remaining Value: 1736.88
Sell Date: 
2011-12-08 00:00:00
    Sell Price: 2596.38
    Updated Value: 14718.78

-------------------------

Buy Date: 
2011-12-15 00:00:00
Account Value: 14718.78
    Buy Price: 2541.01
    Num Shares: 5.0
    Remaining Value: 2013.73
Sell Date: 
2012-01-03 00:00:00
    Sell Price: 2648.72
    Updated Value: 15257.33

-------------------------

Buy Date: 
2012-01-05 00:00:00
Account Value: 15257.33
    Buy Price: 2669.86
    Num Shares: 5.0
    Remaining Value: 1908.03
Sell Date: 
2012-05-17 00:00:00
    Sell Price: 2813.69
    Updated Value: 15976.48

-------------------------

Buy Date: 
2012-08-03 00:00:00
Account Value: 15976.48
    Buy Price: 2967.9
    Num Shares: 5.0
    Remaining Value: 1136.98
Sell Date: 
2012-11-02 00:00:00
    Sell Price: 2982.13
    Updated Value: 16047.63

-------------------------

Buy Date: 
2013-01-08 00:00:00
Account Value: 16047.63
    Buy Price: 3091.81
    Num Shares: 5.0
    Remaining Value: 588.58
Sell Date: 
2014-04-11 00:00:00
    Sell Price: 3999.73
    Updated Value: 20587.23

-------------------------

Buy Date: 
2014-06-10 00:00:00
Account Value: 20587.23
    Buy Price: 4338.0
    Num Shares: 4.0
    Remaining Value: 3235.23
Sell Date: 
2014-10-13 00:00:00
    Sell Price: 4213.66
    Updated Value: 20089.87

-------------------------

Buy Date: 
2014-11-07 00:00:00
Account Value: 20089.87
    Buy Price: 4632.53
    Num Shares: 4.0
    Remaining Value: 1559.75
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21543.67


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21543.67





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-12-05 00:00:00
Account Value: 10000
    Buy Price: 2046.84
    Num Shares: 4.0
    Remaining Value: 1812.64
Sell Date: 
2002-03-07 00:00:00
    Sell Price: 1881.63
    Updated Value: 9339.16

-------------------------

Buy Date: 
2002-03-11 00:00:00
Account Value: 9339.16
    Buy Price: 1929.49
    Num Shares: 4.0
    Remaining Value: 1621.2
Sell Date: 
2002-04-04 00:00:00
    Sell Price: 1789.75
    Updated Value: 8780.2

-------------------------

Buy Date: 
2002-11-20 00:00:00
Account Value: 8780.2
    Buy Price: 1419.35
    Num Shares: 6.0
    Remaining Value: 264.1
Sell Date: 
2003-02-13 00:00:00
    Sell Price: 1277.44
    Updated Value: 7928.74

-------------------------

Buy Date: 
2003-03-06 00:00:00
Account Value: 7928.74
    Buy Price: 1302.89
    Num Shares: 6.0
    Remaining Value: 111.4
Sell Date: 
2003-03-11 00:00:00
    Sell Price: 1271.47
    Updated Value: 7740.22

-------------------------

Buy Date: 
2003-03-25 00:00:00
Account Value: 7740.22
    Buy Price: 1391.01
    Num Shares: 5.0
    Remaining Value: 785.17
Sell Date: 
2004-03-26 00:00:00
    Sell Price: 1960.02
    Updated Value: 10585.27

-------------------------

Buy Date: 
2004-04-13 00:00:00
Account Value: 10585.27
    Buy Price: 2030.08
    Num Shares: 5.0
    Remaining Value: 434.87
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 10221.17

-------------------------

Buy Date: 
2004-10-19 00:00:00
Account Value: 10221.17
    Buy Price: 1922.9
    Num Shares: 5.0
    Remaining Value: 606.67
Sell Date: 
2005-03-28 00:00:00
    Sell Price: 1992.52
    Updated Value: 10569.27

-------------------------

Buy Date: 
2005-06-08 00:00:00
Account Value: 10569.27
    Buy Price: 2060.18
    Num Shares: 5.0
    Remaining Value: 268.37
Sell Date: 
2005-10-24 00:00:00
    Sell Price: 2115.83
    Updated Value: 10847.52

-------------------------

Buy Date: 
2005-11-08 00:00:00
Account Value: 10847.52
    Buy Price: 2172.07
    Num Shares: 4.0
    Remaining Value: 2159.24
Sell Date: 
2006-05-23 00:00:00
    Sell Price: 2158.76
    Updated Value: 10794.28

-------------------------

Buy Date: 
2006-09-27 00:00:00
Account Value: 10794.28
    Buy Price: 2263.39
    Num Shares: 4.0
    Remaining Value: 1740.72
Sell Date: 
2007-03-20 00:00:00
    Sell Price: 2408.21
    Updated Value: 11373.56

-------------------------

Buy Date: 
2007-03-28 00:00:00
Account Value: 11373.56
    Buy Price: 2417.1
    Num Shares: 4.0
    Remaining Value: 1705.16
Sell Date: 
2007-08-29 00:00:00
    Sell Price: 2563.16
    Updated Value: 11957.8

-------------------------

Buy Date: 
2007-09-06 00:00:00
Account Value: 11957.8
    Buy Price: 2614.32
    Num Shares: 4.0
    Remaining Value: 1500.52
Sell Date: 
2007-11-29 00:00:00
    Sell Price: 2668.13
    Updated Value: 12173.04

-------------------------

Buy Date: 
2007-12-14 00:00:00
Account Value: 12173.04
    Buy Price: 2635.74
    Num Shares: 4.0
    Remaining Value: 1630.08
Sell Date: 
2008-01-04 00:00:00
    Sell Price: 2504.65
    Updated Value: 11648.68

-------------------------

Buy Date: 
2008-05-16 00:00:00
Account Value: 11648.68
    Buy Price: 2528.85
    Num Shares: 4.0
    Remaining Value: 1533.28
Sell Date: 
2008-07-09 00:00:00
    Sell Price: 2234.89
    Updated Value: 10472.84

-------------------------

Buy Date: 
2008-08-18 00:00:00
Account Value: 10472.84
    Buy Price: 2416.98
    Num Shares: 4.0
    Remaining Value: 804.92
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 2269.76
    Updated Value: 9883.96

-------------------------

Buy Date: 
2009-04-09 00:00:00
Account Value: 9883.96
    Buy Price: 1652.54
    Num Shares: 5.0
    Remaining Value: 1621.26
Sell Date: 
2010-06-03 00:00:00
    Sell Price: 2303.03
    Updated Value: 13136.41

-------------------------

Buy Date: 
2010-09-29 00:00:00
Account Value: 13136.41
    Buy Price: 2376.56
    Num Shares: 5.0
    Remaining Value: 1253.61
Sell Date: 
2011-06-15 00:00:00
    Sell Price: 2631.46
    Updated Value: 14410.91

-------------------------

Buy Date: 
2011-07-14 00:00:00
Account Value: 14410.91
    Buy Price: 2762.67
    Num Shares: 5.0
    Remaining Value: 597.56
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 2357.69
    Updated Value: 12386.01

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 12386.01
    Buy Price: 2727.49
    Num Shares: 4.0
    Remaining Value: 1476.05
Sell Date: 
2011-11-25 00:00:00
    Sell Price: 2441.51
    Updated Value: 11242.09

-------------------------

Buy Date: 
2012-01-09 00:00:00
Account Value: 11242.09
    Buy Price: 2676.56
    Num Shares: 4.0
    Remaining Value: 535.85
Sell Date: 
2012-06-05 00:00:00
    Sell Price: 2778.11
    Updated Value: 11648.29

-------------------------

Buy Date: 
2012-08-15 00:00:00
Account Value: 11648.29
    Buy Price: 3030.93
    Num Shares: 3.0
    Remaining Value: 2555.5
Sell Date: 
2012-11-16 00:00:00
    Sell Price: 2853.13
    Updated Value: 11114.89

-------------------------

Buy Date: 
2012-12-18 00:00:00
Account Value: 11114.89
    Buy Price: 3054.53
    Num Shares: 3.0
    Remaining Value: 1951.3
Sell Date: 
2012-12-21 00:00:00
    Sell Price: 3021.01
    Updated Value: 11014.33

-------------------------

Buy Date: 
2013-01-02 00:00:00
Account Value: 11014.33
    Buy Price: 3112.26
    Num Shares: 3.0
    Remaining Value: 1677.55
Sell Date: 
2014-04-25 00:00:00
    Sell Price: 4075.56
    Updated Value: 13904.23

-------------------------

Buy Date: 
2014-06-05 00:00:00
Account Value: 13904.23
    Buy Price: 4296.23
    Num Shares: 3.0
    Remaining Value: 1015.54
Sell Date: 
2014-10-24 00:00:00
    Sell Price: 4483.72
    Updated Value: 14466.7

-------------------------

Buy Date: 
2014-11-03 00:00:00
Account Value: 14466.7
    Buy Price: 4638.91
    Num Shares: 3.0
    Remaining Value: 549.97
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 15537.91


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 15537.91





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 2193.68
    Num Shares: 4.0
    Remaining Value: 1225.28
Sell Date: 
2001-06-22 00:00:00
    Sell Price: 2034.84
    Updated Value: 9364.64

-------------------------

Buy Date: 
2001-12-17 00:00:00
Account Value: 9364.64
    Buy Price: 1987.45
    Num Shares: 4.0
    Remaining Value: 1414.84
Sell Date: 
2002-01-31 00:00:00
    Sell Price: 1934.03
    Updated Value: 9150.96

-------------------------

Buy Date: 
2003-03-27 00:00:00
Account Value: 9150.96
    Buy Price: 1384.25
    Num Shares: 6.0
    Remaining Value: 845.46
Sell Date: 
2004-05-20 00:00:00
    Sell Price: 1896.59
    Updated Value: 12225.0

-------------------------

Buy Date: 
2004-06-09 00:00:00
Account Value: 12225.0
    Buy Price: 1990.61
    Num Shares: 6.0
    Remaining Value: 281.34
Sell Date: 
2004-07-19 00:00:00
    Sell Price: 1883.83
    Updated Value: 11584.32

-------------------------

Buy Date: 
2004-11-09 00:00:00
Account Value: 11584.32
    Buy Price: 2043.33
    Num Shares: 5.0
    Remaining Value: 1367.67
Sell Date: 
2005-04-26 00:00:00
    Sell Price: 1927.44
    Updated Value: 11004.87

-------------------------

Buy Date: 
2005-05-24 00:00:00
Account Value: 11004.87
    Buy Price: 2061.62
    Num Shares: 5.0
    Remaining Value: 696.77
Sell Date: 
2006-06-01 00:00:00
    Sell Price: 2219.86
    Updated Value: 11796.07

-------------------------

Buy Date: 
2006-10-02 00:00:00
Account Value: 11796.07
    Buy Price: 2237.6
    Num Shares: 5.0
    Remaining Value: 608.07
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 2417.59
    Updated Value: 12696.02

-------------------------

Buy Date: 
2009-06-04 00:00:00
Account Value: 12696.02
    Buy Price: 1850.02
    Num Shares: 6.0
    Remaining Value: 1595.9
Sell Date: 
2010-07-07 00:00:00
    Sell Price: 2159.47
    Updated Value: 14552.72

-------------------------

Buy Date: 
2010-08-06 00:00:00
Account Value: 14552.72
    Buy Price: 2288.47
    Num Shares: 6.0
    Remaining Value: 821.9
Sell Date: 
2010-08-18 00:00:00
    Sell Price: 2215.7
    Updated Value: 14116.1

-------------------------

Buy Date: 
2010-09-27 00:00:00
Account Value: 14116.1
    Buy Price: 2369.77
    Num Shares: 5.0
    Remaining Value: 2267.25
Sell Date: 
2011-08-12 00:00:00
    Sell Price: 2507.98
    Updated Value: 14807.15

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 14807.15
    Buy Price: 2786.7
    Num Shares: 5.0
    Remaining Value: 873.65
Sell Date: 
2012-11-13 00:00:00
    Sell Price: 2883.89
    Updated Value: 15293.1

-------------------------

Buy Date: 
2012-12-13 00:00:00
Account Value: 15293.1
    Buy Price: 2992.16
    Num Shares: 5.0
    Remaining Value: 332.3
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 25312.2


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 25312.2





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-08 00:00:00
Account Value: 10000
    Buy Price: 2198.77
    Num Shares: 4.0
    Remaining Value: 1204.92
Sell Date: 
2001-06-28 00:00:00
    Sell Price: 2125.46
    Updated Value: 9706.76

-------------------------

Buy Date: 
2003-04-28 00:00:00
Account Value: 9706.76
    Buy Price: 1462.24
    Num Shares: 6.0
    Remaining Value: 933.32
Sell Date: 
2004-07-26 00:00:00
    Sell Price: 1839.02
    Updated Value: 11967.44

-------------------------

Buy Date: 
2004-11-10 00:00:00
Account Value: 11967.44
    Buy Price: 2034.56
    Num Shares: 5.0
    Remaining Value: 1794.64
Sell Date: 
2005-04-26 00:00:00
    Sell Price: 1927.44
    Updated Value: 11431.84

-------------------------

Buy Date: 
2005-05-23 00:00:00
Account Value: 11431.84
    Buy Price: 2056.65
    Num Shares: 5.0
    Remaining Value: 1148.59
Sell Date: 
2005-10-26 00:00:00
    Sell Price: 2100.05
    Updated Value: 11648.84

-------------------------

Buy Date: 
2005-11-02 00:00:00
Account Value: 11648.84
    Buy Price: 2144.31
    Num Shares: 5.0
    Remaining Value: 927.29
Sell Date: 
2006-06-06 00:00:00
    Sell Price: 2162.78
    Updated Value: 11741.19

-------------------------

Buy Date: 
2006-09-27 00:00:00
Account Value: 11741.19
    Buy Price: 2263.39
    Num Shares: 5.0
    Remaining Value: 424.24
Sell Date: 
2008-01-17 00:00:00
    Sell Price: 2346.9
    Updated Value: 12158.74

-------------------------

Buy Date: 
2009-07-17 00:00:00
Account Value: 12158.74
    Buy Price: 1886.61
    Num Shares: 6.0
    Remaining Value: 839.08
Sell Date: 
2010-07-15 00:00:00
    Sell Price: 2249.08
    Updated Value: 14333.56

-------------------------

Buy Date: 
2010-07-26 00:00:00
Account Value: 14333.56
    Buy Price: 2296.43
    Num Shares: 6.0
    Remaining Value: 554.98
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 2118.69
    Updated Value: 13267.12

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 13267.12
    Buy Price: 2334.55
    Num Shares: 5.0
    Remaining Value: 1594.37
Sell Date: 
2011-08-18 00:00:00
    Sell Price: 2380.43
    Updated Value: 13496.52

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 13496.52
    Buy Price: 2786.64
    Num Shares: 4.0
    Remaining Value: 2349.96
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 22333.88


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 22333.88





-----------------------------------------------------------------------
^IXIC Calculations, N = [15, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-04 00:00:00
Account Value: 10000
    Buy Price: 2191.53
    Num Shares: 4.0
    Remaining Value: 1233.88
Sell Date: 
2001-07-03 00:00:00
    Sell Price: 2140.8
    Updated Value: 9797.08

-------------------------

Buy Date: 
2001-07-11 00:00:00
Account Value: 9797.08
    Buy Price: 1972.04
    Num Shares: 4.0
    Remaining Value: 1908.92
Sell Date: 
2001-07-23 00:00:00
    Sell Price: 1988.56
    Updated Value: 9863.16

-------------------------

Buy Date: 
2003-05-13 00:00:00
Account Value: 9863.16
    Buy Price: 1539.68
    Num Shares: 6.0
    Remaining Value: 625.08
Sell Date: 
2004-08-05 00:00:00
    Sell Price: 1821.63
    Updated Value: 11554.86

-------------------------

Buy Date: 
2004-11-05 00:00:00
Account Value: 11554.86
    Buy Price: 2038.94
    Num Shares: 5.0
    Remaining Value: 1360.16
Sell Date: 
2005-04-20 00:00:00
    Sell Price: 1913.76
    Updated Value: 10928.96

-------------------------

Buy Date: 
2005-05-23 00:00:00
Account Value: 10928.96
    Buy Price: 2056.65
    Num Shares: 5.0
    Remaining Value: 645.71
Sell Date: 
2006-06-21 00:00:00
    Sell Price: 2141.2
    Updated Value: 11351.71

-------------------------

Buy Date: 
2006-09-21 00:00:00
Account Value: 11351.71
    Buy Price: 2237.75
    Num Shares: 5.0
    Remaining Value: 162.96
Sell Date: 
2008-01-18 00:00:00
    Sell Price: 2340.02
    Updated Value: 11863.06

-------------------------

Buy Date: 
2009-08-03 00:00:00
Account Value: 11863.06
    Buy Price: 2008.61
    Num Shares: 5.0
    Remaining Value: 1820.01
Sell Date: 
2011-08-22 00:00:00
    Sell Price: 2345.38
    Updated Value: 13546.91

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 13546.91
    Buy Price: 2650.67
    Num Shares: 5.0
    Remaining Value: 293.56
Sell Date: 
2011-11-25 00:00:00
    Sell Price: 2441.51
    Updated Value: 12501.11

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 12501.11
    Buy Price: 2786.7
    Num Shares: 4.0
    Remaining Value: 1354.31
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21338.23


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21338.23





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-01 00:00:00
Account Value: 10000
    Buy Price: 2168.24
    Num Shares: 4.0
    Remaining Value: 1327.04
Sell Date: 
2001-06-21 00:00:00
    Sell Price: 2058.76
    Updated Value: 9562.08

-------------------------

Buy Date: 
2001-07-24 00:00:00
Account Value: 9562.08
    Buy Price: 1959.24
    Num Shares: 4.0
    Remaining Value: 1725.12
Sell Date: 
2001-07-30 00:00:00
    Sell Price: 2017.84
    Updated Value: 9796.48

-------------------------

Buy Date: 
2001-10-23 00:00:00
Account Value: 9796.48
    Buy Price: 1704.44
    Num Shares: 5.0
    Remaining Value: 1274.28
Sell Date: 
2002-01-11 00:00:00
    Sell Price: 2022.46
    Updated Value: 11386.58

-------------------------

Buy Date: 
2002-01-22 00:00:00
Account Value: 11386.58
    Buy Price: 1882.53
    Num Shares: 6.0
    Remaining Value: 91.4
Sell Date: 
2002-02-05 00:00:00
    Sell Price: 1838.52
    Updated Value: 11122.52

-------------------------

Buy Date: 
2002-03-21 00:00:00
Account Value: 11122.52
    Buy Price: 1868.83
    Num Shares: 5.0
    Remaining Value: 1778.37
Sell Date: 
2002-04-10 00:00:00
    Sell Price: 1767.07
    Updated Value: 10613.72

-------------------------

Buy Date: 
2002-06-05 00:00:00
Account Value: 10613.72
    Buy Price: 1595.26
    Num Shares: 6.0
    Remaining Value: 1042.16
Sell Date: 
2002-06-14 00:00:00
    Sell Price: 1504.74
    Updated Value: 10070.6

-------------------------

Buy Date: 
2002-08-27 00:00:00
Account Value: 10070.6
    Buy Price: 1347.78
    Num Shares: 7.0
    Remaining Value: 636.14
Sell Date: 
2002-09-19 00:00:00
    Sell Price: 1216.45
    Updated Value: 9151.29

-------------------------

Buy Date: 
2002-10-30 00:00:00
Account Value: 9151.29
    Buy Price: 1326.73
    Num Shares: 6.0
    Remaining Value: 1190.91
Sell Date: 
2002-12-26 00:00:00
    Sell Price: 1367.89
    Updated Value: 9398.25

-------------------------

Buy Date: 
2003-01-21 00:00:00
Account Value: 9398.25
    Buy Price: 1364.25
    Num Shares: 6.0
    Remaining Value: 1212.75
Sell Date: 
2003-02-10 00:00:00
    Sell Price: 1296.68
    Updated Value: 8992.83

-------------------------

Buy Date: 
2003-03-12 00:00:00
Account Value: 8992.83
    Buy Price: 1279.24
    Num Shares: 7.0
    Remaining Value: 38.15
Sell Date: 
2003-04-25 00:00:00
    Sell Price: 1434.54
    Updated Value: 10079.93

-------------------------

Buy Date: 
2003-04-29 00:00:00
Account Value: 10079.93
    Buy Price: 1471.3
    Num Shares: 6.0
    Remaining Value: 1252.13
Sell Date: 
2003-08-12 00:00:00
    Sell Price: 1687.01
    Updated Value: 11374.19

-------------------------

Buy Date: 
2003-09-04 00:00:00
Account Value: 11374.19
    Buy Price: 1868.97
    Num Shares: 6.0
    Remaining Value: 160.37
Sell Date: 
2003-10-17 00:00:00
    Sell Price: 1912.36
    Updated Value: 11634.53

-------------------------

Buy Date: 
2003-10-24 00:00:00
Account Value: 11634.53
    Buy Price: 1865.59
    Num Shares: 6.0
    Remaining Value: 440.99
Sell Date: 
2003-11-18 00:00:00
    Sell Price: 1881.75
    Updated Value: 11731.49

-------------------------

Buy Date: 
2003-11-20 00:00:00
Account Value: 11731.49
    Buy Price: 1881.92
    Num Shares: 6.0
    Remaining Value: 439.97
Sell Date: 
2003-12-08 00:00:00
    Sell Price: 1948.85
    Updated Value: 12133.07

-------------------------

Buy Date: 
2003-12-19 00:00:00
Account Value: 12133.07
    Buy Price: 1951.02
    Num Shares: 6.0
    Remaining Value: 426.95
Sell Date: 
2004-01-06 00:00:00
    Sell Price: 2057.37
    Updated Value: 12771.17

-------------------------

Buy Date: 
2004-01-08 00:00:00
Account Value: 12771.17
    Buy Price: 2100.25
    Num Shares: 6.0
    Remaining Value: 169.67
Sell Date: 
2004-02-18 00:00:00
    Sell Price: 2076.47
    Updated Value: 12628.49

-------------------------

Buy Date: 
2004-04-16 00:00:00
Account Value: 12628.49
    Buy Price: 1995.74
    Num Shares: 6.0
    Remaining Value: 654.05
Sell Date: 
2004-05-06 00:00:00
    Sell Price: 1937.74
    Updated Value: 12280.49

-------------------------

Buy Date: 
2004-06-10 00:00:00
Account Value: 12280.49
    Buy Price: 1999.87
    Num Shares: 6.0
    Remaining Value: 281.27
Sell Date: 
2004-07-15 00:00:00
    Sell Price: 1912.71
    Updated Value: 11757.53

-------------------------

Buy Date: 
2004-09-10 00:00:00
Account Value: 11757.53
    Buy Price: 1894.31
    Num Shares: 6.0
    Remaining Value: 391.67
Sell Date: 
2005-01-13 00:00:00
    Sell Price: 2070.56
    Updated Value: 12815.03

-------------------------

Buy Date: 
2005-02-24 00:00:00
Account Value: 12815.03
    Buy Price: 2051.7
    Num Shares: 6.0
    Remaining Value: 504.83
Sell Date: 
2005-03-14 00:00:00
    Sell Price: 2051.04
    Updated Value: 12811.07

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 12811.07
    Buy Price: 2046.42
    Num Shares: 6.0
    Remaining Value: 532.55
Sell Date: 
2005-07-08 00:00:00
    Sell Price: 2112.88
    Updated Value: 13209.83

-------------------------

Buy Date: 
2005-07-11 00:00:00
Account Value: 13209.83
    Buy Price: 2135.43
    Num Shares: 6.0
    Remaining Value: 397.25
Sell Date: 
2005-08-26 00:00:00
    Sell Price: 2120.77
    Updated Value: 13121.87

-------------------------

Buy Date: 
2005-09-23 00:00:00
Account Value: 13121.87
    Buy Price: 2116.84
    Num Shares: 6.0
    Remaining Value: 420.83
Sell Date: 
2005-10-06 00:00:00
    Sell Price: 2084.08
    Updated Value: 12925.31

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 12925.31
    Buy Price: 2196.68
    Num Shares: 5.0
    Remaining Value: 1941.91
Sell Date: 
2006-01-04 00:00:00
    Sell Price: 2263.46
    Updated Value: 13259.21

-------------------------

Buy Date: 
2006-01-19 00:00:00
Account Value: 13259.21
    Buy Price: 2301.81
    Num Shares: 5.0
    Remaining Value: 1750.16
Sell Date: 
2006-02-13 00:00:00
    Sell Price: 2239.81
    Updated Value: 12949.21

-------------------------

Buy Date: 
2006-03-13 00:00:00
Account Value: 12949.21
    Buy Price: 2267.03
    Num Shares: 5.0
    Remaining Value: 1614.06
Sell Date: 
2006-03-31 00:00:00
    Sell Price: 2339.79
    Updated Value: 13313.01

-------------------------

Buy Date: 
2006-04-03 00:00:00
Account Value: 13313.01
    Buy Price: 2336.74
    Num Shares: 5.0
    Remaining Value: 1629.31
Sell Date: 
2006-05-05 00:00:00
    Sell Price: 2342.57
    Updated Value: 13342.16

-------------------------

Buy Date: 
2006-07-18 00:00:00
Account Value: 13342.16
    Buy Price: 2043.22
    Num Shares: 6.0
    Remaining Value: 1082.84
Sell Date: 
2006-07-25 00:00:00
    Sell Price: 2073.9
    Updated Value: 13526.24

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 13526.24
    Buy Price: 2163.95
    Num Shares: 6.0
    Remaining Value: 542.54
Sell Date: 
2006-12-22 00:00:00
    Sell Price: 2401.18
    Updated Value: 14949.62

-------------------------

Buy Date: 
2007-01-09 00:00:00
Account Value: 14949.62
    Buy Price: 2443.83
    Num Shares: 6.0
    Remaining Value: 286.64
Sell Date: 
2007-01-12 00:00:00
    Sell Price: 2502.82
    Updated Value: 15303.56

-------------------------

Buy Date: 
2007-01-16 00:00:00
Account Value: 15303.56
    Buy Price: 2497.78
    Num Shares: 6.0
    Remaining Value: 316.88
Sell Date: 
2007-01-17 00:00:00
    Sell Price: 2479.42
    Updated Value: 15193.4

-------------------------

Buy Date: 
2007-01-24 00:00:00
Account Value: 15193.4
    Buy Price: 2466.28
    Num Shares: 6.0
    Remaining Value: 395.72
Sell Date: 
2007-02-14 00:00:00
    Sell Price: 2488.38
    Updated Value: 15326.0

-------------------------

Buy Date: 
2007-02-21 00:00:00
Account Value: 15326.0
    Buy Price: 2518.42
    Num Shares: 6.0
    Remaining Value: 215.48
Sell Date: 
2007-02-22 00:00:00
    Sell Price: 2524.94
    Updated Value: 15365.12

-------------------------

Buy Date: 
2007-02-23 00:00:00
Account Value: 15365.12
    Buy Price: 2515.1
    Num Shares: 6.0
    Remaining Value: 274.52
Sell Date: 
2007-03-09 00:00:00
    Sell Price: 2387.55
    Updated Value: 14599.82

-------------------------

Buy Date: 
2007-04-09 00:00:00
Account Value: 14599.82
    Buy Price: 2469.18
    Num Shares: 5.0
    Remaining Value: 2253.92
Sell Date: 
2007-08-10 00:00:00
    Sell Price: 2544.89
    Updated Value: 14978.37

-------------------------

Buy Date: 
2007-09-13 00:00:00
Account Value: 14978.37
    Buy Price: 2601.06
    Num Shares: 5.0
    Remaining Value: 1973.07
Sell Date: 
2007-11-13 00:00:00
    Sell Price: 2673.65
    Updated Value: 15341.32

-------------------------

Buy Date: 
2007-12-20 00:00:00
Account Value: 15341.32
    Buy Price: 2640.86
    Num Shares: 5.0
    Remaining Value: 2137.02
Sell Date: 
2008-01-09 00:00:00
    Sell Price: 2474.55
    Updated Value: 14509.77

-------------------------

Buy Date: 
2008-04-09 00:00:00
Account Value: 14509.77
    Buy Price: 2322.12
    Num Shares: 6.0
    Remaining Value: 577.05
Sell Date: 
2008-06-16 00:00:00
    Sell Price: 2474.78
    Updated Value: 15425.73

-------------------------

Buy Date: 
2008-08-07 00:00:00
Account Value: 15425.73
    Buy Price: 2355.73
    Num Shares: 6.0
    Remaining Value: 1291.35
Sell Date: 
2008-09-12 00:00:00
    Sell Price: 2261.27
    Updated Value: 14858.97

-------------------------

Buy Date: 
2008-12-22 00:00:00
Account Value: 14858.97
    Buy Price: 1532.35
    Num Shares: 9.0
    Remaining Value: 1067.82
Sell Date: 
2009-02-03 00:00:00
    Sell Price: 1516.3
    Updated Value: 14714.52

-------------------------

Buy Date: 
2009-02-23 00:00:00
Account Value: 14714.52
    Buy Price: 1387.72
    Num Shares: 10.0
    Remaining Value: 837.32
Sell Date: 
2009-03-04 00:00:00
    Sell Price: 1353.74
    Updated Value: 14374.72

-------------------------

Buy Date: 
2009-03-31 00:00:00
Account Value: 14374.72
    Buy Price: 1528.59
    Num Shares: 9.0
    Remaining Value: 617.41
Sell Date: 
2009-07-09 00:00:00
    Sell Price: 1752.55
    Updated Value: 16390.36

-------------------------

Buy Date: 
2009-07-23 00:00:00
Account Value: 16390.36
    Buy Price: 1973.6
    Num Shares: 8.0
    Remaining Value: 601.56
Sell Date: 
2009-10-22 00:00:00
    Sell Price: 2165.29
    Updated Value: 17923.88

-------------------------

Buy Date: 
2009-10-23 00:00:00
Account Value: 17923.88
    Buy Price: 2154.47
    Num Shares: 8.0
    Remaining Value: 688.12
Sell Date: 
2009-10-26 00:00:00
    Sell Price: 2141.85
    Updated Value: 17822.92

-------------------------

Buy Date: 
2009-10-29 00:00:00
Account Value: 17822.92
    Buy Price: 2097.55
    Num Shares: 8.0
    Remaining Value: 1042.52
Sell Date: 
2009-11-13 00:00:00
    Sell Price: 2167.88
    Updated Value: 18385.56

-------------------------

Buy Date: 
2009-12-01 00:00:00
Account Value: 18385.56
    Buy Price: 2175.81
    Num Shares: 8.0
    Remaining Value: 979.08
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 2190.91
    Updated Value: 18506.36

-------------------------

Buy Date: 
2010-03-05 00:00:00
Account Value: 18506.36
    Buy Price: 2326.35
    Num Shares: 7.0
    Remaining Value: 2221.91
Sell Date: 
2010-05-17 00:00:00
    Sell Price: 2354.23
    Updated Value: 18701.52

-------------------------

Buy Date: 
2010-07-08 00:00:00
Account Value: 18701.52
    Buy Price: 2175.4
    Num Shares: 8.0
    Remaining Value: 1298.32
Sell Date: 
2010-07-14 00:00:00
    Sell Price: 2249.84
    Updated Value: 19297.04

-------------------------

Buy Date: 
2010-08-02 00:00:00
Account Value: 19297.04
    Buy Price: 2295.36
    Num Shares: 8.0
    Remaining Value: 934.16
Sell Date: 
2010-08-27 00:00:00
    Sell Price: 2153.63
    Updated Value: 18163.2

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 18163.2
    Buy Price: 2334.55
    Num Shares: 7.0
    Remaining Value: 1821.35
Sell Date: 
2010-12-08 00:00:00
    Sell Price: 2609.16
    Updated Value: 20085.47

-------------------------

Buy Date: 
2010-12-16 00:00:00
Account Value: 20085.47
    Buy Price: 2637.31
    Num Shares: 7.0
    Remaining Value: 1624.3
Sell Date: 
2011-03-15 00:00:00
    Sell Price: 2667.33
    Updated Value: 20295.61

-------------------------

Buy Date: 
2011-04-14 00:00:00
Account Value: 20295.61
    Buy Price: 2760.22
    Num Shares: 7.0
    Remaining Value: 974.07
Sell Date: 
2011-05-31 00:00:00
    Sell Price: 2835.3
    Updated Value: 20821.17

-------------------------

Buy Date: 
2011-07-14 00:00:00
Account Value: 20821.17
    Buy Price: 2762.67
    Num Shares: 7.0
    Remaining Value: 1482.48
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 2357.69
    Updated Value: 17986.31

-------------------------

Buy Date: 
2011-09-16 00:00:00
Account Value: 17986.31
    Buy Price: 2622.31
    Num Shares: 6.0
    Remaining Value: 2252.45
Sell Date: 
2011-10-13 00:00:00
    Sell Price: 2620.24
    Updated Value: 17973.89

-------------------------

Buy Date: 
2011-10-28 00:00:00
Account Value: 17973.89
    Buy Price: 2737.15
    Num Shares: 6.0
    Remaining Value: 1550.99
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 2527.34
    Updated Value: 16715.03

-------------------------

Buy Date: 
2011-12-23 00:00:00
Account Value: 16715.03
    Buy Price: 2618.64
    Num Shares: 6.0
    Remaining Value: 1003.19
Sell Date: 
2012-01-10 00:00:00
    Sell Price: 2702.5
    Updated Value: 17218.19

-------------------------

Buy Date: 
2012-01-17 00:00:00
Account Value: 17218.19
    Buy Price: 2728.08
    Num Shares: 6.0
    Remaining Value: 849.71
Sell Date: 
2012-04-24 00:00:00
    Sell Price: 2961.6
    Updated Value: 18619.31

-------------------------

Buy Date: 
2012-06-29 00:00:00
Account Value: 18619.31
    Buy Price: 2935.05
    Num Shares: 6.0
    Remaining Value: 1009.01
Sell Date: 
2012-08-07 00:00:00
    Sell Price: 3015.86
    Updated Value: 19104.17

-------------------------

Buy Date: 
2012-08-09 00:00:00
Account Value: 19104.17
    Buy Price: 3018.64
    Num Shares: 6.0
    Remaining Value: 992.33
Sell Date: 
2012-08-10 00:00:00
    Sell Price: 3020.86
    Updated Value: 19117.49

-------------------------

Buy Date: 
2012-08-13 00:00:00
Account Value: 19117.49
    Buy Price: 3022.52
    Num Shares: 6.0
    Remaining Value: 982.37
Sell Date: 
2012-10-16 00:00:00
    Sell Price: 3101.17
    Updated Value: 19589.39

-------------------------

Buy Date: 
2012-12-13 00:00:00
Account Value: 19589.39
    Buy Price: 2992.16
    Num Shares: 6.0
    Remaining Value: 1636.43
Sell Date: 
2013-03-19 00:00:00
    Sell Price: 3229.1
    Updated Value: 21011.03

-------------------------

Buy Date: 
2013-03-20 00:00:00
Account Value: 21011.03
    Buy Price: 3254.19
    Num Shares: 6.0
    Remaining Value: 1485.89
Sell Date: 
2013-04-18 00:00:00
    Sell Price: 3166.36
    Updated Value: 20484.05

-------------------------

Buy Date: 
2013-04-23 00:00:00
Account Value: 20484.05
    Buy Price: 3269.33
    Num Shares: 6.0
    Remaining Value: 868.07
Sell Date: 
2013-04-25 00:00:00
    Sell Price: 3289.99
    Updated Value: 20608.01

-------------------------

Buy Date: 
2013-04-29 00:00:00
Account Value: 20608.01
    Buy Price: 3307.02
    Num Shares: 6.0
    Remaining Value: 765.89
Sell Date: 
2013-04-30 00:00:00
    Sell Price: 3328.79
    Updated Value: 20738.63

-------------------------

Buy Date: 
2013-05-01 00:00:00
Account Value: 20738.63
    Buy Price: 3299.13
    Num Shares: 6.0
    Remaining Value: 943.85
Sell Date: 
2013-06-20 00:00:00
    Sell Price: 3364.64
    Updated Value: 21131.69

-------------------------

Buy Date: 
2013-07-19 00:00:00
Account Value: 21131.69
    Buy Price: 3587.61
    Num Shares: 5.0
    Remaining Value: 3193.64
Sell Date: 
2013-09-05 00:00:00
    Sell Price: 3658.78
    Updated Value: 21487.54

-------------------------

Buy Date: 
2013-09-18 00:00:00
Account Value: 21487.54
    Buy Price: 3783.64
    Num Shares: 5.0
    Remaining Value: 2569.34
Sell Date: 
2014-02-07 00:00:00
    Sell Price: 4125.86
    Updated Value: 23198.64

-------------------------

Buy Date: 
2014-02-11 00:00:00
Account Value: 23198.64
    Buy Price: 4191.05
    Num Shares: 5.0
    Remaining Value: 2243.39
Sell Date: 
2014-02-12 00:00:00
    Sell Price: 4201.29
    Updated Value: 23249.84

-------------------------

Buy Date: 
2014-03-03 00:00:00
Account Value: 23249.84
    Buy Price: 4277.3
    Num Shares: 5.0
    Remaining Value: 1863.34
Sell Date: 
2014-04-02 00:00:00
    Sell Price: 4276.46
    Updated Value: 23245.64

-------------------------

Buy Date: 
2014-05-15 00:00:00
Account Value: 23245.64
    Buy Price: 4069.29
    Num Shares: 5.0
    Remaining Value: 2899.19
Sell Date: 
2014-08-06 00:00:00
    Sell Price: 4355.05
    Updated Value: 24674.44

-------------------------

Buy Date: 
2014-08-14 00:00:00
Account Value: 24674.44
    Buy Price: 4453.0
    Num Shares: 5.0
    Remaining Value: 2409.44
Sell Date: 
2014-08-20 00:00:00
    Sell Price: 4526.48
    Updated Value: 25041.84

-------------------------

Buy Date: 
2014-09-02 00:00:00
Account Value: 25041.84
    Buy Price: 4598.19
    Num Shares: 5.0
    Remaining Value: 2050.89
Sell Date: 
2014-10-01 00:00:00
    Sell Price: 4422.09
    Updated Value: 24161.34

-------------------------

Buy Date: 
2014-11-10 00:00:00
Account Value: 24161.34
    Buy Price: 4651.62
    Num Shares: 5.0
    Remaining Value: 903.24
Sell Date: 
2014-12-31 00:00:00
    Sell Price: 4736.05
    Updated Value: 24583.49

-------------------------

Buy Date: 
2015-01-15 00:00:00
Account Value: 24583.49
    Buy Price: 4570.82
    Num Shares: 5.0
    Remaining Value: 1729.39
Sell Date: 
2015-01-27 00:00:00
    Sell Price: 4681.5
    Updated Value: 25136.89

-------------------------

Buy Date: 
2015-02-12 00:00:00
Account Value: 25136.89
    Buy Price: 4857.61
    Num Shares: 5.0
    Remaining Value: 848.84
Sell Date: 
2015-03-30 00:00:00
    Sell Price: 4947.44
    Updated Value: 25586.04


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 25586.04





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-07 00:00:00
Account Value: 10000
    Buy Price: 2173.57
    Num Shares: 4.0
    Remaining Value: 1305.72
Sell Date: 
2001-06-26 00:00:00
    Sell Price: 2064.62
    Updated Value: 9564.2

-------------------------

Buy Date: 
2001-11-05 00:00:00
Account Value: 9564.2
    Buy Price: 1793.65
    Num Shares: 5.0
    Remaining Value: 595.95
Sell Date: 
2002-02-06 00:00:00
    Sell Price: 1812.71
    Updated Value: 9659.5

-------------------------

Buy Date: 
2002-03-28 00:00:00
Account Value: 9659.5
    Buy Price: 1845.35
    Num Shares: 5.0
    Remaining Value: 432.75
Sell Date: 
2002-04-12 00:00:00
    Sell Price: 1756.19
    Updated Value: 9213.7

-------------------------

Buy Date: 
2002-09-10 00:00:00
Account Value: 9213.7
    Buy Price: 1320.09
    Num Shares: 6.0
    Remaining Value: 1293.16
Sell Date: 
2002-09-20 00:00:00
    Sell Price: 1221.09
    Updated Value: 8619.7

-------------------------

Buy Date: 
2002-11-05 00:00:00
Account Value: 8619.7
    Buy Price: 1401.17
    Num Shares: 6.0
    Remaining Value: 212.68
Sell Date: 
2003-01-03 00:00:00
    Sell Price: 1387.08
    Updated Value: 8535.16

-------------------------

Buy Date: 
2003-03-28 00:00:00
Account Value: 8535.16
    Buy Price: 1369.6
    Num Shares: 6.0
    Remaining Value: 317.56
Sell Date: 
2004-03-02 00:00:00
    Sell Price: 2039.65
    Updated Value: 12555.46

-------------------------

Buy Date: 
2004-04-22 00:00:00
Account Value: 12555.46
    Buy Price: 2032.91
    Num Shares: 6.0
    Remaining Value: 358.0
Sell Date: 
2004-05-10 00:00:00
    Sell Price: 1896.07
    Updated Value: 11734.42

-------------------------

Buy Date: 
2004-06-22 00:00:00
Account Value: 11734.42
    Buy Price: 1994.15
    Num Shares: 5.0
    Remaining Value: 1763.67
Sell Date: 
2004-07-26 00:00:00
    Sell Price: 1839.02
    Updated Value: 10958.77

-------------------------

Buy Date: 
2004-09-20 00:00:00
Account Value: 10958.77
    Buy Price: 1908.07
    Num Shares: 5.0
    Remaining Value: 1418.42
Sell Date: 
2005-01-25 00:00:00
    Sell Price: 2019.95
    Updated Value: 11518.17

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 11518.17
    Buy Price: 2071.24
    Num Shares: 5.0
    Remaining Value: 1161.97
Sell Date: 
2005-09-09 00:00:00
    Sell Price: 2175.51
    Updated Value: 12039.52

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 12039.52
    Buy Price: 2187.93
    Num Shares: 5.0
    Remaining Value: 1099.87
Sell Date: 
2006-03-06 00:00:00
    Sell Price: 2286.03
    Updated Value: 12530.02

-------------------------

Buy Date: 
2006-03-08 00:00:00
Account Value: 12530.02
    Buy Price: 2267.46
    Num Shares: 5.0
    Remaining Value: 1192.72
Sell Date: 
2006-03-13 00:00:00
    Sell Price: 2267.03
    Updated Value: 12527.87

-------------------------

Buy Date: 
2006-03-14 00:00:00
Account Value: 12527.87
    Buy Price: 2295.9
    Num Shares: 5.0
    Remaining Value: 1048.37
Sell Date: 
2006-03-17 00:00:00
    Sell Price: 2306.48
    Updated Value: 12580.77

-------------------------

Buy Date: 
2006-03-20 00:00:00
Account Value: 12580.77
    Buy Price: 2314.11
    Num Shares: 5.0
    Remaining Value: 1010.22
Sell Date: 
2006-05-18 00:00:00
    Sell Price: 2180.32
    Updated Value: 11911.82

-------------------------

Buy Date: 
2006-08-30 00:00:00
Account Value: 11911.82
    Buy Price: 2185.73
    Num Shares: 5.0
    Remaining Value: 983.17
Sell Date: 
2007-03-14 00:00:00
    Sell Price: 2371.74
    Updated Value: 12841.87

-------------------------

Buy Date: 
2007-04-17 00:00:00
Account Value: 12841.87
    Buy Price: 2516.95
    Num Shares: 5.0
    Remaining Value: 257.12
Sell Date: 
2007-08-14 00:00:00
    Sell Price: 2499.12
    Updated Value: 12752.72

-------------------------

Buy Date: 
2007-09-25 00:00:00
Account Value: 12752.72
    Buy Price: 2683.45
    Num Shares: 4.0
    Remaining Value: 2018.92
Sell Date: 
2007-11-26 00:00:00
    Sell Price: 2540.99
    Updated Value: 12182.88

-------------------------

Buy Date: 
2008-04-15 00:00:00
Account Value: 12182.88
    Buy Price: 2286.04
    Num Shares: 5.0
    Remaining Value: 752.68
Sell Date: 
2008-06-27 00:00:00
    Sell Price: 2315.63
    Updated Value: 12330.83

-------------------------

Buy Date: 
2008-08-20 00:00:00
Account Value: 12330.83
    Buy Price: 2389.08
    Num Shares: 5.0
    Remaining Value: 385.43
Sell Date: 
2008-09-18 00:00:00
    Sell Price: 2199.1
    Updated Value: 11380.93

-------------------------

Buy Date: 
2009-01-12 00:00:00
Account Value: 11380.93
    Buy Price: 1538.79
    Num Shares: 7.0
    Remaining Value: 609.4
Sell Date: 
2009-02-05 00:00:00
    Sell Price: 1546.24
    Updated Value: 11433.08

-------------------------

Buy Date: 
2009-04-06 00:00:00
Account Value: 11433.08
    Buy Price: 1606.71
    Num Shares: 7.0
    Remaining Value: 186.11
Sell Date: 
2009-11-19 00:00:00
    Sell Price: 2156.82
    Updated Value: 15283.85

-------------------------

Buy Date: 
2009-11-30 00:00:00
Account Value: 15283.85
    Buy Price: 2144.6
    Num Shares: 7.0
    Remaining Value: 271.65
Sell Date: 
2010-02-11 00:00:00
    Sell Price: 2177.41
    Updated Value: 15513.52

-------------------------

Buy Date: 
2010-03-12 00:00:00
Account Value: 15513.52
    Buy Price: 2367.66
    Num Shares: 6.0
    Remaining Value: 1307.56
Sell Date: 
2010-05-21 00:00:00
    Sell Price: 2229.04
    Updated Value: 14681.8

-------------------------

Buy Date: 
2010-08-04 00:00:00
Account Value: 14681.8
    Buy Price: 2303.57
    Num Shares: 6.0
    Remaining Value: 860.38
Sell Date: 
2010-09-02 00:00:00
    Sell Price: 2200.01
    Updated Value: 14060.44

-------------------------

Buy Date: 
2010-09-27 00:00:00
Account Value: 14060.44
    Buy Price: 2369.77
    Num Shares: 5.0
    Remaining Value: 2211.59
Sell Date: 
2011-03-21 00:00:00
    Sell Price: 2692.09
    Updated Value: 15672.04

-------------------------

Buy Date: 
2011-04-19 00:00:00
Account Value: 15672.04
    Buy Price: 2744.97
    Num Shares: 5.0
    Remaining Value: 1947.19
Sell Date: 
2011-06-08 00:00:00
    Sell Price: 2675.38
    Updated Value: 15324.09

-------------------------

Buy Date: 
2011-07-20 00:00:00
Account Value: 15324.09
    Buy Price: 2814.23
    Num Shares: 5.0
    Remaining Value: 1252.94
Sell Date: 
2011-08-16 00:00:00
    Sell Price: 2523.45
    Updated Value: 13870.19

-------------------------

Buy Date: 
2011-10-07 00:00:00
Account Value: 13870.19
    Buy Price: 2479.35
    Num Shares: 5.0
    Remaining Value: 1473.44
Sell Date: 
2011-12-12 00:00:00
    Sell Price: 2612.26
    Updated Value: 14534.74

-------------------------

Buy Date: 
2012-01-17 00:00:00
Account Value: 14534.74
    Buy Price: 2728.08
    Num Shares: 5.0
    Remaining Value: 894.34
Sell Date: 
2012-05-04 00:00:00
    Sell Price: 2956.34
    Updated Value: 15676.04

-------------------------

Buy Date: 
2012-07-11 00:00:00
Account Value: 15676.04
    Buy Price: 2887.98
    Num Shares: 5.0
    Remaining Value: 1236.14
Sell Date: 
2012-10-23 00:00:00
    Sell Price: 2990.46
    Updated Value: 16188.44

-------------------------

Buy Date: 
2012-12-20 00:00:00
Account Value: 16188.44
    Buy Price: 3050.39
    Num Shares: 5.0
    Remaining Value: 936.49
Sell Date: 
2013-07-09 00:00:00
    Sell Price: 3504.26
    Updated Value: 18457.79

-------------------------

Buy Date: 
2013-07-22 00:00:00
Account Value: 18457.79
    Buy Price: 3600.39
    Num Shares: 5.0
    Remaining Value: 455.84
Sell Date: 
2014-02-21 00:00:00
    Sell Price: 4263.41
    Updated Value: 21772.89

-------------------------

Buy Date: 
2014-02-24 00:00:00
Account Value: 21772.89
    Buy Price: 4292.97
    Num Shares: 5.0
    Remaining Value: 308.04
Sell Date: 
2014-04-14 00:00:00
    Sell Price: 4022.69
    Updated Value: 20421.49

-------------------------

Buy Date: 
2014-06-05 00:00:00
Account Value: 20421.49
    Buy Price: 4296.23
    Num Shares: 4.0
    Remaining Value: 3236.57
Sell Date: 
2014-10-14 00:00:00
    Sell Price: 4227.17
    Updated Value: 20145.25

-------------------------

Buy Date: 
2014-11-13 00:00:00
Account Value: 20145.25
    Buy Price: 4680.14
    Num Shares: 4.0
    Remaining Value: 1424.69
Sell Date: 
2015-01-23 00:00:00
    Sell Price: 4757.88
    Updated Value: 20456.21

-------------------------

Buy Date: 
2015-02-17 00:00:00
Account Value: 20456.21
    Buy Price: 4899.27
    Num Shares: 4.0
    Remaining Value: 859.13
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20843.05


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20843.05





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-23 00:00:00
Account Value: 10000
    Buy Price: 2243.48
    Num Shares: 4.0
    Remaining Value: 1026.08
Sell Date: 
2001-07-20 00:00:00
    Sell Price: 2029.37
    Updated Value: 9143.56

-------------------------

Buy Date: 
2001-11-20 00:00:00
Account Value: 9143.56
    Buy Price: 1880.51
    Num Shares: 4.0
    Remaining Value: 1621.52
Sell Date: 
2002-02-13 00:00:00
    Sell Price: 1859.16
    Updated Value: 9058.16

-------------------------

Buy Date: 
2002-11-07 00:00:00
Account Value: 9058.16
    Buy Price: 1376.71
    Num Shares: 6.0
    Remaining Value: 797.9
Sell Date: 
2003-02-07 00:00:00
    Sell Price: 1282.47
    Updated Value: 8492.72

-------------------------

Buy Date: 
2003-04-07 00:00:00
Account Value: 8492.72
    Buy Price: 1389.51
    Num Shares: 6.0
    Remaining Value: 155.66
Sell Date: 
2004-03-17 00:00:00
    Sell Price: 1976.76
    Updated Value: 12016.22

-------------------------

Buy Date: 
2004-06-22 00:00:00
Account Value: 12016.22
    Buy Price: 1994.15
    Num Shares: 6.0
    Remaining Value: 51.32
Sell Date: 
2004-07-19 00:00:00
    Sell Price: 1883.83
    Updated Value: 11354.3

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 11354.3
    Buy Price: 1971.03
    Num Shares: 5.0
    Remaining Value: 1499.15
Sell Date: 
2005-02-04 00:00:00
    Sell Price: 2086.66
    Updated Value: 11932.45

-------------------------

Buy Date: 
2005-06-03 00:00:00
Account Value: 11932.45
    Buy Price: 2071.43
    Num Shares: 5.0
    Remaining Value: 1575.3
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 2078.92
    Updated Value: 11969.9

-------------------------

Buy Date: 
2005-11-18 00:00:00
Account Value: 11969.9
    Buy Price: 2227.07
    Num Shares: 5.0
    Remaining Value: 834.55
Sell Date: 
2006-05-23 00:00:00
    Sell Price: 2158.76
    Updated Value: 11628.35

-------------------------

Buy Date: 
2006-09-06 00:00:00
Account Value: 11628.35
    Buy Price: 2167.84
    Num Shares: 5.0
    Remaining Value: 789.15
Sell Date: 
2007-03-16 00:00:00
    Sell Price: 2372.66
    Updated Value: 12652.45

-------------------------

Buy Date: 
2007-04-17 00:00:00
Account Value: 12652.45
    Buy Price: 2516.95
    Num Shares: 5.0
    Remaining Value: 67.7
Sell Date: 
2007-08-16 00:00:00
    Sell Price: 2451.07
    Updated Value: 12323.05

-------------------------

Buy Date: 
2007-09-26 00:00:00
Account Value: 12323.05
    Buy Price: 2699.03
    Num Shares: 4.0
    Remaining Value: 1526.93
Sell Date: 
2007-12-04 00:00:00
    Sell Price: 2619.83
    Updated Value: 12006.25

-------------------------

Buy Date: 
2008-04-24 00:00:00
Account Value: 12006.25
    Buy Price: 2428.92
    Num Shares: 4.0
    Remaining Value: 2290.57
Sell Date: 
2008-07-07 00:00:00
    Sell Price: 2243.32
    Updated Value: 11263.85

-------------------------

Buy Date: 
2008-09-02 00:00:00
Account Value: 11263.85
    Buy Price: 2349.24
    Num Shares: 4.0
    Remaining Value: 1866.89
Sell Date: 
2008-09-10 00:00:00
    Sell Price: 2228.7
    Updated Value: 10781.69

-------------------------

Buy Date: 
2009-04-08 00:00:00
Account Value: 10781.69
    Buy Price: 1590.66
    Num Shares: 6.0
    Remaining Value: 1237.73
Sell Date: 
2010-02-18 00:00:00
    Sell Price: 2241.71
    Updated Value: 14687.99

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 14687.99
    Buy Price: 2340.68
    Num Shares: 6.0
    Remaining Value: 643.91
Sell Date: 
2010-05-28 00:00:00
    Sell Price: 2257.04
    Updated Value: 14186.15

-------------------------

Buy Date: 
2010-08-18 00:00:00
Account Value: 14186.15
    Buy Price: 2215.7
    Num Shares: 6.0
    Remaining Value: 891.95
Sell Date: 
2010-08-24 00:00:00
    Sell Price: 2123.76
    Updated Value: 13634.51

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 13634.51
    Buy Price: 2381.22
    Num Shares: 5.0
    Remaining Value: 1728.41
Sell Date: 
2011-03-31 00:00:00
    Sell Price: 2781.07
    Updated Value: 15633.76

-------------------------

Buy Date: 
2011-04-14 00:00:00
Account Value: 15633.76
    Buy Price: 2760.22
    Num Shares: 5.0
    Remaining Value: 1832.66
Sell Date: 
2011-06-14 00:00:00
    Sell Price: 2678.72
    Updated Value: 15226.26

-------------------------

Buy Date: 
2011-07-22 00:00:00
Account Value: 15226.26
    Buy Price: 2858.83
    Num Shares: 5.0
    Remaining Value: 932.11
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 2532.41
    Updated Value: 13594.16

-------------------------

Buy Date: 
2011-11-01 00:00:00
Account Value: 13594.16
    Buy Price: 2606.96
    Num Shares: 5.0
    Remaining Value: 559.36
Sell Date: 
2011-12-15 00:00:00
    Sell Price: 2541.01
    Updated Value: 13264.41

-------------------------

Buy Date: 
2011-12-22 00:00:00
Account Value: 13264.41
    Buy Price: 2599.45
    Num Shares: 5.0
    Remaining Value: 267.16
Sell Date: 
2012-05-18 00:00:00
    Sell Price: 2778.79
    Updated Value: 14161.11

-------------------------

Buy Date: 
2012-07-27 00:00:00
Account Value: 14161.11
    Buy Price: 2958.09
    Num Shares: 4.0
    Remaining Value: 2328.75
Sell Date: 
2012-08-01 00:00:00
    Sell Price: 2920.21
    Updated Value: 14009.59

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 14009.59
    Buy Price: 2989.91
    Num Shares: 4.0
    Remaining Value: 2049.95
Sell Date: 
2012-11-07 00:00:00
    Sell Price: 2937.29
    Updated Value: 13799.11

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 13799.11
    Buy Price: 3121.76
    Num Shares: 4.0
    Remaining Value: 1312.07
Sell Date: 
2014-04-16 00:00:00
    Sell Price: 4086.23
    Updated Value: 17656.99

-------------------------

Buy Date: 
2014-06-13 00:00:00
Account Value: 17656.99
    Buy Price: 4310.65
    Num Shares: 4.0
    Remaining Value: 414.39
Sell Date: 
2014-10-16 00:00:00
    Sell Price: 4217.39
    Updated Value: 17283.95

-------------------------

Buy Date: 
2014-11-12 00:00:00
Account Value: 17283.95
    Buy Price: 4675.14
    Num Shares: 3.0
    Remaining Value: 3258.53
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 18246.47


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 18246.47





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-12-07 00:00:00
Account Value: 10000
    Buy Price: 2021.26
    Num Shares: 4.0
    Remaining Value: 1914.96
Sell Date: 
2002-04-08 00:00:00
    Sell Price: 1785.87
    Updated Value: 9058.44

-------------------------

Buy Date: 
2002-11-22 00:00:00
Account Value: 9058.44
    Buy Price: 1468.74
    Num Shares: 6.0
    Remaining Value: 246.0
Sell Date: 
2003-02-21 00:00:00
    Sell Price: 1349.02
    Updated Value: 8340.12

-------------------------

Buy Date: 
2003-03-17 00:00:00
Account Value: 8340.12
    Buy Price: 1392.27
    Num Shares: 5.0
    Remaining Value: 1378.77
Sell Date: 
2003-03-21 00:00:00
    Sell Price: 1421.84
    Updated Value: 8487.97

-------------------------

Buy Date: 
2003-03-26 00:00:00
Account Value: 8487.97
    Buy Price: 1387.45
    Num Shares: 6.0
    Remaining Value: 163.27
Sell Date: 
2004-04-01 00:00:00
    Sell Price: 2015.01
    Updated Value: 12253.33

-------------------------

Buy Date: 
2004-04-19 00:00:00
Account Value: 12253.33
    Buy Price: 2020.43
    Num Shares: 6.0
    Remaining Value: 130.75
Sell Date: 
2004-05-10 00:00:00
    Sell Price: 1896.07
    Updated Value: 11507.17

-------------------------

Buy Date: 
2004-10-25 00:00:00
Account Value: 11507.17
    Buy Price: 1914.04
    Num Shares: 6.0
    Remaining Value: 22.93
Sell Date: 
2005-03-30 00:00:00
    Sell Price: 2005.67
    Updated Value: 12056.95

-------------------------

Buy Date: 
2005-06-14 00:00:00
Account Value: 12056.95
    Buy Price: 2069.04
    Num Shares: 5.0
    Remaining Value: 1711.75
Sell Date: 
2005-10-27 00:00:00
    Sell Price: 2063.81
    Updated Value: 12030.8

-------------------------

Buy Date: 
2005-11-14 00:00:00
Account Value: 12030.8
    Buy Price: 2200.95
    Num Shares: 5.0
    Remaining Value: 1026.05
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 2198.24
    Updated Value: 12017.25

-------------------------

Buy Date: 
2006-09-27 00:00:00
Account Value: 12017.25
    Buy Price: 2263.39
    Num Shares: 5.0
    Remaining Value: 700.3
Sell Date: 
2007-03-26 00:00:00
    Sell Price: 2455.63
    Updated Value: 12978.45

-------------------------

Buy Date: 
2007-04-09 00:00:00
Account Value: 12978.45
    Buy Price: 2469.18
    Num Shares: 5.0
    Remaining Value: 632.55
Sell Date: 
2007-09-06 00:00:00
    Sell Price: 2614.32
    Updated Value: 13704.15

-------------------------

Buy Date: 
2007-09-13 00:00:00
Account Value: 13704.15
    Buy Price: 2601.06
    Num Shares: 5.0
    Remaining Value: 698.85
Sell Date: 
2007-12-05 00:00:00
    Sell Price: 2666.36
    Updated Value: 14030.65

-------------------------

Buy Date: 
2007-12-24 00:00:00
Account Value: 14030.65
    Buy Price: 2713.5
    Num Shares: 5.0
    Remaining Value: 463.15
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 2440.51
    Updated Value: 12665.7

-------------------------

Buy Date: 
2008-05-20 00:00:00
Account Value: 12665.7
    Buy Price: 2492.26
    Num Shares: 5.0
    Remaining Value: 204.4
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 2215.71
    Updated Value: 11282.95

-------------------------

Buy Date: 
2008-08-22 00:00:00
Account Value: 11282.95
    Buy Price: 2414.71
    Num Shares: 4.0
    Remaining Value: 1624.11
Sell Date: 
2008-09-11 00:00:00
    Sell Price: 2258.22
    Updated Value: 10656.99

-------------------------

Buy Date: 
2009-04-15 00:00:00
Account Value: 10656.99
    Buy Price: 1626.8
    Num Shares: 6.0
    Remaining Value: 896.19
Sell Date: 
2010-06-08 00:00:00
    Sell Price: 2170.57
    Updated Value: 13919.61

-------------------------

Buy Date: 
2010-10-05 00:00:00
Account Value: 13919.61
    Buy Price: 2399.83
    Num Shares: 5.0
    Remaining Value: 1920.46
Sell Date: 
2011-06-17 00:00:00
    Sell Price: 2616.48
    Updated Value: 15002.86

-------------------------

Buy Date: 
2011-07-20 00:00:00
Account Value: 15002.86
    Buy Price: 2814.23
    Num Shares: 5.0
    Remaining Value: 931.71
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 2357.69
    Updated Value: 12720.16

-------------------------

Buy Date: 
2011-11-10 00:00:00
Account Value: 12720.16
    Buy Price: 2625.15
    Num Shares: 4.0
    Remaining Value: 2219.56
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 2527.34
    Updated Value: 12328.92

-------------------------

Buy Date: 
2012-01-09 00:00:00
Account Value: 12328.92
    Buy Price: 2676.56
    Num Shares: 4.0
    Remaining Value: 1622.68
Sell Date: 
2012-06-08 00:00:00
    Sell Price: 2858.42
    Updated Value: 13056.36

-------------------------

Buy Date: 
2012-08-21 00:00:00
Account Value: 13056.36
    Buy Price: 3067.26
    Num Shares: 4.0
    Remaining Value: 787.32
Sell Date: 
2012-11-20 00:00:00
    Sell Price: 2916.68
    Updated Value: 12454.04

-------------------------

Buy Date: 
2013-01-04 00:00:00
Account Value: 12454.04
    Buy Price: 3101.66
    Num Shares: 4.0
    Remaining Value: 47.4
Sell Date: 
2014-05-02 00:00:00
    Sell Price: 4123.9
    Updated Value: 16543.0

-------------------------

Buy Date: 
2014-06-09 00:00:00
Account Value: 16543.0
    Buy Price: 4336.24
    Num Shares: 3.0
    Remaining Value: 3534.28
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 18522.22


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 18522.22





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-22 00:00:00
Account Value: 10000
    Buy Price: 2313.85
    Num Shares: 4.0
    Remaining Value: 744.6
Sell Date: 
2001-06-25 00:00:00
    Sell Price: 2050.87
    Updated Value: 8948.08

-------------------------

Buy Date: 
2001-12-20 00:00:00
Account Value: 8948.08
    Buy Price: 1918.54
    Num Shares: 4.0
    Remaining Value: 1273.92
Sell Date: 
2002-02-05 00:00:00
    Sell Price: 1838.52
    Updated Value: 8628.0

-------------------------

Buy Date: 
2003-04-01 00:00:00
Account Value: 8628.0
    Buy Price: 1348.3
    Num Shares: 6.0
    Remaining Value: 538.2
Sell Date: 
2004-05-25 00:00:00
    Sell Price: 1964.65
    Updated Value: 12326.1

-------------------------

Buy Date: 
2004-06-17 00:00:00
Account Value: 12326.1
    Buy Price: 1983.67
    Num Shares: 6.0
    Remaining Value: 424.08
Sell Date: 
2004-07-21 00:00:00
    Sell Price: 1874.37
    Updated Value: 11670.3

-------------------------

Buy Date: 
2004-11-12 00:00:00
Account Value: 11670.3
    Buy Price: 2085.34
    Num Shares: 5.0
    Remaining Value: 1243.6
Sell Date: 
2005-04-28 00:00:00
    Sell Price: 1904.18
    Updated Value: 10764.5

-------------------------

Buy Date: 
2005-05-31 00:00:00
Account Value: 10764.5
    Buy Price: 2068.22
    Num Shares: 5.0
    Remaining Value: 423.4
Sell Date: 
2006-06-07 00:00:00
    Sell Price: 2151.8
    Updated Value: 11182.4

-------------------------

Buy Date: 
2006-10-06 00:00:00
Account Value: 11182.4
    Buy Price: 2299.99
    Num Shares: 4.0
    Remaining Value: 1982.44
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 2417.59
    Updated Value: 11652.8

-------------------------

Buy Date: 
2009-06-05 00:00:00
Account Value: 11652.8
    Buy Price: 1849.42
    Num Shares: 6.0
    Remaining Value: 556.28
Sell Date: 
2010-07-01 00:00:00
    Sell Price: 2101.36
    Updated Value: 13164.44

-------------------------

Buy Date: 
2010-08-18 00:00:00
Account Value: 13164.44
    Buy Price: 2215.7
    Num Shares: 5.0
    Remaining Value: 2085.94
Sell Date: 
2010-08-19 00:00:00
    Sell Price: 2178.95
    Updated Value: 12980.69

-------------------------

Buy Date: 
2010-09-30 00:00:00
Account Value: 12980.69
    Buy Price: 2368.62
    Num Shares: 5.0
    Remaining Value: 1137.59
Sell Date: 
2011-08-16 00:00:00
    Sell Price: 2523.45
    Updated Value: 13754.84

-------------------------

Buy Date: 
2012-01-25 00:00:00
Account Value: 13754.84
    Buy Price: 2818.31
    Num Shares: 4.0
    Remaining Value: 2481.6
Sell Date: 
2012-11-16 00:00:00
    Sell Price: 2853.13
    Updated Value: 13894.12

-------------------------

Buy Date: 
2012-12-19 00:00:00
Account Value: 13894.12
    Buy Price: 3044.36
    Num Shares: 4.0
    Remaining Value: 1716.68
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21700.6


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21700.6





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-14 00:00:00
Account Value: 10000
    Buy Price: 2081.92
    Num Shares: 4.0
    Remaining Value: 1672.32
Sell Date: 
2001-07-06 00:00:00
    Sell Price: 2004.16
    Updated Value: 9688.96

-------------------------

Buy Date: 
2003-04-29 00:00:00
Account Value: 9688.96
    Buy Price: 1471.3
    Num Shares: 6.0
    Remaining Value: 861.16
Sell Date: 
2004-07-29 00:00:00
    Sell Price: 1881.06
    Updated Value: 12147.52

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 12147.52
    Buy Price: 2094.09
    Num Shares: 5.0
    Remaining Value: 1677.07
Sell Date: 
2005-04-28 00:00:00
    Sell Price: 1904.18
    Updated Value: 11197.97

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 11197.97
    Buy Price: 2071.24
    Num Shares: 5.0
    Remaining Value: 841.77
Sell Date: 
2006-06-12 00:00:00
    Sell Price: 2091.32
    Updated Value: 11298.37

-------------------------

Buy Date: 
2006-10-02 00:00:00
Account Value: 11298.37
    Buy Price: 2237.6
    Num Shares: 5.0
    Remaining Value: 110.37
Sell Date: 
2008-01-23 00:00:00
    Sell Price: 2316.41
    Updated Value: 11692.42

-------------------------

Buy Date: 
2009-07-20 00:00:00
Account Value: 11692.42
    Buy Price: 1909.29
    Num Shares: 6.0
    Remaining Value: 236.68
Sell Date: 
2010-07-21 00:00:00
    Sell Price: 2187.33
    Updated Value: 13360.66

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 13360.66
    Buy Price: 2254.7
    Num Shares: 5.0
    Remaining Value: 2087.16
Sell Date: 
2010-08-31 00:00:00
    Sell Price: 2114.03
    Updated Value: 12657.31

-------------------------

Buy Date: 
2010-09-27 00:00:00
Account Value: 12657.31
    Buy Price: 2369.77
    Num Shares: 5.0
    Remaining Value: 808.46
Sell Date: 
2011-08-23 00:00:00
    Sell Price: 2446.06
    Updated Value: 13038.76

-------------------------

Buy Date: 
2012-01-27 00:00:00
Account Value: 13038.76
    Buy Price: 2816.55
    Num Shares: 4.0
    Remaining Value: 1772.56
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21756.48


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21756.48





-----------------------------------------------------------------------
^IXIC Calculations, N = [20, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 2128.86
    Num Shares: 4.0
    Remaining Value: 1484.56
Sell Date: 
2001-07-11 00:00:00
    Sell Price: 1972.04
    Updated Value: 9372.72

-------------------------

Buy Date: 
2001-07-19 00:00:00
Account Value: 9372.72
    Buy Price: 2046.59
    Num Shares: 4.0
    Remaining Value: 1186.36
Sell Date: 
2001-07-24 00:00:00
    Sell Price: 1959.24
    Updated Value: 9023.32

-------------------------

Buy Date: 
2003-05-15 00:00:00
Account Value: 9023.32
    Buy Price: 1551.38
    Num Shares: 5.0
    Remaining Value: 1266.42
Sell Date: 
2004-08-10 00:00:00
    Sell Price: 1808.7
    Updated Value: 10309.92

-------------------------

Buy Date: 
2004-11-09 00:00:00
Account Value: 10309.92
    Buy Price: 2043.33
    Num Shares: 5.0
    Remaining Value: 93.27
Sell Date: 
2005-04-20 00:00:00
    Sell Price: 1913.76
    Updated Value: 9662.07

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 9662.07
    Buy Price: 2071.24
    Num Shares: 4.0
    Remaining Value: 1377.11
Sell Date: 
2006-06-23 00:00:00
    Sell Price: 2121.47
    Updated Value: 9862.99

-------------------------

Buy Date: 
2006-09-26 00:00:00
Account Value: 9862.99
    Buy Price: 2261.34
    Num Shares: 4.0
    Remaining Value: 817.63
Sell Date: 
2008-01-24 00:00:00
    Sell Price: 2360.92
    Updated Value: 10261.31

-------------------------

Buy Date: 
2009-08-06 00:00:00
Account Value: 10261.31
    Buy Price: 1973.16
    Num Shares: 5.0
    Remaining Value: 395.51
Sell Date: 
2011-08-26 00:00:00
    Sell Price: 2479.85
    Updated Value: 12794.76

-------------------------

Buy Date: 
2011-11-02 00:00:00
Account Value: 12794.76
    Buy Price: 2639.98
    Num Shares: 4.0
    Remaining Value: 2234.84
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 2527.34
    Updated Value: 12344.2

-------------------------

Buy Date: 
2012-01-25 00:00:00
Account Value: 12344.2
    Buy Price: 2818.31
    Num Shares: 4.0
    Remaining Value: 1070.96
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21054.88


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21054.88





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-16 00:00:00
Account Value: 10000
    Buy Price: 2166.44
    Num Shares: 4.0
    Remaining Value: 1334.24
Sell Date: 
2001-07-05 00:00:00
    Sell Price: 2080.11
    Updated Value: 9654.68

-------------------------

Buy Date: 
2001-11-12 00:00:00
Account Value: 9654.68
    Buy Price: 1840.13
    Num Shares: 5.0
    Remaining Value: 454.03
Sell Date: 
2002-02-11 00:00:00
    Sell Price: 1846.66
    Updated Value: 9687.33

-------------------------

Buy Date: 
2002-04-10 00:00:00
Account Value: 9687.33
    Buy Price: 1767.07
    Num Shares: 5.0
    Remaining Value: 851.98
Sell Date: 
2002-04-26 00:00:00
    Sell Price: 1663.89
    Updated Value: 9171.43

-------------------------

Buy Date: 
2002-09-17 00:00:00
Account Value: 9171.43
    Buy Price: 1259.94
    Num Shares: 7.0
    Remaining Value: 351.85
Sell Date: 
2002-10-03 00:00:00
    Sell Price: 1165.56
    Updated Value: 8510.77

-------------------------

Buy Date: 
2002-11-13 00:00:00
Account Value: 8510.77
    Buy Price: 1361.33
    Num Shares: 6.0
    Remaining Value: 342.79
Sell Date: 
2003-01-14 00:00:00
    Sell Price: 1460.99
    Updated Value: 9108.73

-------------------------

Buy Date: 
2003-02-18 00:00:00
Account Value: 9108.73
    Buy Price: 1346.54
    Num Shares: 6.0
    Remaining Value: 1029.49
Sell Date: 
2003-02-19 00:00:00
    Sell Price: 1334.32
    Updated Value: 9035.41

-------------------------

Buy Date: 
2003-03-28 00:00:00
Account Value: 9035.41
    Buy Price: 1369.6
    Num Shares: 6.0
    Remaining Value: 817.81
Sell Date: 
2004-03-08 00:00:00
    Sell Price: 2008.78
    Updated Value: 12870.49

-------------------------

Buy Date: 
2004-05-04 00:00:00
Account Value: 12870.49
    Buy Price: 1950.48
    Num Shares: 6.0
    Remaining Value: 1167.61
Sell Date: 
2004-05-24 00:00:00
    Sell Price: 1922.98
    Updated Value: 12705.49

-------------------------

Buy Date: 
2004-06-30 00:00:00
Account Value: 12705.49
    Buy Price: 2047.79
    Num Shares: 6.0
    Remaining Value: 418.75
Sell Date: 
2004-07-30 00:00:00
    Sell Price: 1887.36
    Updated Value: 11742.91

-------------------------

Buy Date: 
2004-09-27 00:00:00
Account Value: 11742.91
    Buy Price: 1859.88
    Num Shares: 6.0
    Remaining Value: 583.63
Sell Date: 
2005-01-31 00:00:00
    Sell Price: 2062.41
    Updated Value: 12958.09

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 12958.09
    Buy Price: 2075.76
    Num Shares: 6.0
    Remaining Value: 503.53
Sell Date: 
2005-09-15 00:00:00
    Sell Price: 2146.15
    Updated Value: 13380.43

-------------------------

Buy Date: 
2005-11-23 00:00:00
Account Value: 13380.43
    Buy Price: 2259.98
    Num Shares: 5.0
    Remaining Value: 2080.53
Sell Date: 
2006-03-13 00:00:00
    Sell Price: 2267.03
    Updated Value: 13415.68

-------------------------

Buy Date: 
2006-03-27 00:00:00
Account Value: 13415.68
    Buy Price: 2315.58
    Num Shares: 5.0
    Remaining Value: 1837.78
Sell Date: 
2006-05-22 00:00:00
    Sell Price: 2172.86
    Updated Value: 12702.08

-------------------------

Buy Date: 
2006-09-06 00:00:00
Account Value: 12702.08
    Buy Price: 2167.84
    Num Shares: 5.0
    Remaining Value: 1862.88
Sell Date: 
2007-01-31 00:00:00
    Sell Price: 2463.93
    Updated Value: 14182.53

-------------------------

Buy Date: 
2007-02-02 00:00:00
Account Value: 14182.53
    Buy Price: 2475.88
    Num Shares: 5.0
    Remaining Value: 1803.13
Sell Date: 
2007-03-16 00:00:00
    Sell Price: 2372.66
    Updated Value: 13666.43

-------------------------

Buy Date: 
2007-04-26 00:00:00
Account Value: 13666.43
    Buy Price: 2554.46
    Num Shares: 5.0
    Remaining Value: 894.13
Sell Date: 
2007-08-23 00:00:00
    Sell Price: 2541.7
    Updated Value: 13602.63

-------------------------

Buy Date: 
2007-09-28 00:00:00
Account Value: 13602.63
    Buy Price: 2701.5
    Num Shares: 5.0
    Remaining Value: 95.13
Sell Date: 
2007-11-29 00:00:00
    Sell Price: 2668.13
    Updated Value: 13435.78

-------------------------

Buy Date: 
2008-04-24 00:00:00
Account Value: 13435.78
    Buy Price: 2428.92
    Num Shares: 5.0
    Remaining Value: 1291.18
Sell Date: 
2008-07-02 00:00:00
    Sell Price: 2251.46
    Updated Value: 12548.48

-------------------------

Buy Date: 
2008-08-26 00:00:00
Account Value: 12548.48
    Buy Price: 2361.97
    Num Shares: 5.0
    Remaining Value: 738.63
Sell Date: 
2008-09-26 00:00:00
    Sell Price: 2183.34
    Updated Value: 11655.33

-------------------------

Buy Date: 
2009-01-15 00:00:00
Account Value: 11655.33
    Buy Price: 1511.84
    Num Shares: 7.0
    Remaining Value: 1072.45
Sell Date: 
2009-02-17 00:00:00
    Sell Price: 1470.66
    Updated Value: 11367.07

-------------------------

Buy Date: 
2009-04-17 00:00:00
Account Value: 11367.07
    Buy Price: 1673.07
    Num Shares: 6.0
    Remaining Value: 1328.65
Sell Date: 
2009-12-07 00:00:00
    Sell Price: 2189.61
    Updated Value: 14466.31

-------------------------

Buy Date: 
2009-12-09 00:00:00
Account Value: 14466.31
    Buy Price: 2183.73
    Num Shares: 6.0
    Remaining Value: 1363.93
Sell Date: 
2010-02-22 00:00:00
    Sell Price: 2242.03
    Updated Value: 14816.11

-------------------------

Buy Date: 
2010-03-22 00:00:00
Account Value: 14816.11
    Buy Price: 2395.4
    Num Shares: 6.0
    Remaining Value: 443.71
Sell Date: 
2010-05-28 00:00:00
    Sell Price: 2257.04
    Updated Value: 13985.95

-------------------------

Buy Date: 
2010-08-16 00:00:00
Account Value: 13985.95
    Buy Price: 2181.87
    Num Shares: 6.0
    Remaining Value: 894.73
Sell Date: 
2010-09-14 00:00:00
    Sell Price: 2289.77
    Updated Value: 14633.35

-------------------------

Buy Date: 
2010-10-06 00:00:00
Account Value: 14633.35
    Buy Price: 2380.66
    Num Shares: 6.0
    Remaining Value: 349.39
Sell Date: 
2011-03-31 00:00:00
    Sell Price: 2781.07
    Updated Value: 17035.81

-------------------------

Buy Date: 
2011-04-29 00:00:00
Account Value: 17035.81
    Buy Price: 2873.54
    Num Shares: 5.0
    Remaining Value: 2668.11
Sell Date: 
2011-06-14 00:00:00
    Sell Price: 2678.72
    Updated Value: 16061.71

-------------------------

Buy Date: 
2011-07-29 00:00:00
Account Value: 16061.71
    Buy Price: 2756.38
    Num Shares: 5.0
    Remaining Value: 2279.81
Sell Date: 
2011-08-22 00:00:00
    Sell Price: 2345.38
    Updated Value: 14006.71

-------------------------

Buy Date: 
2011-10-07 00:00:00
Account Value: 14006.71
    Buy Price: 2479.35
    Num Shares: 5.0
    Remaining Value: 1609.96
Sell Date: 
2011-12-15 00:00:00
    Sell Price: 2541.01
    Updated Value: 14315.01

-------------------------

Buy Date: 
2012-01-12 00:00:00
Account Value: 14315.01
    Buy Price: 2724.7
    Num Shares: 5.0
    Remaining Value: 691.51
Sell Date: 
2012-05-14 00:00:00
    Sell Price: 2902.58
    Updated Value: 15204.41

-------------------------

Buy Date: 
2012-07-17 00:00:00
Account Value: 15204.41
    Buy Price: 2910.04
    Num Shares: 5.0
    Remaining Value: 654.21
Sell Date: 
2012-11-02 00:00:00
    Sell Price: 2982.13
    Updated Value: 15564.86

-------------------------

Buy Date: 
2012-12-31 00:00:00
Account Value: 15564.86
    Buy Price: 3019.51
    Num Shares: 5.0
    Remaining Value: 467.31
Sell Date: 
2013-07-12 00:00:00
    Sell Price: 3600.08
    Updated Value: 18467.71

-------------------------

Buy Date: 
2013-07-26 00:00:00
Account Value: 18467.71
    Buy Price: 3613.16
    Num Shares: 5.0
    Remaining Value: 401.91
Sell Date: 
2014-03-06 00:00:00
    Sell Price: 4352.13
    Updated Value: 22162.56

-------------------------

Buy Date: 
2014-03-11 00:00:00
Account Value: 22162.56
    Buy Price: 4307.19
    Num Shares: 5.0
    Remaining Value: 626.61
Sell Date: 
2014-04-17 00:00:00
    Sell Price: 4095.52
    Updated Value: 21104.21

-------------------------

Buy Date: 
2014-06-09 00:00:00
Account Value: 21104.21
    Buy Price: 4336.24
    Num Shares: 4.0
    Remaining Value: 3759.25
Sell Date: 
2014-10-17 00:00:00
    Sell Price: 4258.44
    Updated Value: 20793.01

-------------------------

Buy Date: 
2014-11-24 00:00:00
Account Value: 20793.01
    Buy Price: 4754.89
    Num Shares: 4.0
    Remaining Value: 1773.45
Sell Date: 
2015-01-21 00:00:00
    Sell Price: 4667.42
    Updated Value: 20443.13

-------------------------

Buy Date: 
2015-02-20 00:00:00
Account Value: 20443.13
    Buy Price: 4955.97
    Num Shares: 4.0
    Remaining Value: 619.25
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20603.17


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20603.17





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-25 00:00:00
Account Value: 10000
    Buy Price: 2251.03
    Num Shares: 4.0
    Remaining Value: 995.88
Sell Date: 
2001-07-23 00:00:00
    Sell Price: 1988.56
    Updated Value: 8950.12

-------------------------

Buy Date: 
2001-11-26 00:00:00
Account Value: 8950.12
    Buy Price: 1941.23
    Num Shares: 4.0
    Remaining Value: 1185.2
Sell Date: 
2002-02-21 00:00:00
    Sell Price: 1716.24
    Updated Value: 8050.16

-------------------------

Buy Date: 
2002-11-19 00:00:00
Account Value: 8050.16
    Buy Price: 1374.51
    Num Shares: 5.0
    Remaining Value: 1177.61
Sell Date: 
2003-02-06 00:00:00
    Sell Price: 1301.73
    Updated Value: 7686.26

-------------------------

Buy Date: 
2003-04-17 00:00:00
Account Value: 7686.26
    Buy Price: 1425.5
    Num Shares: 5.0
    Remaining Value: 558.76
Sell Date: 
2004-03-25 00:00:00
    Sell Price: 1967.17
    Updated Value: 10394.61

-------------------------

Buy Date: 
2004-07-02 00:00:00
Account Value: 10394.61
    Buy Price: 2006.66
    Num Shares: 5.0
    Remaining Value: 361.31
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 1889.06
    Updated Value: 9806.61

-------------------------

Buy Date: 
2004-10-12 00:00:00
Account Value: 9806.61
    Buy Price: 1925.17
    Num Shares: 5.0
    Remaining Value: 180.76
Sell Date: 
2005-02-11 00:00:00
    Sell Price: 2076.66
    Updated Value: 10564.06

-------------------------

Buy Date: 
2005-06-13 00:00:00
Account Value: 10564.06
    Buy Price: 2068.96
    Num Shares: 5.0
    Remaining Value: 219.26
Sell Date: 
2005-10-12 00:00:00
    Sell Price: 2037.47
    Updated Value: 10406.61

-------------------------

Buy Date: 
2005-11-28 00:00:00
Account Value: 10406.61
    Buy Price: 2239.37
    Num Shares: 4.0
    Remaining Value: 1449.13
Sell Date: 
2006-05-31 00:00:00
    Sell Price: 2178.88
    Updated Value: 10164.65

-------------------------

Buy Date: 
2006-09-13 00:00:00
Account Value: 10164.65
    Buy Price: 2227.67
    Num Shares: 4.0
    Remaining Value: 1253.97
Sell Date: 
2007-03-23 00:00:00
    Sell Price: 2448.93
    Updated Value: 11049.69

-------------------------

Buy Date: 
2007-04-27 00:00:00
Account Value: 11049.69
    Buy Price: 2557.21
    Num Shares: 4.0
    Remaining Value: 820.85
Sell Date: 
2007-08-28 00:00:00
    Sell Price: 2500.64
    Updated Value: 10823.41

-------------------------

Buy Date: 
2007-10-04 00:00:00
Account Value: 10823.41
    Buy Price: 2733.57
    Num Shares: 3.0
    Remaining Value: 2622.7
Sell Date: 
2007-12-13 00:00:00
    Sell Price: 2668.49
    Updated Value: 10628.17

-------------------------

Buy Date: 
2008-04-29 00:00:00
Account Value: 10628.17
    Buy Price: 2426.1
    Num Shares: 4.0
    Remaining Value: 923.77
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 2215.71
    Updated Value: 9786.61

-------------------------

Buy Date: 
2008-09-16 00:00:00
Account Value: 9786.61
    Buy Price: 2207.9
    Num Shares: 4.0
    Remaining Value: 955.01
Sell Date: 
2008-09-24 00:00:00
    Sell Price: 2155.68
    Updated Value: 9577.73

-------------------------

Buy Date: 
2009-04-21 00:00:00
Account Value: 9577.73
    Buy Price: 1643.85
    Num Shares: 5.0
    Remaining Value: 1358.48
Sell Date: 
2010-03-02 00:00:00
    Sell Price: 2280.79
    Updated Value: 12762.43

-------------------------

Buy Date: 
2010-03-18 00:00:00
Account Value: 12762.43
    Buy Price: 2391.28
    Num Shares: 5.0
    Remaining Value: 806.03
Sell Date: 
2010-06-07 00:00:00
    Sell Price: 2173.9
    Updated Value: 11675.53

-------------------------

Buy Date: 
2010-08-30 00:00:00
Account Value: 11675.53
    Buy Price: 2119.97
    Num Shares: 5.0
    Remaining Value: 1075.68
Sell Date: 
2010-09-10 00:00:00
    Sell Price: 2242.48
    Updated Value: 12288.08

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 12288.08
    Buy Price: 2370.75
    Num Shares: 5.0
    Remaining Value: 434.33
Sell Date: 
2011-04-13 00:00:00
    Sell Price: 2761.52
    Updated Value: 14241.93

-------------------------

Buy Date: 
2011-04-29 00:00:00
Account Value: 14241.93
    Buy Price: 2873.54
    Num Shares: 4.0
    Remaining Value: 2747.77
Sell Date: 
2011-06-23 00:00:00
    Sell Price: 2686.75
    Updated Value: 13494.77

-------------------------

Buy Date: 
2011-11-07 00:00:00
Account Value: 13494.77
    Buy Price: 2695.25
    Num Shares: 5.0
    Remaining Value: 18.52
Sell Date: 
2011-12-29 00:00:00
    Sell Price: 2613.74
    Updated Value: 13087.22

-------------------------

Buy Date: 
2012-01-06 00:00:00
Account Value: 13087.22
    Buy Price: 2674.22
    Num Shares: 4.0
    Remaining Value: 2390.34
Sell Date: 
2012-05-22 00:00:00
    Sell Price: 2839.08
    Updated Value: 13746.66

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 13746.66
    Buy Price: 2989.91
    Num Shares: 4.0
    Remaining Value: 1787.02
Sell Date: 
2012-11-13 00:00:00
    Sell Price: 2883.89
    Updated Value: 13322.58

-------------------------

Buy Date: 
2013-01-15 00:00:00
Account Value: 13322.58
    Buy Price: 3110.78
    Num Shares: 4.0
    Remaining Value: 879.46
Sell Date: 
2014-04-25 00:00:00
    Sell Price: 4075.56
    Updated Value: 17181.7

-------------------------

Buy Date: 
2014-06-20 00:00:00
Account Value: 17181.7
    Buy Price: 4368.04
    Num Shares: 3.0
    Remaining Value: 4077.58
Sell Date: 
2014-10-24 00:00:00
    Sell Price: 4483.72
    Updated Value: 17528.74

-------------------------

Buy Date: 
2014-11-25 00:00:00
Account Value: 17528.74
    Buy Price: 4758.25
    Num Shares: 3.0
    Remaining Value: 3253.99
Sell Date: 
2015-02-13 00:00:00
    Sell Price: 4893.84
    Updated Value: 17935.51

-------------------------

Buy Date: 
2015-02-19 00:00:00
Account Value: 17935.51
    Buy Price: 4924.7
    Num Shares: 3.0
    Remaining Value: 3161.41
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 18149.35


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 18149.35





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-12-14 00:00:00
Account Value: 10000
    Buy Price: 1953.17
    Num Shares: 5.0
    Remaining Value: 234.15
Sell Date: 
2002-03-26 00:00:00
    Sell Price: 1824.17
    Updated Value: 9355.0

-------------------------

Buy Date: 
2002-11-29 00:00:00
Account Value: 9355.0
    Buy Price: 1478.78
    Num Shares: 6.0
    Remaining Value: 482.32
Sell Date: 
2003-03-07 00:00:00
    Sell Price: 1305.29
    Updated Value: 8314.06

-------------------------

Buy Date: 
2003-04-22 00:00:00
Account Value: 8314.06
    Buy Price: 1451.36
    Num Shares: 5.0
    Remaining Value: 1057.26
Sell Date: 
2004-04-16 00:00:00
    Sell Price: 1995.74
    Updated Value: 11035.96

-------------------------

Buy Date: 
2004-05-04 00:00:00
Account Value: 11035.96
    Buy Price: 1950.48
    Num Shares: 5.0
    Remaining Value: 1283.56
Sell Date: 
2004-05-17 00:00:00
    Sell Price: 1876.64
    Updated Value: 10666.76

-------------------------

Buy Date: 
2004-11-02 00:00:00
Account Value: 10666.76
    Buy Price: 1984.79
    Num Shares: 5.0
    Remaining Value: 742.81
Sell Date: 
2005-03-31 00:00:00
    Sell Price: 1999.23
    Updated Value: 10738.96

-------------------------

Buy Date: 
2005-06-23 00:00:00
Account Value: 10738.96
    Buy Price: 2070.66
    Num Shares: 5.0
    Remaining Value: 385.66
Sell Date: 
2005-11-03 00:00:00
    Sell Price: 2160.22
    Updated Value: 11186.76

-------------------------

Buy Date: 
2005-11-23 00:00:00
Account Value: 11186.76
    Buy Price: 2259.98
    Num Shares: 4.0
    Remaining Value: 2146.84
Sell Date: 
2006-06-02 00:00:00
    Sell Price: 2219.41
    Updated Value: 11024.48

-------------------------

Buy Date: 
2006-10-04 00:00:00
Account Value: 11024.48
    Buy Price: 2290.95
    Num Shares: 4.0
    Remaining Value: 1860.68
Sell Date: 
2007-04-09 00:00:00
    Sell Price: 2469.18
    Updated Value: 11737.4

-------------------------

Buy Date: 
2007-04-19 00:00:00
Account Value: 11737.4
    Buy Price: 2505.35
    Num Shares: 4.0
    Remaining Value: 1716.0
Sell Date: 
2007-09-14 00:00:00
    Sell Price: 2602.18
    Updated Value: 12124.72

-------------------------

Buy Date: 
2007-09-26 00:00:00
Account Value: 12124.72
    Buy Price: 2699.03
    Num Shares: 4.0
    Remaining Value: 1328.6
Sell Date: 
2007-12-19 00:00:00
    Sell Price: 2601.01
    Updated Value: 11732.64

-------------------------

Buy Date: 
2008-05-29 00:00:00
Account Value: 11732.64
    Buy Price: 2508.32
    Num Shares: 4.0
    Remaining Value: 1699.36
Sell Date: 
2008-07-23 00:00:00
    Sell Price: 2325.88
    Updated Value: 11002.88

-------------------------

Buy Date: 
2009-04-23 00:00:00
Account Value: 11002.88
    Buy Price: 1652.21
    Num Shares: 6.0
    Remaining Value: 1089.62
Sell Date: 
2010-06-15 00:00:00
    Sell Price: 2305.88
    Updated Value: 14924.9

-------------------------

Buy Date: 
2010-10-12 00:00:00
Account Value: 14924.9
    Buy Price: 2417.92
    Num Shares: 6.0
    Remaining Value: 417.38
Sell Date: 
2011-06-24 00:00:00
    Sell Price: 2652.89
    Updated Value: 16334.72

-------------------------

Buy Date: 
2011-08-02 00:00:00
Account Value: 16334.72
    Buy Price: 2669.24
    Num Shares: 6.0
    Remaining Value: 319.28
Sell Date: 
2011-08-12 00:00:00
    Sell Price: 2507.98
    Updated Value: 15367.16

-------------------------

Buy Date: 
2011-11-21 00:00:00
Account Value: 15367.16
    Buy Price: 2523.14
    Num Shares: 6.0
    Remaining Value: 228.32
Sell Date: 
2011-12-12 00:00:00
    Sell Price: 2612.26
    Updated Value: 15901.88

-------------------------

Buy Date: 
2012-01-10 00:00:00
Account Value: 15901.88
    Buy Price: 2702.5
    Num Shares: 5.0
    Remaining Value: 2389.38
Sell Date: 
2012-06-15 00:00:00
    Sell Price: 2872.8
    Updated Value: 16753.38

-------------------------

Buy Date: 
2012-08-28 00:00:00
Account Value: 16753.38
    Buy Price: 3077.14
    Num Shares: 5.0
    Remaining Value: 1367.68
Sell Date: 
2012-11-30 00:00:00
    Sell Price: 3010.24
    Updated Value: 16418.88

-------------------------

Buy Date: 
2013-01-16 00:00:00
Account Value: 16418.88
    Buy Price: 3117.54
    Num Shares: 5.0
    Remaining Value: 831.18
Sell Date: 
2014-05-13 00:00:00
    Sell Price: 4130.17
    Updated Value: 21482.03

-------------------------

Buy Date: 
2014-06-18 00:00:00
Account Value: 21482.03
    Buy Price: 4362.84
    Num Shares: 4.0
    Remaining Value: 4030.67
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 24014.59


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 24014.59





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-30 00:00:00
Account Value: 10000
    Buy Price: 2084.5
    Num Shares: 4.0
    Remaining Value: 1662.0
Sell Date: 
2001-07-06 00:00:00
    Sell Price: 2004.16
    Updated Value: 9678.64

-------------------------

Buy Date: 
2001-12-31 00:00:00
Account Value: 9678.64
    Buy Price: 1950.4
    Num Shares: 4.0
    Remaining Value: 1877.04
Sell Date: 
2002-02-12 00:00:00
    Sell Price: 1834.21
    Updated Value: 9213.88

-------------------------

Buy Date: 
2003-04-03 00:00:00
Account Value: 9213.88
    Buy Price: 1396.58
    Num Shares: 6.0
    Remaining Value: 834.4
Sell Date: 
2004-06-08 00:00:00
    Sell Price: 2023.53
    Updated Value: 12975.58

-------------------------

Buy Date: 
2004-06-30 00:00:00
Account Value: 12975.58
    Buy Price: 2047.79
    Num Shares: 6.0
    Remaining Value: 688.84
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 1889.06
    Updated Value: 12023.2

-------------------------

Buy Date: 
2004-11-16 00:00:00
Account Value: 12023.2
    Buy Price: 2078.62
    Num Shares: 5.0
    Remaining Value: 1630.1
Sell Date: 
2005-05-03 00:00:00
    Sell Price: 1933.07
    Updated Value: 11295.45

-------------------------

Buy Date: 
2005-06-13 00:00:00
Account Value: 11295.45
    Buy Price: 2068.96
    Num Shares: 5.0
    Remaining Value: 950.65
Sell Date: 
2006-06-16 00:00:00
    Sell Price: 2129.95
    Updated Value: 11600.4

-------------------------

Buy Date: 
2006-10-16 00:00:00
Account Value: 11600.4
    Buy Price: 2363.84
    Num Shares: 4.0
    Remaining Value: 2145.04
Sell Date: 
2008-01-22 00:00:00
    Sell Price: 2292.27
    Updated Value: 11314.12

-------------------------

Buy Date: 
2009-06-08 00:00:00
Account Value: 11314.12
    Buy Price: 1842.4
    Num Shares: 6.0
    Remaining Value: 259.72
Sell Date: 
2010-07-01 00:00:00
    Sell Price: 2101.36
    Updated Value: 12867.88

-------------------------

Buy Date: 
2010-10-12 00:00:00
Account Value: 12867.88
    Buy Price: 2417.92
    Num Shares: 5.0
    Remaining Value: 778.28
Sell Date: 
2011-08-22 00:00:00
    Sell Price: 2345.38
    Updated Value: 12505.18

-------------------------

Buy Date: 
2012-02-01 00:00:00
Account Value: 12505.18
    Buy Price: 2848.27
    Num Shares: 4.0
    Remaining Value: 1112.1
Sell Date: 
2012-11-29 00:00:00
    Sell Price: 3012.03
    Updated Value: 13160.22

-------------------------

Buy Date: 
2013-01-02 00:00:00
Account Value: 13160.22
    Buy Price: 3112.26
    Num Shares: 4.0
    Remaining Value: 711.18
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20695.1


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20695.1





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-24 00:00:00
Account Value: 10000
    Buy Price: 2282.02
    Num Shares: 4.0
    Remaining Value: 871.92
Sell Date: 
2001-07-18 00:00:00
    Sell Price: 2016.17
    Updated Value: 8936.6

-------------------------

Buy Date: 
2003-04-30 00:00:00
Account Value: 8936.6
    Buy Price: 1464.31
    Num Shares: 6.0
    Remaining Value: 150.74
Sell Date: 
2004-08-06 00:00:00
    Sell Price: 1776.89
    Updated Value: 10812.08

-------------------------

Buy Date: 
2004-11-22 00:00:00
Account Value: 10812.08
    Buy Price: 2085.19
    Num Shares: 5.0
    Remaining Value: 386.13
Sell Date: 
2005-05-03 00:00:00
    Sell Price: 1933.07
    Updated Value: 10051.48

-------------------------

Buy Date: 
2005-06-03 00:00:00
Account Value: 10051.48
    Buy Price: 2071.43
    Num Shares: 4.0
    Remaining Value: 1765.76
Sell Date: 
2006-06-21 00:00:00
    Sell Price: 2141.2
    Updated Value: 10330.56

-------------------------

Buy Date: 
2006-10-10 00:00:00
Account Value: 10330.56
    Buy Price: 2315.43
    Num Shares: 4.0
    Remaining Value: 1068.84
Sell Date: 
2008-01-28 00:00:00
    Sell Price: 2349.91
    Updated Value: 10468.48

-------------------------

Buy Date: 
2009-07-13 00:00:00
Account Value: 10468.48
    Buy Price: 1793.21
    Num Shares: 5.0
    Remaining Value: 1502.43
Sell Date: 
2010-09-07 00:00:00
    Sell Price: 2208.89
    Updated Value: 12546.88

-------------------------

Buy Date: 
2010-10-06 00:00:00
Account Value: 12546.88
    Buy Price: 2380.66
    Num Shares: 5.0
    Remaining Value: 643.58
Sell Date: 
2011-08-31 00:00:00
    Sell Price: 2579.46
    Updated Value: 13540.88

-------------------------

Buy Date: 
2012-02-03 00:00:00
Account Value: 13540.88
    Buy Price: 2905.66
    Num Shares: 4.0
    Remaining Value: 1918.24
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21902.16


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21902.16





-----------------------------------------------------------------------
^IXIC Calculations, N = [30, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-22 00:00:00
Account Value: 10000
    Buy Price: 2313.85
    Num Shares: 4.0
    Remaining Value: 744.6
Sell Date: 
2001-07-24 00:00:00
    Sell Price: 1959.24
    Updated Value: 8581.56

-------------------------

Buy Date: 
2003-05-23 00:00:00
Account Value: 8581.56
    Buy Price: 1510.09
    Num Shares: 5.0
    Remaining Value: 1031.11
Sell Date: 
2004-08-17 00:00:00
    Sell Price: 1795.25
    Updated Value: 10007.36

-------------------------

Buy Date: 
2004-11-11 00:00:00
Account Value: 10007.36
    Buy Price: 2061.27
    Num Shares: 4.0
    Remaining Value: 1762.28
Sell Date: 
2005-04-28 00:00:00
    Sell Price: 1904.18
    Updated Value: 9379.0

-------------------------

Buy Date: 
2005-06-03 00:00:00
Account Value: 9379.0
    Buy Price: 2071.43
    Num Shares: 4.0
    Remaining Value: 1093.28
Sell Date: 
2006-06-28 00:00:00
    Sell Price: 2111.84
    Updated Value: 9540.64

-------------------------

Buy Date: 
2006-10-05 00:00:00
Account Value: 9540.64
    Buy Price: 2306.34
    Num Shares: 4.0
    Remaining Value: 315.28
Sell Date: 
2008-01-30 00:00:00
    Sell Price: 2349.0
    Updated Value: 9711.28

-------------------------

Buy Date: 
2009-08-14 00:00:00
Account Value: 9711.28
    Buy Price: 1985.52
    Num Shares: 4.0
    Remaining Value: 1769.2
Sell Date: 
2011-09-09 00:00:00
    Sell Price: 2467.99
    Updated Value: 11641.16

-------------------------

Buy Date: 
2011-11-16 00:00:00
Account Value: 11641.16
    Buy Price: 2639.61
    Num Shares: 4.0
    Remaining Value: 1082.72
Sell Date: 
2011-11-29 00:00:00
    Sell Price: 2515.51
    Updated Value: 11144.76

-------------------------

Buy Date: 
2012-02-02 00:00:00
Account Value: 11144.76
    Buy Price: 2859.68
    Num Shares: 3.0
    Remaining Value: 2565.72
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 17553.66


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 17553.66





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-18 00:00:00
Account Value: 10000
    Buy Price: 2198.88
    Num Shares: 4.0
    Remaining Value: 1204.48
Sell Date: 
2001-07-09 00:00:00
    Sell Price: 2026.71
    Updated Value: 9311.32

-------------------------

Buy Date: 
2001-07-12 00:00:00
Account Value: 9311.32
    Buy Price: 2075.74
    Num Shares: 4.0
    Remaining Value: 1008.36
Sell Date: 
2001-07-17 00:00:00
    Sell Price: 2067.32
    Updated Value: 9277.64

-------------------------

Buy Date: 
2001-11-16 00:00:00
Account Value: 9277.64
    Buy Price: 1898.58
    Num Shares: 4.0
    Remaining Value: 1683.32
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1818.88
    Updated Value: 8958.84

-------------------------

Buy Date: 
2002-04-18 00:00:00
Account Value: 8958.84
    Buy Price: 1802.43
    Num Shares: 4.0
    Remaining Value: 1749.12
Sell Date: 
2002-05-06 00:00:00
    Sell Price: 1578.48
    Updated Value: 8063.04

-------------------------

Buy Date: 
2002-09-26 00:00:00
Account Value: 8063.04
    Buy Price: 1221.61
    Num Shares: 6.0
    Remaining Value: 733.38
Sell Date: 
2002-10-14 00:00:00
    Sell Price: 1220.53
    Updated Value: 8056.56

-------------------------

Buy Date: 
2002-11-20 00:00:00
Account Value: 8056.56
    Buy Price: 1419.35
    Num Shares: 5.0
    Remaining Value: 959.81
Sell Date: 
2003-01-24 00:00:00
    Sell Price: 1342.14
    Updated Value: 7670.51

-------------------------

Buy Date: 
2003-02-27 00:00:00
Account Value: 7670.51
    Buy Price: 1323.94
    Num Shares: 5.0
    Remaining Value: 1050.81
Sell Date: 
2003-03-05 00:00:00
    Sell Price: 1314.4
    Updated Value: 7622.81

-------------------------

Buy Date: 
2003-04-04 00:00:00
Account Value: 7622.81
    Buy Price: 1383.51
    Num Shares: 5.0
    Remaining Value: 705.26
Sell Date: 
2004-01-08 00:00:00
    Sell Price: 2100.25
    Updated Value: 11206.51

-------------------------

Buy Date: 
2004-01-15 00:00:00
Account Value: 11206.51
    Buy Price: 2109.08
    Num Shares: 5.0
    Remaining Value: 661.11
Sell Date: 
2004-03-15 00:00:00
    Sell Price: 1939.2
    Updated Value: 10357.11

-------------------------

Buy Date: 
2004-05-14 00:00:00
Account Value: 10357.11
    Buy Price: 1904.25
    Num Shares: 5.0
    Remaining Value: 835.86
Sell Date: 
2004-06-03 00:00:00
    Sell Price: 1960.26
    Updated Value: 10637.16

-------------------------

Buy Date: 
2004-07-08 00:00:00
Account Value: 10637.16
    Buy Price: 1935.32
    Num Shares: 5.0
    Remaining Value: 960.56
Sell Date: 
2004-08-04 00:00:00
    Sell Price: 1855.06
    Updated Value: 10235.86

-------------------------

Buy Date: 
2004-10-06 00:00:00
Account Value: 10235.86
    Buy Price: 1971.03
    Num Shares: 5.0
    Remaining Value: 380.71
Sell Date: 
2005-02-04 00:00:00
    Sell Price: 2086.66
    Updated Value: 10814.01

-------------------------

Buy Date: 
2005-03-28 00:00:00
Account Value: 10814.01
    Buy Price: 1992.52
    Num Shares: 5.0
    Remaining Value: 851.41
Sell Date: 
2005-04-06 00:00:00
    Sell Price: 1999.14
    Updated Value: 10847.11

-------------------------

Buy Date: 
2005-06-14 00:00:00
Account Value: 10847.11
    Buy Price: 2069.04
    Num Shares: 5.0
    Remaining Value: 501.91
Sell Date: 
2005-09-22 00:00:00
    Sell Price: 2110.78
    Updated Value: 11055.81

-------------------------

Buy Date: 
2005-12-05 00:00:00
Account Value: 11055.81
    Buy Price: 2257.64
    Num Shares: 4.0
    Remaining Value: 2025.25
Sell Date: 
2006-03-14 00:00:00
    Sell Price: 2295.9
    Updated Value: 11208.85

-------------------------

Buy Date: 
2006-03-27 00:00:00
Account Value: 11208.85
    Buy Price: 2315.58
    Num Shares: 4.0
    Remaining Value: 1946.53
Sell Date: 
2006-03-30 00:00:00
    Sell Price: 2340.82
    Updated Value: 11309.81

-------------------------

Buy Date: 
2006-04-05 00:00:00
Account Value: 11309.81
    Buy Price: 2359.75
    Num Shares: 4.0
    Remaining Value: 1870.81
Sell Date: 
2006-05-30 00:00:00
    Sell Price: 2164.74
    Updated Value: 10529.77

-------------------------

Buy Date: 
2006-09-13 00:00:00
Account Value: 10529.77
    Buy Price: 2227.67
    Num Shares: 4.0
    Remaining Value: 1619.09
Sell Date: 
2007-01-25 00:00:00
    Sell Price: 2434.24
    Updated Value: 11356.05

-------------------------

Buy Date: 
2007-02-01 00:00:00
Account Value: 11356.05
    Buy Price: 2468.38
    Num Shares: 4.0
    Remaining Value: 1482.53
Sell Date: 
2007-03-14 00:00:00
    Sell Price: 2371.74
    Updated Value: 10969.49

-------------------------

Buy Date: 
2007-03-27 00:00:00
Account Value: 10969.49
    Buy Price: 2437.43
    Num Shares: 4.0
    Remaining Value: 1219.77
Sell Date: 
2007-04-02 00:00:00
    Sell Price: 2422.26
    Updated Value: 10908.81

-------------------------

Buy Date: 
2007-05-03 00:00:00
Account Value: 10908.81
    Buy Price: 2565.46
    Num Shares: 4.0
    Remaining Value: 646.97
Sell Date: 
2007-09-04 00:00:00
    Sell Price: 2630.24
    Updated Value: 11167.93

-------------------------

Buy Date: 
2007-10-03 00:00:00
Account Value: 11167.93
    Buy Price: 2729.43
    Num Shares: 4.0
    Remaining Value: 250.21
Sell Date: 
2007-12-05 00:00:00
    Sell Price: 2666.36
    Updated Value: 10915.65

-------------------------

Buy Date: 
2008-01-24 00:00:00
Account Value: 10915.65
    Buy Price: 2360.92
    Num Shares: 4.0
    Remaining Value: 1471.97
Sell Date: 
2008-01-28 00:00:00
    Sell Price: 2349.91
    Updated Value: 10871.61

-------------------------

Buy Date: 
2008-05-02 00:00:00
Account Value: 10871.61
    Buy Price: 2476.99
    Num Shares: 4.0
    Remaining Value: 963.65
Sell Date: 
2008-07-09 00:00:00
    Sell Price: 2234.89
    Updated Value: 9903.21

-------------------------

Buy Date: 
2008-09-02 00:00:00
Account Value: 9903.21
    Buy Price: 2349.24
    Num Shares: 4.0
    Remaining Value: 506.25
Sell Date: 
2008-10-06 00:00:00
    Sell Price: 1862.96
    Updated Value: 7958.09

-------------------------

Buy Date: 
2009-01-21 00:00:00
Account Value: 7958.09
    Buy Price: 1507.07
    Num Shares: 5.0
    Remaining Value: 422.74
Sell Date: 
2009-02-18 00:00:00
    Sell Price: 1467.97
    Updated Value: 7762.59

-------------------------

Buy Date: 
2009-04-24 00:00:00
Account Value: 7762.59
    Buy Price: 1694.29
    Num Shares: 4.0
    Remaining Value: 985.43
Sell Date: 
2009-08-10 00:00:00
    Sell Price: 1992.24
    Updated Value: 8954.39

-------------------------

Buy Date: 
2009-08-11 00:00:00
Account Value: 8954.39
    Buy Price: 1969.73
    Num Shares: 4.0
    Remaining Value: 1075.47
Sell Date: 
2009-11-23 00:00:00
    Sell Price: 2176.01
    Updated Value: 9779.51

-------------------------

Buy Date: 
2009-11-27 00:00:00
Account Value: 9779.51
    Buy Price: 2138.44
    Num Shares: 4.0
    Remaining Value: 1225.75
Sell Date: 
2009-12-15 00:00:00
    Sell Price: 2201.05
    Updated Value: 10029.95

-------------------------

Buy Date: 
2009-12-24 00:00:00
Account Value: 10029.95
    Buy Price: 2285.69
    Num Shares: 4.0
    Remaining Value: 887.19
Sell Date: 
2010-03-01 00:00:00
    Sell Price: 2273.57
    Updated Value: 9981.47

-------------------------

Buy Date: 
2010-03-29 00:00:00
Account Value: 9981.47
    Buy Price: 2404.36
    Num Shares: 4.0
    Remaining Value: 364.03
Sell Date: 
2010-06-07 00:00:00
    Sell Price: 2173.9
    Updated Value: 9059.63

-------------------------

Buy Date: 
2010-08-05 00:00:00
Account Value: 9059.63
    Buy Price: 2293.06
    Num Shares: 3.0
    Remaining Value: 2180.45
Sell Date: 
2010-08-11 00:00:00
    Sell Price: 2208.63
    Updated Value: 8806.34

-------------------------

Buy Date: 
2010-08-30 00:00:00
Account Value: 8806.34
    Buy Price: 2119.97
    Num Shares: 4.0
    Remaining Value: 326.46
Sell Date: 
2010-09-22 00:00:00
    Sell Price: 2334.55
    Updated Value: 9664.66

-------------------------

Buy Date: 
2010-10-14 00:00:00
Account Value: 9664.66
    Buy Price: 2435.38
    Num Shares: 3.0
    Remaining Value: 2358.52
Sell Date: 
2011-04-11 00:00:00
    Sell Price: 2771.51
    Updated Value: 10673.05

-------------------------

Buy Date: 
2011-05-10 00:00:00
Account Value: 10673.05
    Buy Price: 2871.89
    Num Shares: 3.0
    Remaining Value: 2057.38
Sell Date: 
2011-06-24 00:00:00
    Sell Price: 2652.89
    Updated Value: 10016.05

-------------------------

Buy Date: 
2011-08-09 00:00:00
Account Value: 10016.05
    Buy Price: 2482.52
    Num Shares: 4.0
    Remaining Value: 85.97
Sell Date: 
2011-08-30 00:00:00
    Sell Price: 2576.11
    Updated Value: 10390.41

-------------------------

Buy Date: 
2011-10-13 00:00:00
Account Value: 10390.41
    Buy Price: 2620.24
    Num Shares: 3.0
    Remaining Value: 2529.69
Sell Date: 
2011-12-21 00:00:00
    Sell Price: 2577.97
    Updated Value: 10263.6

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 10263.6
    Buy Price: 2786.64
    Num Shares: 3.0
    Remaining Value: 1903.68
Sell Date: 
2012-05-18 00:00:00
    Sell Price: 2778.79
    Updated Value: 10240.05

-------------------------

Buy Date: 
2012-07-23 00:00:00
Account Value: 10240.05
    Buy Price: 2890.15
    Num Shares: 3.0
    Remaining Value: 1569.6
Sell Date: 
2012-11-12 00:00:00
    Sell Price: 2904.25
    Updated Value: 10282.35

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 10282.35
    Buy Price: 3121.76
    Num Shares: 3.0
    Remaining Value: 917.07
Sell Date: 
2013-07-18 00:00:00
    Sell Price: 3611.28
    Updated Value: 11750.91

-------------------------

Buy Date: 
2013-08-01 00:00:00
Account Value: 11750.91
    Buy Price: 3675.74
    Num Shares: 3.0
    Remaining Value: 723.69
Sell Date: 
2014-03-20 00:00:00
    Sell Price: 4319.29
    Updated Value: 13681.56

-------------------------

Buy Date: 
2014-03-25 00:00:00
Account Value: 13681.56
    Buy Price: 4234.27
    Num Shares: 3.0
    Remaining Value: 978.75
Sell Date: 
2014-04-24 00:00:00
    Sell Price: 4148.34
    Updated Value: 13423.77

-------------------------

Buy Date: 
2014-06-12 00:00:00
Account Value: 13423.77
    Buy Price: 4297.63
    Num Shares: 3.0
    Remaining Value: 530.88
Sell Date: 
2014-10-23 00:00:00
    Sell Price: 4452.79
    Updated Value: 13889.25

-------------------------

Buy Date: 
2014-12-03 00:00:00
Account Value: 13889.25
    Buy Price: 4774.47
    Num Shares: 2.0
    Remaining Value: 4340.31
Sell Date: 
2015-01-28 00:00:00
    Sell Price: 4637.99
    Updated Value: 13616.29

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 13616.29
    Buy Price: 4893.84
    Num Shares: 2.0
    Remaining Value: 3828.61
Sell Date: 
2015-02-27 00:00:00
    Sell Price: 4963.53
    Updated Value: 13755.67

-------------------------

Buy Date: 
2015-03-06 00:00:00
Account Value: 13755.67
    Buy Price: 4927.37
    Num Shares: 2.0
    Remaining Value: 3900.93
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 13892.89


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 13892.89





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-05 00:00:00
Account Value: 10000
    Buy Price: 2233.66
    Num Shares: 4.0
    Remaining Value: 1065.36
Sell Date: 
2001-07-26 00:00:00
    Sell Price: 2022.96
    Updated Value: 9157.2

-------------------------

Buy Date: 
2001-11-30 00:00:00
Account Value: 9157.2
    Buy Price: 1930.58
    Num Shares: 4.0
    Remaining Value: 1434.88
Sell Date: 
2002-02-27 00:00:00
    Sell Price: 1751.88
    Updated Value: 8442.4

-------------------------

Buy Date: 
2002-12-02 00:00:00
Account Value: 8442.4
    Buy Price: 1484.78
    Num Shares: 5.0
    Remaining Value: 1018.5
Sell Date: 
2003-02-06 00:00:00
    Sell Price: 1301.73
    Updated Value: 7527.15

-------------------------

Buy Date: 
2003-04-25 00:00:00
Account Value: 7527.15
    Buy Price: 1434.54
    Num Shares: 5.0
    Remaining Value: 354.45
Sell Date: 
2004-03-29 00:00:00
    Sell Price: 1992.57
    Updated Value: 10317.3

-------------------------

Buy Date: 
2004-07-22 00:00:00
Account Value: 10317.3
    Buy Price: 1889.06
    Num Shares: 5.0
    Remaining Value: 872.0
Sell Date: 
2004-08-06 00:00:00
    Sell Price: 1776.89
    Updated Value: 9756.45

-------------------------

Buy Date: 
2004-10-18 00:00:00
Account Value: 9756.45
    Buy Price: 1936.52
    Num Shares: 5.0
    Remaining Value: 73.85
Sell Date: 
2005-02-22 00:00:00
    Sell Price: 2030.32
    Updated Value: 10225.45

-------------------------

Buy Date: 
2005-06-21 00:00:00
Account Value: 10225.45
    Buy Price: 2091.07
    Num Shares: 4.0
    Remaining Value: 1861.17
Sell Date: 
2005-10-11 00:00:00
    Sell Price: 2061.09
    Updated Value: 10105.53

-------------------------

Buy Date: 
2005-12-07 00:00:00
Account Value: 10105.53
    Buy Price: 2252.01
    Num Shares: 4.0
    Remaining Value: 1097.49
Sell Date: 
2006-06-05 00:00:00
    Sell Price: 2169.62
    Updated Value: 9775.97

-------------------------

Buy Date: 
2006-09-19 00:00:00
Account Value: 9775.97
    Buy Price: 2222.37
    Num Shares: 4.0
    Remaining Value: 886.49
Sell Date: 
2007-04-04 00:00:00
    Sell Price: 2458.69
    Updated Value: 10721.25

-------------------------

Buy Date: 
2007-05-08 00:00:00
Account Value: 10721.25
    Buy Price: 2571.75
    Num Shares: 4.0
    Remaining Value: 434.25
Sell Date: 
2007-09-07 00:00:00
    Sell Price: 2565.7
    Updated Value: 10697.05

-------------------------

Buy Date: 
2007-10-15 00:00:00
Account Value: 10697.05
    Buy Price: 2780.05
    Num Shares: 3.0
    Remaining Value: 2356.9
Sell Date: 
2007-12-21 00:00:00
    Sell Price: 2691.99
    Updated Value: 10432.87

-------------------------

Buy Date: 
2008-05-07 00:00:00
Account Value: 10432.87
    Buy Price: 2438.49
    Num Shares: 4.0
    Remaining Value: 678.91
Sell Date: 
2008-07-21 00:00:00
    Sell Price: 2279.53
    Updated Value: 9797.03

-------------------------

Buy Date: 
2008-09-23 00:00:00
Account Value: 9797.03
    Buy Price: 2153.33
    Num Shares: 4.0
    Remaining Value: 1183.71
Sell Date: 
2008-10-07 00:00:00
    Sell Price: 1754.88
    Updated Value: 8203.23

-------------------------

Buy Date: 
2009-02-20 00:00:00
Account Value: 8203.23
    Buy Price: 1441.23
    Num Shares: 5.0
    Remaining Value: 997.08
Sell Date: 
2009-03-05 00:00:00
    Sell Price: 1299.59
    Updated Value: 7495.03

-------------------------

Buy Date: 
2009-04-29 00:00:00
Account Value: 7495.03
    Buy Price: 1711.94
    Num Shares: 4.0
    Remaining Value: 647.27
Sell Date: 
2010-03-16 00:00:00
    Sell Price: 2378.01
    Updated Value: 10159.31

-------------------------

Buy Date: 
2010-03-31 00:00:00
Account Value: 10159.31
    Buy Price: 2397.96
    Num Shares: 4.0
    Remaining Value: 567.47
Sell Date: 
2010-06-15 00:00:00
    Sell Price: 2305.88
    Updated Value: 9790.99

-------------------------

Buy Date: 
2010-09-02 00:00:00
Account Value: 9790.99
    Buy Price: 2200.01
    Num Shares: 4.0
    Remaining Value: 990.95
Sell Date: 
2011-04-18 00:00:00
    Sell Price: 2735.38
    Updated Value: 11932.47

-------------------------

Buy Date: 
2011-05-12 00:00:00
Account Value: 11932.47
    Buy Price: 2863.04
    Num Shares: 4.0
    Remaining Value: 480.31
Sell Date: 
2011-07-01 00:00:00
    Sell Price: 2816.03
    Updated Value: 11744.43

-------------------------

Buy Date: 
2011-11-07 00:00:00
Account Value: 11744.43
    Buy Price: 2695.25
    Num Shares: 4.0
    Remaining Value: 963.43
Sell Date: 
2012-01-13 00:00:00
    Sell Price: 2710.67
    Updated Value: 11806.11

-------------------------

Buy Date: 
2012-01-25 00:00:00
Account Value: 11806.11
    Buy Price: 2818.31
    Num Shares: 4.0
    Remaining Value: 532.87
Sell Date: 
2012-05-30 00:00:00
    Sell Price: 2837.36
    Updated Value: 11882.31

-------------------------

Buy Date: 
2012-08-09 00:00:00
Account Value: 11882.31
    Buy Price: 3018.64
    Num Shares: 3.0
    Remaining Value: 2826.39
Sell Date: 
2012-11-19 00:00:00
    Sell Price: 2916.07
    Updated Value: 11574.6

-------------------------

Buy Date: 
2013-01-22 00:00:00
Account Value: 11574.6
    Buy Price: 3143.18
    Num Shares: 3.0
    Remaining Value: 2145.06
Sell Date: 
2014-05-06 00:00:00
    Sell Price: 4080.76
    Updated Value: 14387.34

-------------------------

Buy Date: 
2014-06-26 00:00:00
Account Value: 14387.34
    Buy Price: 4379.05
    Num Shares: 3.0
    Remaining Value: 1250.19
Sell Date: 
2014-11-06 00:00:00
    Sell Price: 4638.47
    Updated Value: 15165.6

-------------------------

Buy Date: 
2014-12-09 00:00:00
Account Value: 15165.6
    Buy Price: 4766.47
    Num Shares: 3.0
    Remaining Value: 866.19
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 15854.13


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 15854.13





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-12-26 00:00:00
Account Value: 10000
    Buy Price: 1960.7
    Num Shares: 5.0
    Remaining Value: 196.5
Sell Date: 
2002-04-01 00:00:00
    Sell Price: 1862.62
    Updated Value: 9509.6

-------------------------

Buy Date: 
2002-12-06 00:00:00
Account Value: 9509.6
    Buy Price: 1422.44
    Num Shares: 6.0
    Remaining Value: 974.96
Sell Date: 
2003-03-19 00:00:00
    Sell Price: 1397.07
    Updated Value: 9357.38

-------------------------

Buy Date: 
2003-05-05 00:00:00
Account Value: 9357.38
    Buy Price: 1504.04
    Num Shares: 6.0
    Remaining Value: 333.14
Sell Date: 
2004-04-28 00:00:00
    Sell Price: 1989.54
    Updated Value: 12270.38

-------------------------

Buy Date: 
2004-11-04 00:00:00
Account Value: 12270.38
    Buy Price: 2023.63
    Num Shares: 6.0
    Remaining Value: 128.6
Sell Date: 
2005-04-05 00:00:00
    Sell Price: 1999.32
    Updated Value: 12124.52

-------------------------

Buy Date: 
2005-07-01 00:00:00
Account Value: 12124.52
    Buy Price: 2057.37
    Num Shares: 5.0
    Remaining Value: 1837.67
Sell Date: 
2005-11-11 00:00:00
    Sell Price: 2202.47
    Updated Value: 12850.02

-------------------------

Buy Date: 
2005-12-02 00:00:00
Account Value: 12850.02
    Buy Price: 2273.37
    Num Shares: 5.0
    Remaining Value: 1483.17
Sell Date: 
2006-06-12 00:00:00
    Sell Price: 2091.32
    Updated Value: 11939.77

-------------------------

Buy Date: 
2006-10-10 00:00:00
Account Value: 11939.77
    Buy Price: 2315.43
    Num Shares: 5.0
    Remaining Value: 362.62
Sell Date: 
2007-04-23 00:00:00
    Sell Price: 2523.67
    Updated Value: 12980.97

-------------------------

Buy Date: 
2007-05-01 00:00:00
Account Value: 12980.97
    Buy Price: 2531.53
    Num Shares: 5.0
    Remaining Value: 323.32
Sell Date: 
2007-09-21 00:00:00
    Sell Price: 2671.22
    Updated Value: 13679.42

-------------------------

Buy Date: 
2007-10-02 00:00:00
Account Value: 13679.42
    Buy Price: 2747.11
    Num Shares: 4.0
    Remaining Value: 2690.98
Sell Date: 
2008-01-04 00:00:00
    Sell Price: 2504.65
    Updated Value: 12709.58

-------------------------

Buy Date: 
2008-06-06 00:00:00
Account Value: 12709.58
    Buy Price: 2474.56
    Num Shares: 5.0
    Remaining Value: 336.78
Sell Date: 
2008-08-04 00:00:00
    Sell Price: 2285.56
    Updated Value: 11764.58

-------------------------

Buy Date: 
2009-05-04 00:00:00
Account Value: 11764.58
    Buy Price: 1763.56
    Num Shares: 6.0
    Remaining Value: 1183.22
Sell Date: 
2010-06-25 00:00:00
    Sell Price: 2223.48
    Updated Value: 14524.1

-------------------------

Buy Date: 
2010-10-20 00:00:00
Account Value: 14524.1
    Buy Price: 2457.39
    Num Shares: 5.0
    Remaining Value: 2237.15
Sell Date: 
2011-07-07 00:00:00
    Sell Price: 2872.66
    Updated Value: 16600.45

-------------------------

Buy Date: 
2011-12-05 00:00:00
Account Value: 16600.45
    Buy Price: 2655.76
    Num Shares: 6.0
    Remaining Value: 665.89
Sell Date: 
2011-12-27 00:00:00
    Sell Price: 2625.2
    Updated Value: 16417.09

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 16417.09
    Buy Price: 2605.15
    Num Shares: 6.0
    Remaining Value: 786.19
Sell Date: 
2012-01-03 00:00:00
    Sell Price: 2648.72
    Updated Value: 16678.51

-------------------------

Buy Date: 
2012-01-04 00:00:00
Account Value: 16678.51
    Buy Price: 2648.36
    Num Shares: 6.0
    Remaining Value: 788.35
Sell Date: 
2012-01-06 00:00:00
    Sell Price: 2674.22
    Updated Value: 16833.67

-------------------------

Buy Date: 
2012-01-09 00:00:00
Account Value: 16833.67
    Buy Price: 2676.56
    Num Shares: 6.0
    Remaining Value: 774.31
Sell Date: 
2012-06-26 00:00:00
    Sell Price: 2854.06
    Updated Value: 17898.67

-------------------------

Buy Date: 
2012-09-06 00:00:00
Account Value: 17898.67
    Buy Price: 3135.81
    Num Shares: 5.0
    Remaining Value: 2219.62
Sell Date: 
2012-12-10 00:00:00
    Sell Price: 2986.96
    Updated Value: 17154.42

-------------------------

Buy Date: 
2013-01-30 00:00:00
Account Value: 17154.42
    Buy Price: 3142.31
    Num Shares: 5.0
    Remaining Value: 1442.87
Sell Date: 
2014-05-20 00:00:00
    Sell Price: 4096.89
    Updated Value: 21927.32

-------------------------

Buy Date: 
2014-06-26 00:00:00
Account Value: 21927.32
    Buy Price: 4379.05
    Num Shares: 5.0
    Remaining Value: 32.07
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 25011.97


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 25011.97





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-12 00:00:00
Account Value: 10000
    Buy Price: 2169.95
    Num Shares: 4.0
    Remaining Value: 1320.2
Sell Date: 
2001-07-17 00:00:00
    Sell Price: 2067.32
    Updated Value: 9589.48

-------------------------

Buy Date: 
2002-01-10 00:00:00
Account Value: 9589.48
    Buy Price: 2047.24
    Num Shares: 4.0
    Remaining Value: 1400.52
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 1818.88
    Updated Value: 8676.04

-------------------------

Buy Date: 
2003-04-08 00:00:00
Account Value: 8676.04
    Buy Price: 1382.94
    Num Shares: 6.0
    Remaining Value: 378.4
Sell Date: 
2004-06-21 00:00:00
    Sell Price: 1974.38
    Updated Value: 12224.68

-------------------------

Buy Date: 
2004-11-22 00:00:00
Account Value: 12224.68
    Buy Price: 2085.19
    Num Shares: 5.0
    Remaining Value: 1798.73
Sell Date: 
2005-05-11 00:00:00
    Sell Price: 1971.55
    Updated Value: 11656.48

-------------------------

Buy Date: 
2005-06-27 00:00:00
Account Value: 11656.48
    Buy Price: 2045.2
    Num Shares: 5.0
    Remaining Value: 1430.48
Sell Date: 
2006-06-27 00:00:00
    Sell Price: 2100.25
    Updated Value: 11931.73

-------------------------

Buy Date: 
2006-10-24 00:00:00
Account Value: 11931.73
    Buy Price: 2344.84
    Num Shares: 5.0
    Remaining Value: 207.53
Sell Date: 
2008-01-22 00:00:00
    Sell Price: 2292.27
    Updated Value: 11668.88

-------------------------

Buy Date: 
2009-06-11 00:00:00
Account Value: 11668.88
    Buy Price: 1862.37
    Num Shares: 6.0
    Remaining Value: 494.66
Sell Date: 
2010-07-13 00:00:00
    Sell Price: 2242.03
    Updated Value: 13946.84

-------------------------

Buy Date: 
2010-10-21 00:00:00
Account Value: 13946.84
    Buy Price: 2459.67
    Num Shares: 5.0
    Remaining Value: 1648.49
Sell Date: 
2011-08-26 00:00:00
    Sell Price: 2479.85
    Updated Value: 14047.74

-------------------------

Buy Date: 
2012-02-08 00:00:00
Account Value: 14047.74
    Buy Price: 2915.86
    Num Shares: 4.0
    Remaining Value: 2384.3
Sell Date: 
2012-12-11 00:00:00
    Sell Price: 3022.3
    Updated Value: 14473.5

-------------------------

Buy Date: 
2013-01-11 00:00:00
Account Value: 14473.5
    Buy Price: 3125.63
    Num Shares: 4.0
    Remaining Value: 1970.98
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21954.9


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21954.9





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-06 00:00:00
Account Value: 10000
    Buy Price: 2217.73
    Num Shares: 4.0
    Remaining Value: 1129.08
Sell Date: 
2001-07-25 00:00:00
    Sell Price: 1984.32
    Updated Value: 9066.36

-------------------------

Buy Date: 
2003-05-06 00:00:00
Account Value: 9066.36
    Buy Price: 1523.71
    Num Shares: 5.0
    Remaining Value: 1447.81
Sell Date: 
2004-08-11 00:00:00
    Sell Price: 1782.42
    Updated Value: 10359.91

-------------------------

Buy Date: 
2004-11-26 00:00:00
Account Value: 10359.91
    Buy Price: 2101.97
    Num Shares: 4.0
    Remaining Value: 1952.03
Sell Date: 
2005-05-13 00:00:00
    Sell Price: 1976.78
    Updated Value: 9859.15

-------------------------

Buy Date: 
2005-06-10 00:00:00
Account Value: 9859.15
    Buy Price: 2063.0
    Num Shares: 4.0
    Remaining Value: 1607.15
Sell Date: 
2006-06-30 00:00:00
    Sell Price: 2172.09
    Updated Value: 10295.51

-------------------------

Buy Date: 
2006-10-20 00:00:00
Account Value: 10295.51
    Buy Price: 2342.3
    Num Shares: 4.0
    Remaining Value: 926.31
Sell Date: 
2008-02-04 00:00:00
    Sell Price: 2382.85
    Updated Value: 10457.71

-------------------------

Buy Date: 
2009-07-20 00:00:00
Account Value: 10457.71
    Buy Price: 1909.29
    Num Shares: 5.0
    Remaining Value: 911.26
Sell Date: 
2010-08-18 00:00:00
    Sell Price: 2215.7
    Updated Value: 11989.76

-------------------------

Buy Date: 
2010-10-14 00:00:00
Account Value: 11989.76
    Buy Price: 2435.38
    Num Shares: 4.0
    Remaining Value: 2248.24
Sell Date: 
2011-09-09 00:00:00
    Sell Price: 2467.99
    Updated Value: 12120.2

-------------------------

Buy Date: 
2012-02-13 00:00:00
Account Value: 12120.2
    Buy Price: 2931.39
    Num Shares: 4.0
    Remaining Value: 394.64
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20378.56


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20378.56





-----------------------------------------------------------------------
^IXIC Calculations, N = [40, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-04 00:00:00
Account Value: 10000
    Buy Price: 2155.93
    Num Shares: 4.0
    Remaining Value: 1376.28
Sell Date: 
2001-08-06 00:00:00
    Sell Price: 2034.26
    Updated Value: 9513.32

-------------------------

Buy Date: 
2003-05-30 00:00:00
Account Value: 9513.32
    Buy Price: 1595.91
    Num Shares: 5.0
    Remaining Value: 1533.77
Sell Date: 
2004-08-25 00:00:00
    Sell Price: 1860.72
    Updated Value: 10837.37

-------------------------

Buy Date: 
2004-11-19 00:00:00
Account Value: 10837.37
    Buy Price: 2070.63
    Num Shares: 5.0
    Remaining Value: 484.22
Sell Date: 
2005-05-11 00:00:00
    Sell Price: 1971.55
    Updated Value: 10341.97

-------------------------

Buy Date: 
2005-06-13 00:00:00
Account Value: 10341.97
    Buy Price: 2068.96
    Num Shares: 4.0
    Remaining Value: 2066.13
Sell Date: 
2006-07-10 00:00:00
    Sell Price: 2116.93
    Updated Value: 10533.85

-------------------------

Buy Date: 
2006-10-11 00:00:00
Account Value: 10533.85
    Buy Price: 2308.27
    Num Shares: 4.0
    Remaining Value: 1300.77
Sell Date: 
2008-02-07 00:00:00
    Sell Price: 2293.03
    Updated Value: 10472.89

-------------------------

Buy Date: 
2009-08-19 00:00:00
Account Value: 10472.89
    Buy Price: 1969.24
    Num Shares: 5.0
    Remaining Value: 626.69
Sell Date: 
2011-09-21 00:00:00
    Sell Price: 2538.19
    Updated Value: 13317.64

-------------------------

Buy Date: 
2012-02-13 00:00:00
Account Value: 13317.64
    Buy Price: 2931.39
    Num Shares: 4.0
    Remaining Value: 1592.08
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21576.0


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21576.0





-----------------------------------------------------------------------
^IXIC Calculations, N = [50, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-13 00:00:00
Account Value: 10000
    Buy Price: 2121.66
    Num Shares: 4.0
    Remaining Value: 1513.36
Sell Date: 
2001-08-01 00:00:00
    Sell Price: 2068.38
    Updated Value: 9786.88

-------------------------

Buy Date: 
2001-12-07 00:00:00
Account Value: 9786.88
    Buy Price: 2021.26
    Num Shares: 4.0
    Remaining Value: 1701.84
Sell Date: 
2002-03-01 00:00:00
    Sell Price: 1802.74
    Updated Value: 8912.8

-------------------------

Buy Date: 
2002-12-09 00:00:00
Account Value: 8912.8
    Buy Price: 1367.14
    Num Shares: 6.0
    Remaining Value: 709.96
Sell Date: 
2003-02-12 00:00:00
    Sell Price: 1278.97
    Updated Value: 8383.78

-------------------------

Buy Date: 
2003-04-29 00:00:00
Account Value: 8383.78
    Buy Price: 1471.3
    Num Shares: 5.0
    Remaining Value: 1027.28
Sell Date: 
2004-04-05 00:00:00
    Sell Price: 2079.12
    Updated Value: 11422.88

-------------------------

Buy Date: 
2004-06-08 00:00:00
Account Value: 11422.88
    Buy Price: 2023.53
    Num Shares: 5.0
    Remaining Value: 1305.23
Sell Date: 
2004-06-17 00:00:00
    Sell Price: 1983.67
    Updated Value: 11223.58

-------------------------

Buy Date: 
2004-08-02 00:00:00
Account Value: 11223.58
    Buy Price: 1892.09
    Num Shares: 5.0
    Remaining Value: 1763.13
Sell Date: 
2004-08-19 00:00:00
    Sell Price: 1819.89
    Updated Value: 10862.58

-------------------------

Buy Date: 
2004-10-25 00:00:00
Account Value: 10862.58
    Buy Price: 1914.04
    Num Shares: 5.0
    Remaining Value: 1292.38
Sell Date: 
2005-02-28 00:00:00
    Sell Price: 2051.72
    Updated Value: 11550.98

-------------------------

Buy Date: 
2005-06-28 00:00:00
Account Value: 11550.98
    Buy Price: 2069.89
    Num Shares: 5.0
    Remaining Value: 1201.53
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 2064.83
    Updated Value: 11525.68

-------------------------

Buy Date: 
2005-12-16 00:00:00
Account Value: 11525.68
    Buy Price: 2252.48
    Num Shares: 5.0
    Remaining Value: 263.28
Sell Date: 
2006-06-13 00:00:00
    Sell Price: 2072.47
    Updated Value: 10625.63

-------------------------

Buy Date: 
2006-09-27 00:00:00
Account Value: 10625.63
    Buy Price: 2263.39
    Num Shares: 4.0
    Remaining Value: 1572.07
Sell Date: 
2007-04-17 00:00:00
    Sell Price: 2516.95
    Updated Value: 11639.87

-------------------------

Buy Date: 
2007-05-18 00:00:00
Account Value: 11639.87
    Buy Price: 2558.45
    Num Shares: 4.0
    Remaining Value: 1406.07
Sell Date: 
2007-09-19 00:00:00
    Sell Price: 2666.48
    Updated Value: 12071.99

-------------------------

Buy Date: 
2007-10-25 00:00:00
Account Value: 12071.99
    Buy Price: 2750.86
    Num Shares: 4.0
    Remaining Value: 1068.55
Sell Date: 
2007-12-28 00:00:00
    Sell Price: 2674.46
    Updated Value: 11766.39

-------------------------

Buy Date: 
2008-05-16 00:00:00
Account Value: 11766.39
    Buy Price: 2528.85
    Num Shares: 4.0
    Remaining Value: 1650.99
Sell Date: 
2008-07-29 00:00:00
    Sell Price: 2319.62
    Updated Value: 10929.47

-------------------------

Buy Date: 
2008-10-01 00:00:00
Account Value: 10929.47
    Buy Price: 2069.4
    Num Shares: 5.0
    Remaining Value: 582.47
Sell Date: 
2008-10-15 00:00:00
    Sell Price: 1628.33
    Updated Value: 8724.12

-------------------------

Buy Date: 
2009-02-19 00:00:00
Account Value: 8724.12
    Buy Price: 1442.82
    Num Shares: 6.0
    Remaining Value: 67.2
Sell Date: 
2009-03-13 00:00:00
    Sell Price: 1431.5
    Updated Value: 8656.2

-------------------------

Buy Date: 
2009-05-08 00:00:00
Account Value: 8656.2
    Buy Price: 1739.0
    Num Shares: 4.0
    Remaining Value: 1700.2
Sell Date: 
2010-03-26 00:00:00
    Sell Price: 2395.13
    Updated Value: 11280.72

-------------------------

Buy Date: 
2010-04-14 00:00:00
Account Value: 11280.72
    Buy Price: 2504.86
    Num Shares: 4.0
    Remaining Value: 1261.28
Sell Date: 
2010-06-22 00:00:00
    Sell Price: 2261.8
    Updated Value: 10308.48

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 10308.48
    Buy Price: 2301.32
    Num Shares: 4.0
    Remaining Value: 1103.2
Sell Date: 
2011-05-02 00:00:00
    Sell Price: 2864.08
    Updated Value: 12559.52

-------------------------

Buy Date: 
2011-05-26 00:00:00
Account Value: 12559.52
    Buy Price: 2782.92
    Num Shares: 4.0
    Remaining Value: 1427.84
Sell Date: 
2011-07-11 00:00:00
    Sell Price: 2802.62
    Updated Value: 12638.32

-------------------------

Buy Date: 
2011-11-09 00:00:00
Account Value: 12638.32
    Buy Price: 2621.65
    Num Shares: 4.0
    Remaining Value: 2151.72
Sell Date: 
2012-01-23 00:00:00
    Sell Price: 2784.17
    Updated Value: 13288.4

-------------------------

Buy Date: 
2012-02-08 00:00:00
Account Value: 13288.4
    Buy Price: 2915.86
    Num Shares: 4.0
    Remaining Value: 1624.96
Sell Date: 
2012-06-07 00:00:00
    Sell Price: 2831.02
    Updated Value: 12949.04

-------------------------

Buy Date: 
2012-08-15 00:00:00
Account Value: 12949.04
    Buy Price: 3030.93
    Num Shares: 4.0
    Remaining Value: 825.32
Sell Date: 
2012-11-28 00:00:00
    Sell Price: 2991.78
    Updated Value: 12792.44

-------------------------

Buy Date: 
2013-01-29 00:00:00
Account Value: 12792.44
    Buy Price: 3153.66
    Num Shares: 4.0
    Remaining Value: 177.8
Sell Date: 
2014-05-16 00:00:00
    Sell Price: 4090.59
    Updated Value: 16540.16

-------------------------

Buy Date: 
2014-07-02 00:00:00
Account Value: 16540.16
    Buy Price: 4457.73
    Num Shares: 3.0
    Remaining Value: 3166.97
Sell Date: 
2014-11-19 00:00:00
    Sell Price: 4675.71
    Updated Value: 17194.1

-------------------------

Buy Date: 
2014-12-18 00:00:00
Account Value: 17194.1
    Buy Price: 4748.4
    Num Shares: 3.0
    Remaining Value: 2948.9
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 17936.84


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 17936.84





-----------------------------------------------------------------------
^IXIC Calculations, N = [50, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-13 00:00:00
Account Value: 10000
    Buy Price: 1982.25
    Num Shares: 5.0
    Remaining Value: 88.75
Sell Date: 
2001-08-17 00:00:00
    Sell Price: 1867.01
    Updated Value: 9423.8

-------------------------

Buy Date: 
2002-01-03 00:00:00
Account Value: 9423.8
    Buy Price: 2044.27
    Num Shares: 4.0
    Remaining Value: 1246.72
Sell Date: 
2002-04-04 00:00:00
    Sell Price: 1789.75
    Updated Value: 8405.72

-------------------------

Buy Date: 
2002-12-17 00:00:00
Account Value: 8405.72
    Buy Price: 1392.05
    Num Shares: 6.0
    Remaining Value: 53.42
Sell Date: 
2003-03-28 00:00:00
    Sell Price: 1369.6
    Updated Value: 8271.02

-------------------------

Buy Date: 
2003-05-13 00:00:00
Account Value: 8271.02
    Buy Price: 1539.68
    Num Shares: 5.0
    Remaining Value: 572.62
Sell Date: 
2004-05-05 00:00:00
    Sell Price: 1957.26
    Updated Value: 10358.92

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 10358.92
    Buy Price: 2094.09
    Num Shares: 4.0
    Remaining Value: 1982.56
Sell Date: 
2005-04-04 00:00:00
    Sell Price: 1991.07
    Updated Value: 9946.84

-------------------------

Buy Date: 
2005-07-12 00:00:00
Account Value: 9946.84
    Buy Price: 2143.15
    Num Shares: 4.0
    Remaining Value: 1374.24
Sell Date: 
2005-11-28 00:00:00
    Sell Price: 2239.37
    Updated Value: 10331.72

-------------------------

Buy Date: 
2005-12-01 00:00:00
Account Value: 10331.72
    Buy Price: 2267.17
    Num Shares: 4.0
    Remaining Value: 1263.04
Sell Date: 
2006-06-16 00:00:00
    Sell Price: 2129.95
    Updated Value: 9782.84

-------------------------

Buy Date: 
2006-10-18 00:00:00
Account Value: 9782.84
    Buy Price: 2337.15
    Num Shares: 4.0
    Remaining Value: 434.24
Sell Date: 
2007-05-07 00:00:00
    Sell Price: 2570.95
    Updated Value: 10718.04

-------------------------

Buy Date: 
2007-05-14 00:00:00
Account Value: 10718.04
    Buy Price: 2546.44
    Num Shares: 4.0
    Remaining Value: 532.28
Sell Date: 
2007-10-04 00:00:00
    Sell Price: 2733.57
    Updated Value: 11466.56

-------------------------

Buy Date: 
2007-10-10 00:00:00
Account Value: 11466.56
    Buy Price: 2811.61
    Num Shares: 4.0
    Remaining Value: 220.12
Sell Date: 
2008-01-16 00:00:00
    Sell Price: 2394.59
    Updated Value: 9798.48

-------------------------

Buy Date: 
2008-06-11 00:00:00
Account Value: 9798.48
    Buy Price: 2394.01
    Num Shares: 4.0
    Remaining Value: 222.44
Sell Date: 
2008-08-15 00:00:00
    Sell Price: 2452.52
    Updated Value: 10032.52

-------------------------

Buy Date: 
2009-05-11 00:00:00
Account Value: 10032.52
    Buy Price: 1731.24
    Num Shares: 5.0
    Remaining Value: 1376.32
Sell Date: 
2010-07-08 00:00:00
    Sell Price: 2175.4
    Updated Value: 12253.32

-------------------------

Buy Date: 
2010-10-25 00:00:00
Account Value: 12253.32
    Buy Price: 2490.85
    Num Shares: 4.0
    Remaining Value: 2289.92
Sell Date: 
2011-07-20 00:00:00
    Sell Price: 2814.23
    Updated Value: 13546.84

-------------------------

Buy Date: 
2011-12-19 00:00:00
Account Value: 13546.84
    Buy Price: 2523.14
    Num Shares: 5.0
    Remaining Value: 931.14
Sell Date: 
2012-07-02 00:00:00
    Sell Price: 2951.23
    Updated Value: 15687.29

-------------------------

Buy Date: 
2012-09-11 00:00:00
Account Value: 15687.29
    Buy Price: 3104.53
    Num Shares: 5.0
    Remaining Value: 164.64
Sell Date: 
2012-12-19 00:00:00
    Sell Price: 3044.36
    Updated Value: 15386.44

-------------------------

Buy Date: 
2013-02-12 00:00:00
Account Value: 15386.44
    Buy Price: 3186.49
    Num Shares: 4.0
    Remaining Value: 2640.48
Sell Date: 
2014-05-30 00:00:00
    Sell Price: 4242.62
    Updated Value: 19610.96

-------------------------

Buy Date: 
2014-07-03 00:00:00
Account Value: 19610.96
    Buy Price: 4485.93
    Num Shares: 4.0
    Remaining Value: 1667.24
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21651.16


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21651.16





-----------------------------------------------------------------------
^IXIC Calculations, N = [50, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-28 00:00:00
Account Value: 10000
    Buy Price: 2125.46
    Num Shares: 4.0
    Remaining Value: 1498.16
Sell Date: 
2001-07-02 00:00:00
    Sell Price: 2148.72
    Updated Value: 10093.04

-------------------------

Buy Date: 
2001-07-03 00:00:00
Account Value: 10093.04
    Buy Price: 2140.8
    Num Shares: 4.0
    Remaining Value: 1529.84
Sell Date: 
2001-07-17 00:00:00
    Sell Price: 2067.32
    Updated Value: 9799.12

-------------------------

Buy Date: 
2002-02-08 00:00:00
Account Value: 9799.12
    Buy Price: 1818.88
    Num Shares: 5.0
    Remaining Value: 704.72
Sell Date: 
2002-02-20 00:00:00
    Sell Price: 1775.57
    Updated Value: 9582.57

-------------------------

Buy Date: 
2003-03-21 00:00:00
Account Value: 9582.57
    Buy Price: 1421.84
    Num Shares: 6.0
    Remaining Value: 1051.53
Sell Date: 
2003-03-24 00:00:00
    Sell Price: 1369.78
    Updated Value: 9270.21

-------------------------

Buy Date: 
2003-04-14 00:00:00
Account Value: 9270.21
    Buy Price: 1384.95
    Num Shares: 6.0
    Remaining Value: 960.51
Sell Date: 
2004-07-01 00:00:00
    Sell Price: 2015.55
    Updated Value: 13053.81

-------------------------

Buy Date: 
2004-11-30 00:00:00
Account Value: 13053.81
    Buy Price: 2096.81
    Num Shares: 6.0
    Remaining Value: 472.95
Sell Date: 
2005-05-20 00:00:00
    Sell Price: 2046.42
    Updated Value: 12751.47

-------------------------

Buy Date: 
2005-07-13 00:00:00
Account Value: 12751.47
    Buy Price: 2144.11
    Num Shares: 5.0
    Remaining Value: 2030.92
Sell Date: 
2006-07-07 00:00:00
    Sell Price: 2130.06
    Updated Value: 12681.22

-------------------------

Buy Date: 
2006-11-01 00:00:00
Account Value: 12681.22
    Buy Price: 2334.35
    Num Shares: 5.0
    Remaining Value: 1009.47
Sell Date: 
2008-01-23 00:00:00
    Sell Price: 2316.41
    Updated Value: 12591.52

-------------------------

Buy Date: 
2009-06-15 00:00:00
Account Value: 12591.52
    Buy Price: 1816.38
    Num Shares: 6.0
    Remaining Value: 1693.24
Sell Date: 
2010-07-23 00:00:00
    Sell Price: 2269.47
    Updated Value: 15310.06

-------------------------

Buy Date: 
2010-11-01 00:00:00
Account Value: 15310.06
    Buy Price: 2504.84
    Num Shares: 6.0
    Remaining Value: 281.02
Sell Date: 
2011-08-19 00:00:00
    Sell Price: 2341.84
    Updated Value: 14332.06

-------------------------

Buy Date: 
2012-02-10 00:00:00
Account Value: 14332.06
    Buy Price: 2903.88
    Num Shares: 4.0
    Remaining Value: 2716.54
Sell Date: 
2012-12-26 00:00:00
    Sell Price: 2990.16
    Updated Value: 14677.18

-------------------------

Buy Date: 
2013-01-16 00:00:00
Account Value: 14677.18
    Buy Price: 3117.54
    Num Shares: 4.0
    Remaining Value: 2207.02
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 22190.94


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 22190.94





-----------------------------------------------------------------------
^IXIC Calculations, N = [50, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-19 00:00:00
Account Value: 10000
    Buy Price: 1992.66
    Num Shares: 5.0
    Remaining Value: 36.7
Sell Date: 
2001-08-06 00:00:00
    Sell Price: 2034.26
    Updated Value: 10208.0

-------------------------

Buy Date: 
2003-05-13 00:00:00
Account Value: 10208.0
    Buy Price: 1539.68
    Num Shares: 6.0
    Remaining Value: 969.92
Sell Date: 
2004-08-16 00:00:00
    Sell Price: 1782.84
    Updated Value: 11666.96

-------------------------

Buy Date: 
2004-12-07 00:00:00
Account Value: 11666.96
    Buy Price: 2114.66
    Num Shares: 5.0
    Remaining Value: 1093.66
Sell Date: 
2006-07-11 00:00:00
    Sell Price: 2128.86
    Updated Value: 11737.96

-------------------------

Buy Date: 
2006-10-31 00:00:00
Account Value: 11737.96
    Buy Price: 2366.71
    Num Shares: 4.0
    Remaining Value: 2271.12
Sell Date: 
2008-02-08 00:00:00
    Sell Price: 2304.85
    Updated Value: 11490.52

-------------------------

Buy Date: 
2009-07-24 00:00:00
Account Value: 11490.52
    Buy Price: 1965.96
    Num Shares: 5.0
    Remaining Value: 1660.72
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 2118.69
    Updated Value: 12254.17

-------------------------

Buy Date: 
2010-09-29 00:00:00
Account Value: 12254.17
    Buy Price: 2376.56
    Num Shares: 5.0
    Remaining Value: 371.37
Sell Date: 
2010-10-06 00:00:00
    Sell Price: 2380.66
    Updated Value: 12274.67

-------------------------

Buy Date: 
2010-10-08 00:00:00
Account Value: 12274.67
    Buy Price: 2401.91
    Num Shares: 5.0
    Remaining Value: 265.12
Sell Date: 
2011-09-19 00:00:00
    Sell Price: 2612.83
    Updated Value: 13329.27

-------------------------

Buy Date: 
2012-02-16 00:00:00
Account Value: 13329.27
    Buy Price: 2959.85
    Num Shares: 4.0
    Remaining Value: 1489.87
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21473.79


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21473.79





-----------------------------------------------------------------------
^IXIC Calculations, N = [50, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-14 00:00:00
Account Value: 10000
    Buy Price: 2044.07
    Num Shares: 4.0
    Remaining Value: 1823.72
Sell Date: 
2001-08-16 00:00:00
    Sell Price: 1930.32
    Updated Value: 9545.0

-------------------------

Buy Date: 
2003-06-05 00:00:00
Account Value: 9545.0
    Buy Price: 1646.01
    Num Shares: 5.0
    Remaining Value: 1314.95
Sell Date: 
2004-09-03 00:00:00
    Sell Price: 1844.48
    Updated Value: 10537.35

-------------------------

Buy Date: 
2004-11-30 00:00:00
Account Value: 10537.35
    Buy Price: 2096.81
    Num Shares: 5.0
    Remaining Value: 53.3
Sell Date: 
2006-07-19 00:00:00
    Sell Price: 2080.71
    Updated Value: 10456.85

-------------------------

Buy Date: 
2006-10-20 00:00:00
Account Value: 10456.85
    Buy Price: 2342.3
    Num Shares: 4.0
    Remaining Value: 1087.65
Sell Date: 
2008-02-14 00:00:00
    Sell Price: 2332.54
    Updated Value: 10417.81

-------------------------

Buy Date: 
2009-08-24 00:00:00
Account Value: 10417.81
    Buy Price: 2017.98
    Num Shares: 5.0
    Remaining Value: 327.91
Sell Date: 
2011-10-03 00:00:00
    Sell Price: 2335.83
    Updated Value: 12007.06

-------------------------

Buy Date: 
2012-02-17 00:00:00
Account Value: 12007.06
    Buy Price: 2951.78
    Num Shares: 4.0
    Remaining Value: 199.94
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20183.86


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20183.86





-----------------------------------------------------------------------
^IXIC Calculations, N = [60, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-19 00:00:00
Account Value: 10000
    Buy Price: 1992.66
    Num Shares: 5.0
    Remaining Value: 36.7
Sell Date: 
2001-08-03 00:00:00
    Sell Price: 2066.33
    Updated Value: 10368.35

-------------------------

Buy Date: 
2001-08-07 00:00:00
Account Value: 10368.35
    Buy Price: 2027.79
    Num Shares: 5.0
    Remaining Value: 229.4
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 1963.32
    Updated Value: 10046.0

-------------------------

Buy Date: 
2001-12-17 00:00:00
Account Value: 10046.0
    Buy Price: 1987.45
    Num Shares: 5.0
    Remaining Value: 108.75
Sell Date: 
2002-03-08 00:00:00
    Sell Price: 1929.67
    Updated Value: 9757.1

-------------------------

Buy Date: 
2002-05-23 00:00:00
Account Value: 9757.1
    Buy Price: 1697.63
    Num Shares: 5.0
    Remaining Value: 1268.95
Sell Date: 
2002-05-31 00:00:00
    Sell Price: 1615.73
    Updated Value: 9347.6

-------------------------

Buy Date: 
2002-10-31 00:00:00
Account Value: 9347.6
    Buy Price: 1329.75
    Num Shares: 7.0
    Remaining Value: 39.35
Sell Date: 
2002-11-08 00:00:00
    Sell Price: 1359.28
    Updated Value: 9554.31

-------------------------

Buy Date: 
2002-12-16 00:00:00
Account Value: 9554.31
    Buy Price: 1400.33
    Num Shares: 6.0
    Remaining Value: 1152.33
Sell Date: 
2003-02-21 00:00:00
    Sell Price: 1349.02
    Updated Value: 9246.45

-------------------------

Buy Date: 
2003-05-05 00:00:00
Account Value: 9246.45
    Buy Price: 1504.04
    Num Shares: 6.0
    Remaining Value: 222.21
Sell Date: 
2004-04-14 00:00:00
    Sell Price: 2024.85
    Updated Value: 12371.31

-------------------------

Buy Date: 
2004-06-18 00:00:00
Account Value: 12371.31
    Buy Price: 1986.73
    Num Shares: 6.0
    Remaining Value: 450.93
Sell Date: 
2004-07-06 00:00:00
    Sell Price: 1963.43
    Updated Value: 12231.51

-------------------------

Buy Date: 
2004-08-12 00:00:00
Account Value: 12231.51
    Buy Price: 1752.49
    Num Shares: 6.0
    Remaining Value: 1716.57
Sell Date: 
2004-08-31 00:00:00
    Sell Price: 1838.1
    Updated Value: 12745.17

-------------------------

Buy Date: 
2004-11-02 00:00:00
Account Value: 12745.17
    Buy Price: 1984.79
    Num Shares: 6.0
    Remaining Value: 836.43
Sell Date: 
2005-03-07 00:00:00
    Sell Price: 2090.21
    Updated Value: 13377.69

-------------------------

Buy Date: 
2005-07-08 00:00:00
Account Value: 13377.69
    Buy Price: 2112.88
    Num Shares: 6.0
    Remaining Value: 700.41
Sell Date: 
2005-10-20 00:00:00
    Sell Price: 2068.11
    Updated Value: 13109.07

-------------------------

Buy Date: 
2005-12-22 00:00:00
Account Value: 13109.07
    Buy Price: 2246.49
    Num Shares: 5.0
    Remaining Value: 1876.62
Sell Date: 
2006-04-24 00:00:00
    Sell Price: 2333.38
    Updated Value: 13543.52

-------------------------

Buy Date: 
2006-05-01 00:00:00
Account Value: 13543.52
    Buy Price: 2304.79
    Num Shares: 5.0
    Remaining Value: 2019.57
Sell Date: 
2006-06-21 00:00:00
    Sell Price: 2141.2
    Updated Value: 12725.57

-------------------------

Buy Date: 
2006-09-22 00:00:00
Account Value: 12725.57
    Buy Price: 2218.93
    Num Shares: 5.0
    Remaining Value: 1630.92
Sell Date: 
2006-09-25 00:00:00
    Sell Price: 2249.07
    Updated Value: 12876.27

-------------------------

Buy Date: 
2006-10-10 00:00:00
Account Value: 12876.27
    Buy Price: 2315.43
    Num Shares: 5.0
    Remaining Value: 1299.12
Sell Date: 
2007-04-16 00:00:00
    Sell Price: 2518.33
    Updated Value: 13890.77

-------------------------

Buy Date: 
2007-05-03 00:00:00
Account Value: 13890.77
    Buy Price: 2565.46
    Num Shares: 5.0
    Remaining Value: 1063.47
Sell Date: 
2007-05-04 00:00:00
    Sell Price: 2572.15
    Updated Value: 13924.22

-------------------------

Buy Date: 
2007-05-31 00:00:00
Account Value: 13924.22
    Buy Price: 2604.52
    Num Shares: 5.0
    Remaining Value: 901.62
Sell Date: 
2007-09-28 00:00:00
    Sell Price: 2701.5
    Updated Value: 14409.12

-------------------------

Buy Date: 
2007-10-31 00:00:00
Account Value: 14409.12
    Buy Price: 2859.12
    Num Shares: 5.0
    Remaining Value: 113.52
Sell Date: 
2008-01-07 00:00:00
    Sell Price: 2499.46
    Updated Value: 12610.82

-------------------------

Buy Date: 
2008-05-20 00:00:00
Account Value: 12610.82
    Buy Price: 2492.26
    Num Shares: 5.0
    Remaining Value: 149.52
Sell Date: 
2008-05-23 00:00:00
    Sell Price: 2444.67
    Updated Value: 12372.87

-------------------------

Buy Date: 
2008-05-27 00:00:00
Account Value: 12372.87
    Buy Price: 2481.24
    Num Shares: 4.0
    Remaining Value: 2447.91
Sell Date: 
2008-08-01 00:00:00
    Sell Price: 2310.96
    Updated Value: 11691.75

-------------------------

Buy Date: 
2008-10-07 00:00:00
Account Value: 11691.75
    Buy Price: 1754.88
    Num Shares: 6.0
    Remaining Value: 1162.47
Sell Date: 
2008-10-20 00:00:00
    Sell Price: 1770.03
    Updated Value: 11782.65

-------------------------

Buy Date: 
2009-02-24 00:00:00
Account Value: 11782.65
    Buy Price: 1441.83
    Num Shares: 8.0
    Remaining Value: 248.01
Sell Date: 
2009-03-17 00:00:00
    Sell Price: 1462.11
    Updated Value: 11944.89

-------------------------

Buy Date: 
2009-05-19 00:00:00
Account Value: 11944.89
    Buy Price: 1734.54
    Num Shares: 6.0
    Remaining Value: 1537.65
Sell Date: 
2010-04-06 00:00:00
    Sell Price: 2436.81
    Updated Value: 16158.51

-------------------------

Buy Date: 
2010-04-23 00:00:00
Account Value: 16158.51
    Buy Price: 2530.15
    Num Shares: 6.0
    Remaining Value: 977.61
Sell Date: 
2010-06-28 00:00:00
    Sell Price: 2220.65
    Updated Value: 14301.51

-------------------------

Buy Date: 
2010-09-03 00:00:00
Account Value: 14301.51
    Buy Price: 2233.75
    Num Shares: 6.0
    Remaining Value: 899.01
Sell Date: 
2010-09-07 00:00:00
    Sell Price: 2208.89
    Updated Value: 14152.35

-------------------------

Buy Date: 
2010-09-29 00:00:00
Account Value: 14152.35
    Buy Price: 2376.56
    Num Shares: 5.0
    Remaining Value: 2269.55
Sell Date: 
2011-05-12 00:00:00
    Sell Price: 2863.04
    Updated Value: 16584.75

-------------------------

Buy Date: 
2011-06-07 00:00:00
Account Value: 16584.75
    Buy Price: 2701.56
    Num Shares: 6.0
    Remaining Value: 375.39
Sell Date: 
2011-07-22 00:00:00
    Sell Price: 2858.83
    Updated Value: 17528.37

-------------------------

Buy Date: 
2011-09-15 00:00:00
Account Value: 17528.37
    Buy Price: 2607.07
    Num Shares: 6.0
    Remaining Value: 1885.95
Sell Date: 
2011-09-26 00:00:00
    Sell Price: 2516.69
    Updated Value: 16986.09

-------------------------

Buy Date: 
2011-11-14 00:00:00
Account Value: 16986.09
    Buy Price: 2657.22
    Num Shares: 6.0
    Remaining Value: 1042.77
Sell Date: 
2012-01-26 00:00:00
    Sell Price: 2805.28
    Updated Value: 17874.45

-------------------------

Buy Date: 
2012-02-17 00:00:00
Account Value: 17874.45
    Buy Price: 2951.78
    Num Shares: 6.0
    Remaining Value: 163.77
Sell Date: 
2012-06-15 00:00:00
    Sell Price: 2872.8
    Updated Value: 17400.57

-------------------------

Buy Date: 
2012-08-21 00:00:00
Account Value: 17400.57
    Buy Price: 3067.26
    Num Shares: 5.0
    Remaining Value: 2064.27
Sell Date: 
2012-12-05 00:00:00
    Sell Price: 2973.7
    Updated Value: 16932.77

-------------------------

Buy Date: 
2013-02-06 00:00:00
Account Value: 16932.77
    Buy Price: 3168.48
    Num Shares: 5.0
    Remaining Value: 1090.37
Sell Date: 
2014-05-23 00:00:00
    Sell Price: 4185.81
    Updated Value: 22019.42

-------------------------

Buy Date: 
2014-07-09 00:00:00
Account Value: 22019.42
    Buy Price: 4419.03
    Num Shares: 4.0
    Remaining Value: 4343.3
Sell Date: 
2014-11-25 00:00:00
    Sell Price: 4758.25
    Updated Value: 23376.3

-------------------------

Buy Date: 
2014-12-29 00:00:00
Account Value: 23376.3
    Buy Price: 4806.91
    Num Shares: 4.0
    Remaining Value: 4148.66
Sell Date: 
2015-03-05 00:00:00
    Sell Price: 4982.81
    Updated Value: 24079.9

-------------------------

Buy Date: 
2015-03-13 00:00:00
Account Value: 24079.9
    Buy Price: 4871.76
    Num Shares: 4.0
    Remaining Value: 4592.86
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 24576.78


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 24576.78





-----------------------------------------------------------------------
^IXIC Calculations, N = [60, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-03 00:00:00
Account Value: 10000
    Buy Price: 2066.33
    Num Shares: 4.0
    Remaining Value: 1734.68
Sell Date: 
2001-09-05 00:00:00
    Sell Price: 1759.01
    Updated Value: 8770.72

-------------------------

Buy Date: 
2002-01-10 00:00:00
Account Value: 8770.72
    Buy Price: 2047.24
    Num Shares: 4.0
    Remaining Value: 581.76
Sell Date: 
2002-04-11 00:00:00
    Sell Price: 1725.24
    Updated Value: 7482.72

-------------------------

Buy Date: 
2002-12-27 00:00:00
Account Value: 7482.72
    Buy Price: 1348.31
    Num Shares: 5.0
    Remaining Value: 741.17
Sell Date: 
2003-04-07 00:00:00
    Sell Price: 1389.51
    Updated Value: 7688.72

-------------------------

Buy Date: 
2003-05-21 00:00:00
Account Value: 7688.72
    Buy Price: 1489.87
    Num Shares: 5.0
    Remaining Value: 239.37
Sell Date: 
2004-05-12 00:00:00
    Sell Price: 1925.59
    Updated Value: 9867.32

-------------------------

Buy Date: 
2004-11-23 00:00:00
Account Value: 9867.32
    Buy Price: 2084.28
    Num Shares: 4.0
    Remaining Value: 1530.2
Sell Date: 
2005-04-08 00:00:00
    Sell Price: 1999.35
    Updated Value: 9527.6

-------------------------

Buy Date: 
2005-07-21 00:00:00
Account Value: 9527.6
    Buy Price: 2178.6
    Num Shares: 4.0
    Remaining Value: 813.2
Sell Date: 
2006-06-23 00:00:00
    Sell Price: 2121.47
    Updated Value: 9299.08

-------------------------

Buy Date: 
2006-10-24 00:00:00
Account Value: 9299.08
    Buy Price: 2344.84
    Num Shares: 3.0
    Remaining Value: 2264.56
Sell Date: 
2008-01-28 00:00:00
    Sell Price: 2349.91
    Updated Value: 9314.29

-------------------------

Buy Date: 
2008-06-18 00:00:00
Account Value: 9314.29
    Buy Price: 2429.71
    Num Shares: 3.0
    Remaining Value: 2025.16
Sell Date: 
2008-08-28 00:00:00
    Sell Price: 2411.64
    Updated Value: 9260.08

-------------------------

Buy Date: 
2009-05-19 00:00:00
Account Value: 9260.08
    Buy Price: 1734.54
    Num Shares: 5.0
    Remaining Value: 587.38
Sell Date: 
2010-07-20 00:00:00
    Sell Price: 2222.49
    Updated Value: 11699.83

-------------------------

Buy Date: 
2010-10-25 00:00:00
Account Value: 11699.83
    Buy Price: 2490.85
    Num Shares: 4.0
    Remaining Value: 1736.43
Sell Date: 
2011-08-01 00:00:00
    Sell Price: 2744.61
    Updated Value: 12714.87

-------------------------

Buy Date: 
2011-12-30 00:00:00
Account Value: 12714.87
    Buy Price: 2605.15
    Num Shares: 4.0
    Remaining Value: 2294.27
Sell Date: 
2012-07-10 00:00:00
    Sell Price: 2902.33
    Updated Value: 13903.59

-------------------------

Buy Date: 
2012-09-18 00:00:00
Account Value: 13903.59
    Buy Price: 3177.8
    Num Shares: 4.0
    Remaining Value: 1192.39
Sell Date: 
2012-12-28 00:00:00
    Sell Price: 2960.31
    Updated Value: 13033.63

-------------------------

Buy Date: 
2013-02-22 00:00:00
Account Value: 13033.63
    Buy Price: 3161.82
    Num Shares: 4.0
    Remaining Value: 386.35
Sell Date: 
2014-06-11 00:00:00
    Sell Price: 4331.93
    Updated Value: 17714.07

-------------------------

Buy Date: 
2014-07-15 00:00:00
Account Value: 17714.07
    Buy Price: 4416.39
    Num Shares: 4.0
    Remaining Value: 48.51
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20032.43


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20032.43





-----------------------------------------------------------------------
^IXIC Calculations, N = [60, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-02-26 00:00:00
Account Value: 10000
    Buy Price: 1766.86
    Num Shares: 5.0
    Remaining Value: 1165.7
Sell Date: 
2002-03-07 00:00:00
    Sell Price: 1881.63
    Updated Value: 10573.85

-------------------------

Buy Date: 
2002-03-13 00:00:00
Account Value: 10573.85
    Buy Price: 1862.03
    Num Shares: 5.0
    Remaining Value: 1263.7
Sell Date: 
2002-04-05 00:00:00
    Sell Price: 1770.03
    Updated Value: 10113.85

-------------------------

Buy Date: 
2003-03-18 00:00:00
Account Value: 10113.85
    Buy Price: 1400.55
    Num Shares: 7.0
    Remaining Value: 310.0
Sell Date: 
2004-07-12 00:00:00
    Sell Price: 1936.92
    Updated Value: 13868.44

-------------------------

Buy Date: 
2004-12-03 00:00:00
Account Value: 13868.44
    Buy Price: 2147.96
    Num Shares: 6.0
    Remaining Value: 980.68
Sell Date: 
2005-06-01 00:00:00
    Sell Price: 2087.86
    Updated Value: 13507.84

-------------------------

Buy Date: 
2005-07-26 00:00:00
Account Value: 13507.84
    Buy Price: 2175.99
    Num Shares: 6.0
    Remaining Value: 451.9
Sell Date: 
2006-07-14 00:00:00
    Sell Price: 2037.35
    Updated Value: 12676.0

-------------------------

Buy Date: 
2006-11-08 00:00:00
Account Value: 12676.0
    Buy Price: 2384.94
    Num Shares: 5.0
    Remaining Value: 751.3
Sell Date: 
2008-01-31 00:00:00
    Sell Price: 2389.86
    Updated Value: 12700.6

-------------------------

Buy Date: 
2009-06-19 00:00:00
Account Value: 12700.6
    Buy Price: 1827.47
    Num Shares: 6.0
    Remaining Value: 1735.78
Sell Date: 
2010-08-04 00:00:00
    Sell Price: 2303.57
    Updated Value: 15557.2

-------------------------

Buy Date: 
2010-11-08 00:00:00
Account Value: 15557.2
    Buy Price: 2580.05
    Num Shares: 6.0
    Remaining Value: 76.9
Sell Date: 
2011-08-23 00:00:00
    Sell Price: 2446.06
    Updated Value: 14753.26

-------------------------

Buy Date: 
2012-02-17 00:00:00
Account Value: 14753.26
    Buy Price: 2951.78
    Num Shares: 4.0
    Remaining Value: 2946.14
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 22930.06


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 22930.06





-----------------------------------------------------------------------
^IXIC Calculations, N = [60, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-03 00:00:00
Account Value: 10000
    Buy Price: 2140.8
    Num Shares: 4.0
    Remaining Value: 1436.8
Sell Date: 
2001-08-16 00:00:00
    Sell Price: 1930.32
    Updated Value: 9158.08

-------------------------

Buy Date: 
2003-05-15 00:00:00
Account Value: 9158.08
    Buy Price: 1551.38
    Num Shares: 5.0
    Remaining Value: 1401.18
Sell Date: 
2004-08-13 00:00:00
    Sell Price: 1757.22
    Updated Value: 10187.28

-------------------------

Buy Date: 
2004-12-15 00:00:00
Account Value: 10187.28
    Buy Price: 2162.55
    Num Shares: 4.0
    Remaining Value: 1537.08
Sell Date: 
2006-07-20 00:00:00
    Sell Price: 2039.42
    Updated Value: 9694.76

-------------------------

Buy Date: 
2006-11-09 00:00:00
Account Value: 9694.76
    Buy Price: 2376.01
    Num Shares: 4.0
    Remaining Value: 190.72
Sell Date: 
2008-02-11 00:00:00
    Sell Price: 2320.06
    Updated Value: 9470.96

-------------------------

Buy Date: 
2009-07-28 00:00:00
Account Value: 9470.96
    Buy Price: 1975.51
    Num Shares: 4.0
    Remaining Value: 1568.92
Sell Date: 
2010-08-27 00:00:00
    Sell Price: 2153.63
    Updated Value: 10183.44

-------------------------

Buy Date: 
2010-10-11 00:00:00
Account Value: 10183.44
    Buy Price: 2402.33
    Num Shares: 4.0
    Remaining Value: 574.12
Sell Date: 
2011-09-26 00:00:00
    Sell Price: 2516.69
    Updated Value: 10640.88

-------------------------

Buy Date: 
2012-02-24 00:00:00
Account Value: 10640.88
    Buy Price: 2963.75
    Num Shares: 3.0
    Remaining Value: 1749.63
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 16737.57


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 16737.57





-----------------------------------------------------------------------
^IXIC Calculations, N = [60, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-28 00:00:00
Account Value: 10000
    Buy Price: 2125.46
    Num Shares: 4.0
    Remaining Value: 1498.16
Sell Date: 
2001-08-23 00:00:00
    Sell Price: 1842.97
    Updated Value: 8870.04

-------------------------

Buy Date: 
2003-06-09 00:00:00
Account Value: 8870.04
    Buy Price: 1603.97
    Num Shares: 5.0
    Remaining Value: 850.19
Sell Date: 
2004-09-13 00:00:00
    Sell Price: 1910.38
    Updated Value: 10402.09

-------------------------

Buy Date: 
2004-12-07 00:00:00
Account Value: 10402.09
    Buy Price: 2114.66
    Num Shares: 4.0
    Remaining Value: 1943.45
Sell Date: 
2006-07-27 00:00:00
    Sell Price: 2054.47
    Updated Value: 10161.33

-------------------------

Buy Date: 
2006-11-01 00:00:00
Account Value: 10161.33
    Buy Price: 2334.35
    Num Shares: 4.0
    Remaining Value: 823.93
Sell Date: 
2008-02-21 00:00:00
    Sell Price: 2299.78
    Updated Value: 10023.05

-------------------------

Buy Date: 
2009-08-25 00:00:00
Account Value: 10023.05
    Buy Price: 2024.23
    Num Shares: 4.0
    Remaining Value: 1926.13
Sell Date: 
2011-10-13 00:00:00
    Sell Price: 2620.24
    Updated Value: 12407.09

-------------------------

Buy Date: 
2012-02-24 00:00:00
Account Value: 12407.09
    Buy Price: 2963.75
    Num Shares: 4.0
    Remaining Value: 552.09
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20536.01


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20536.01





-----------------------------------------------------------------------
^IXIC Calculations, N = [80, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-06 00:00:00
Account Value: 10000
    Buy Price: 2034.26
    Num Shares: 4.0
    Remaining Value: 1862.96
Sell Date: 
2001-09-26 00:00:00
    Sell Price: 1464.04
    Updated Value: 7719.12

-------------------------

Buy Date: 
2002-01-29 00:00:00
Account Value: 7719.12
    Buy Price: 1892.99
    Num Shares: 4.0
    Remaining Value: 147.16
Sell Date: 
2002-04-25 00:00:00
    Sell Price: 1713.7
    Updated Value: 7001.96

-------------------------

Buy Date: 
2003-01-15 00:00:00
Account Value: 7001.96
    Buy Price: 1438.8
    Num Shares: 4.0
    Remaining Value: 1246.76
Sell Date: 
2003-04-10 00:00:00
    Sell Price: 1365.61
    Updated Value: 6709.2

-------------------------

Buy Date: 
2003-06-04 00:00:00
Account Value: 6709.2
    Buy Price: 1634.65
    Num Shares: 4.0
    Remaining Value: 170.6
Sell Date: 
2004-05-25 00:00:00
    Sell Price: 1964.65
    Updated Value: 8029.2

-------------------------

Buy Date: 
2004-12-08 00:00:00
Account Value: 8029.2
    Buy Price: 2126.11
    Num Shares: 3.0
    Remaining Value: 1650.87
Sell Date: 
2005-04-20 00:00:00
    Sell Price: 1913.76
    Updated Value: 7392.15

-------------------------

Buy Date: 
2005-08-09 00:00:00
Account Value: 7392.15
    Buy Price: 2174.19
    Num Shares: 3.0
    Remaining Value: 869.58
Sell Date: 
2005-12-29 00:00:00
    Sell Price: 2218.16
    Updated Value: 7524.06

-------------------------

Buy Date: 
2006-01-18 00:00:00
Account Value: 7524.06
    Buy Price: 2279.64
    Num Shares: 3.0
    Remaining Value: 685.14
Sell Date: 
2006-06-27 00:00:00
    Sell Price: 2100.25
    Updated Value: 6985.89

-------------------------

Buy Date: 
2006-11-06 00:00:00
Account Value: 6985.89
    Buy Price: 2365.95
    Num Shares: 2.0
    Remaining Value: 2253.99
Sell Date: 
2008-02-13 00:00:00
    Sell Price: 2373.93
    Updated Value: 7001.85

-------------------------

Buy Date: 
2008-07-01 00:00:00
Account Value: 7001.85
    Buy Price: 2304.97
    Num Shares: 3.0
    Remaining Value: 86.94
Sell Date: 
2008-09-15 00:00:00
    Sell Price: 2179.91
    Updated Value: 6626.67

-------------------------

Buy Date: 
2009-05-18 00:00:00
Account Value: 6626.67
    Buy Price: 1732.36
    Num Shares: 3.0
    Remaining Value: 1429.59
Sell Date: 
2009-05-22 00:00:00
    Sell Price: 1692.01
    Updated Value: 6505.62

-------------------------

Buy Date: 
2009-06-01 00:00:00
Account Value: 6505.62
    Buy Price: 1828.68
    Num Shares: 3.0
    Remaining Value: 1019.58
Sell Date: 
2009-06-02 00:00:00
    Sell Price: 1836.8
    Updated Value: 6529.98

-------------------------

Buy Date: 
2009-06-10 00:00:00
Account Value: 6529.98
    Buy Price: 1853.08
    Num Shares: 3.0
    Remaining Value: 970.74
Sell Date: 
2010-08-09 00:00:00
    Sell Price: 2305.69
    Updated Value: 7887.81

-------------------------

Buy Date: 
2010-10-28 00:00:00
Account Value: 7887.81
    Buy Price: 2507.37
    Num Shares: 3.0
    Remaining Value: 365.7
Sell Date: 
2011-08-22 00:00:00
    Sell Price: 2345.38
    Updated Value: 7401.84

-------------------------

Buy Date: 
2012-01-17 00:00:00
Account Value: 7401.84
    Buy Price: 2728.08
    Num Shares: 2.0
    Remaining Value: 1945.68
Sell Date: 
2012-07-24 00:00:00
    Sell Price: 2862.99
    Updated Value: 7671.66

-------------------------

Buy Date: 
2012-10-01 00:00:00
Account Value: 7671.66
    Buy Price: 3113.53
    Num Shares: 2.0
    Remaining Value: 1444.6
Sell Date: 
2013-01-18 00:00:00
    Sell Price: 3134.71
    Updated Value: 7714.02

-------------------------

Buy Date: 
2013-03-15 00:00:00
Account Value: 7714.02
    Buy Price: 3249.07
    Num Shares: 2.0
    Remaining Value: 1215.88
Sell Date: 
2014-07-07 00:00:00
    Sell Price: 4451.53
    Updated Value: 10118.94

-------------------------

Buy Date: 
2014-08-12 00:00:00
Account Value: 10118.94
    Buy Price: 4389.25
    Num Shares: 2.0
    Remaining Value: 1340.44
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 11332.4


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 11332.4





-----------------------------------------------------------------------
^IXIC Calculations, N = [80, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-03-11 00:00:00
Account Value: 10000
    Buy Price: 1929.49
    Num Shares: 5.0
    Remaining Value: 352.55
Sell Date: 
2002-05-08 00:00:00
    Sell Price: 1696.29
    Updated Value: 8834.0

-------------------------

Buy Date: 
2003-03-03 00:00:00
Account Value: 8834.0
    Buy Price: 1320.29
    Num Shares: 6.0
    Remaining Value: 912.26
Sell Date: 
2004-07-23 00:00:00
    Sell Price: 1849.09
    Updated Value: 12006.8

-------------------------

Buy Date: 
2004-12-20 00:00:00
Account Value: 12006.8
    Buy Price: 2127.85
    Num Shares: 5.0
    Remaining Value: 1367.55
Sell Date: 
2005-06-15 00:00:00
    Sell Price: 2074.92
    Updated Value: 11742.15

-------------------------

Buy Date: 
2005-08-23 00:00:00
Account Value: 11742.15
    Buy Price: 2137.25
    Num Shares: 5.0
    Remaining Value: 1055.9
Sell Date: 
2006-07-31 00:00:00
    Sell Price: 2091.47
    Updated Value: 11513.25

-------------------------

Buy Date: 
2006-11-29 00:00:00
Account Value: 11513.25
    Buy Price: 2432.23
    Num Shares: 4.0
    Remaining Value: 1784.33
Sell Date: 
2008-02-19 00:00:00
    Sell Price: 2306.2
    Updated Value: 11009.13

-------------------------

Buy Date: 
2009-07-02 00:00:00
Account Value: 11009.13
    Buy Price: 1796.52
    Num Shares: 6.0
    Remaining Value: 230.01
Sell Date: 
2010-08-23 00:00:00
    Sell Price: 2159.63
    Updated Value: 13187.79

-------------------------

Buy Date: 
2010-11-22 00:00:00
Account Value: 13187.79
    Buy Price: 2532.02
    Num Shares: 5.0
    Remaining Value: 527.69
Sell Date: 
2011-09-06 00:00:00
    Sell Price: 2473.83
    Updated Value: 12896.84

-------------------------

Buy Date: 
2012-02-16 00:00:00
Account Value: 12896.84
    Buy Price: 2959.85
    Num Shares: 4.0
    Remaining Value: 1057.44
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21041.36


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21041.36





-----------------------------------------------------------------------
^IXIC Calculations, N = [80, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-02 00:00:00
Account Value: 10000
    Buy Price: 2087.38
    Num Shares: 4.0
    Remaining Value: 1650.48
Sell Date: 
2001-08-27 00:00:00
    Sell Price: 1912.41
    Updated Value: 9300.12

-------------------------

Buy Date: 
2003-05-23 00:00:00
Account Value: 9300.12
    Buy Price: 1510.09
    Num Shares: 6.0
    Remaining Value: 239.58
Sell Date: 
2004-08-16 00:00:00
    Sell Price: 1782.84
    Updated Value: 10936.62

-------------------------

Buy Date: 
2004-12-31 00:00:00
Account Value: 10936.62
    Buy Price: 2175.44
    Num Shares: 5.0
    Remaining Value: 59.42
Sell Date: 
2006-08-09 00:00:00
    Sell Price: 2060.28
    Updated Value: 10360.82

-------------------------

Buy Date: 
2006-11-30 00:00:00
Account Value: 10360.82
    Buy Price: 2431.77
    Num Shares: 4.0
    Remaining Value: 633.74
Sell Date: 
2008-02-28 00:00:00
    Sell Price: 2331.57
    Updated Value: 9960.02

-------------------------

Buy Date: 
2009-08-06 00:00:00
Account Value: 9960.02
    Buy Price: 1973.16
    Num Shares: 5.0
    Remaining Value: 94.22
Sell Date: 
2010-09-08 00:00:00
    Sell Price: 2228.87
    Updated Value: 11238.57

-------------------------

Buy Date: 
2010-10-28 00:00:00
Account Value: 11238.57
    Buy Price: 2507.37
    Num Shares: 4.0
    Remaining Value: 1209.09
Sell Date: 
2011-09-28 00:00:00
    Sell Price: 2491.58
    Updated Value: 11175.41

-------------------------

Buy Date: 
2012-03-08 00:00:00
Account Value: 11175.41
    Buy Price: 2970.42
    Num Shares: 3.0
    Remaining Value: 2264.15
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 17252.09


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 17252.09





-----------------------------------------------------------------------
^IXIC Calculations, N = [80, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-27 00:00:00
Account Value: 10000
    Buy Price: 2029.07
    Num Shares: 4.0
    Remaining Value: 1883.72
Sell Date: 
2001-09-10 00:00:00
    Sell Price: 1695.38
    Updated Value: 8665.24

-------------------------

Buy Date: 
2003-06-20 00:00:00
Account Value: 8665.24
    Buy Price: 1644.72
    Num Shares: 5.0
    Remaining Value: 441.64
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 1869.87
    Updated Value: 9790.99

-------------------------

Buy Date: 
2004-12-27 00:00:00
Account Value: 9790.99
    Buy Price: 2154.22
    Num Shares: 4.0
    Remaining Value: 1174.11
Sell Date: 
2006-08-15 00:00:00
    Sell Price: 2115.01
    Updated Value: 9634.15

-------------------------

Buy Date: 
2006-11-20 00:00:00
Account Value: 9634.15
    Buy Price: 2452.72
    Num Shares: 3.0
    Remaining Value: 2275.99
Sell Date: 
2008-03-04 00:00:00
    Sell Price: 2260.28
    Updated Value: 9056.83

-------------------------

Buy Date: 
2009-09-04 00:00:00
Account Value: 9056.83
    Buy Price: 2018.78
    Num Shares: 4.0
    Remaining Value: 981.71
Sell Date: 
2011-11-01 00:00:00
    Sell Price: 2606.96
    Updated Value: 11409.55

-------------------------

Buy Date: 
2012-03-14 00:00:00
Account Value: 11409.55
    Buy Price: 3040.73
    Num Shares: 3.0
    Remaining Value: 2287.36
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 17275.3


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 17275.3





-----------------------------------------------------------------------
^IXIC Calculations, N = [100, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-21 00:00:00
Account Value: 10000
    Buy Price: 1831.3
    Num Shares: 5.0
    Remaining Value: 843.5
Sell Date: 
2001-10-09 00:00:00
    Sell Price: 1570.19
    Updated Value: 8694.45

-------------------------

Buy Date: 
2002-02-14 00:00:00
Account Value: 8694.45
    Buy Price: 1843.37
    Num Shares: 4.0
    Remaining Value: 1320.97
Sell Date: 
2002-05-06 00:00:00
    Sell Price: 1578.48
    Updated Value: 7634.89

-------------------------

Buy Date: 
2003-01-06 00:00:00
Account Value: 7634.89
    Buy Price: 1421.32
    Num Shares: 5.0
    Remaining Value: 528.29
Sell Date: 
2003-01-16 00:00:00
    Sell Price: 1423.75
    Updated Value: 7647.04

-------------------------

Buy Date: 
2003-02-14 00:00:00
Account Value: 7647.04
    Buy Price: 1310.17
    Num Shares: 5.0
    Remaining Value: 1096.19
Sell Date: 
2003-04-24 00:00:00
    Sell Price: 1457.23
    Updated Value: 8382.34

-------------------------

Buy Date: 
2003-06-20 00:00:00
Account Value: 8382.34
    Buy Price: 1644.72
    Num Shares: 5.0
    Remaining Value: 158.74
Sell Date: 
2004-06-15 00:00:00
    Sell Price: 1995.6
    Updated Value: 10136.74

-------------------------

Buy Date: 
2004-12-27 00:00:00
Account Value: 10136.74
    Buy Price: 2154.22
    Num Shares: 4.0
    Remaining Value: 1519.86
Sell Date: 
2005-05-02 00:00:00
    Sell Price: 1928.65
    Updated Value: 9234.46

-------------------------

Buy Date: 
2005-08-23 00:00:00
Account Value: 9234.46
    Buy Price: 2137.25
    Num Shares: 4.0
    Remaining Value: 685.46
Sell Date: 
2005-12-28 00:00:00
    Sell Price: 2228.94
    Updated Value: 9601.22

-------------------------

Buy Date: 
2006-01-24 00:00:00
Account Value: 9601.22
    Buy Price: 2265.25
    Num Shares: 4.0
    Remaining Value: 540.22
Sell Date: 
2006-06-26 00:00:00
    Sell Price: 2133.67
    Updated Value: 9074.9

-------------------------

Buy Date: 
2006-11-10 00:00:00
Account Value: 9074.9
    Buy Price: 2389.72
    Num Shares: 3.0
    Remaining Value: 1905.74
Sell Date: 
2007-12-07 00:00:00
    Sell Price: 2706.16
    Updated Value: 10024.22

-------------------------

Buy Date: 
2007-12-27 00:00:00
Account Value: 10024.22
    Buy Price: 2676.79
    Num Shares: 3.0
    Remaining Value: 1993.85
Sell Date: 
2008-02-28 00:00:00
    Sell Price: 2331.57
    Updated Value: 8988.56

-------------------------

Buy Date: 
2008-07-11 00:00:00
Account Value: 8988.56
    Buy Price: 2239.08
    Num Shares: 4.0
    Remaining Value: 32.24
Sell Date: 
2008-09-30 00:00:00
    Sell Price: 2091.88
    Updated Value: 8399.76

-------------------------

Buy Date: 
2009-05-05 00:00:00
Account Value: 8399.76
    Buy Price: 1754.12
    Num Shares: 4.0
    Remaining Value: 1383.28
Sell Date: 
2009-05-29 00:00:00
    Sell Price: 1774.33
    Updated Value: 8480.6

-------------------------

Buy Date: 
2009-06-17 00:00:00
Account Value: 8480.6
    Buy Price: 1808.06
    Num Shares: 4.0
    Remaining Value: 1248.36
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 2179.76
    Updated Value: 9967.4

-------------------------

Buy Date: 
2010-11-09 00:00:00
Account Value: 9967.4
    Buy Price: 2562.98
    Num Shares: 3.0
    Remaining Value: 2278.46
Sell Date: 
2011-07-14 00:00:00
    Sell Price: 2762.67
    Updated Value: 10566.47

-------------------------

Buy Date: 
2011-08-08 00:00:00
Account Value: 10566.47
    Buy Price: 2357.69
    Num Shares: 4.0
    Remaining Value: 1135.71
Sell Date: 
2011-09-13 00:00:00
    Sell Price: 2532.15
    Updated Value: 11264.31

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 11264.31
    Buy Price: 2786.7
    Num Shares: 4.0
    Remaining Value: 117.51
Sell Date: 
2012-08-09 00:00:00
    Sell Price: 3018.64
    Updated Value: 12192.07

-------------------------

Buy Date: 
2012-10-17 00:00:00
Account Value: 12192.07
    Buy Price: 3104.12
    Num Shares: 3.0
    Remaining Value: 2879.71
Sell Date: 
2013-02-06 00:00:00
    Sell Price: 3168.48
    Updated Value: 12385.15

-------------------------

Buy Date: 
2013-04-04 00:00:00
Account Value: 12385.15
    Buy Price: 3224.98
    Num Shares: 3.0
    Remaining Value: 2710.21
Sell Date: 
2014-07-31 00:00:00
    Sell Price: 4369.77
    Updated Value: 15819.52

-------------------------

Buy Date: 
2014-09-03 00:00:00
Account Value: 15819.52
    Buy Price: 4572.56
    Num Shares: 3.0
    Remaining Value: 2101.84
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 17089.78


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 17089.78





-----------------------------------------------------------------------
^IXIC Calculations, N = [100, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-03-26 00:00:00
Account Value: 10000
    Buy Price: 1824.17
    Num Shares: 5.0
    Remaining Value: 879.15
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 1496.88
    Updated Value: 8363.55

-------------------------

Buy Date: 
2003-03-12 00:00:00
Account Value: 8363.55
    Buy Price: 1279.24
    Num Shares: 6.0
    Remaining Value: 688.11
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 1889.06
    Updated Value: 12022.47

-------------------------

Buy Date: 
2005-01-07 00:00:00
Account Value: 12022.47
    Buy Price: 2088.61
    Num Shares: 5.0
    Remaining Value: 1579.42
Sell Date: 
2005-06-29 00:00:00
    Sell Price: 2068.89
    Updated Value: 11923.87

-------------------------

Buy Date: 
2005-09-15 00:00:00
Account Value: 11923.87
    Buy Price: 2146.15
    Num Shares: 5.0
    Remaining Value: 1193.12
Sell Date: 
2006-08-09 00:00:00
    Sell Price: 2060.28
    Updated Value: 11494.52

-------------------------

Buy Date: 
2006-12-18 00:00:00
Account Value: 11494.52
    Buy Price: 2435.57
    Num Shares: 4.0
    Remaining Value: 1752.24
Sell Date: 
2008-03-06 00:00:00
    Sell Price: 2220.5
    Updated Value: 10634.24

-------------------------

Buy Date: 
2009-07-16 00:00:00
Account Value: 10634.24
    Buy Price: 1885.03
    Num Shares: 5.0
    Remaining Value: 1209.09
Sell Date: 
2010-09-14 00:00:00
    Sell Price: 2289.77
    Updated Value: 12657.94

-------------------------

Buy Date: 
2010-12-14 00:00:00
Account Value: 12657.94
    Buy Price: 2627.72
    Num Shares: 4.0
    Remaining Value: 2147.06
Sell Date: 
2011-09-19 00:00:00
    Sell Price: 2612.83
    Updated Value: 12598.38

-------------------------

Buy Date: 
2012-02-28 00:00:00
Account Value: 12598.38
    Buy Price: 2986.76
    Num Shares: 4.0
    Remaining Value: 651.34
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 20635.26


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 20635.26





-----------------------------------------------------------------------
^IXIC Calculations, N = [100, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2003-05-19 00:00:00
Account Value: 10000
    Buy Price: 1492.77
    Num Shares: 6.0
    Remaining Value: 1043.38
Sell Date: 
2004-08-27 00:00:00
    Sell Price: 1862.09
    Updated Value: 12215.92

-------------------------

Buy Date: 
2005-01-19 00:00:00
Account Value: 12215.92
    Buy Price: 2073.59
    Num Shares: 5.0
    Remaining Value: 1847.97
Sell Date: 
2006-08-28 00:00:00
    Sell Price: 2160.7
    Updated Value: 12651.47

-------------------------

Buy Date: 
2006-12-21 00:00:00
Account Value: 12651.47
    Buy Price: 2415.85
    Num Shares: 5.0
    Remaining Value: 572.22
Sell Date: 
2008-03-14 00:00:00
    Sell Price: 2212.49
    Updated Value: 11634.67

-------------------------

Buy Date: 
2009-08-14 00:00:00
Account Value: 11634.67
    Buy Price: 1985.52
    Num Shares: 5.0
    Remaining Value: 1707.07
Sell Date: 
2010-09-30 00:00:00
    Sell Price: 2368.62
    Updated Value: 13550.17

-------------------------

Buy Date: 
2010-11-22 00:00:00
Account Value: 13550.17
    Buy Price: 2532.02
    Num Shares: 5.0
    Remaining Value: 890.07
Sell Date: 
2011-10-10 00:00:00
    Sell Price: 2566.05
    Updated Value: 13720.32

-------------------------

Buy Date: 
2012-03-12 00:00:00
Account Value: 13720.32
    Buy Price: 2983.66
    Num Shares: 4.0
    Remaining Value: 1785.68
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 21769.6


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 21769.6





-----------------------------------------------------------------------
^IXIC Calculations, N = [100, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-27 00:00:00
Account Value: 10000
    Buy Price: 1912.41
    Num Shares: 5.0
    Remaining Value: 437.95
Sell Date: 
2001-09-20 00:00:00
    Sell Price: 1470.93
    Updated Value: 7792.6

-------------------------

Buy Date: 
2003-07-01 00:00:00
Account Value: 7792.6
    Buy Price: 1640.13
    Num Shares: 4.0
    Remaining Value: 1232.08
Sell Date: 
2004-09-30 00:00:00
    Sell Price: 1896.84
    Updated Value: 8819.44

-------------------------

Buy Date: 
2005-01-18 00:00:00
Account Value: 8819.44
    Buy Price: 2106.04
    Num Shares: 4.0
    Remaining Value: 395.28
Sell Date: 
2006-09-06 00:00:00
    Sell Price: 2167.84
    Updated Value: 9066.64

-------------------------

Buy Date: 
2006-12-12 00:00:00
Account Value: 9066.64
    Buy Price: 2431.6
    Num Shares: 3.0
    Remaining Value: 1771.84
Sell Date: 
2008-03-24 00:00:00
    Sell Price: 2326.75
    Updated Value: 8752.09

-------------------------

Buy Date: 
2009-09-16 00:00:00
Account Value: 8752.09
    Buy Price: 2133.15
    Num Shares: 4.0
    Remaining Value: 219.49
Sell Date: 
2011-11-17 00:00:00
    Sell Price: 2587.99
    Updated Value: 10571.45

-------------------------

Buy Date: 
2012-03-19 00:00:00
Account Value: 10571.45
    Buy Price: 3078.32
    Num Shares: 3.0
    Remaining Value: 1336.49
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 4995.98
    Updated Value: 16324.43


===============================

^IXIC:
Final Value Basic: 19983.92
Final Value Crossover: 16324.43




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<h4 id="ixic-nasdaq-sorted-returns">IXIC (Nasdaq) Sorted Returns</h4>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[145]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># sorting runs based on net_results</span>
<span class="n">ixic_sorted</span> <span class="o">=</span> <span class="nb">sorted</span><span class="p">([(</span><span class="n">n</span><span class="p">,</span> <span class="n">ixic_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;net_result&#39;</span><span class="p">],</span> <span class="n">ixic_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;N&#39;</span><span class="p">])</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">ixic_runs</span><span class="p">],</span> <span class="n">key</span><span class="o">=</span><span class="k">lambda</span> <span class="n">x</span><span class="p">:</span><span class="n">x</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="n">reverse</span><span class="o">=</span><span class="bp">True</span><span class="p">)</span>
<span class="n">ixic_sorted</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[145]:</div>


<div class="output_text output_subarea output_pyout">
<pre>
[(&apos;[15, 50]&apos;, 9051.3200000000106, [15, 50]),
 (&apos;[10, 75]&apos;, 7678.2900000000081, [10, 75]),
 (&apos;[10, 200]&apos;, 6780.3699999999953, [10, 200]),
 (&apos;[10, 250]&apos;, 6462.6900000000023, [10, 250]),
 (&apos;[10, 300]&apos;, 6148.2900000000081, [10, 300]),
 (&apos;[20, 30]&apos;, 5602.1200000000026, [20, 30]),
 (&apos;[15, 200]&apos;, 5328.2799999999988, [15, 200]),
 (&apos;[40, 125]&apos;, 5028.0499999999956, [40, 125]),
 (&apos;[60, 75]&apos;, 4592.8600000000006, [60, 75]),
 (&apos;[30, 125]&apos;, 4030.6700000000019, [30, 125]),
 (&apos;[10, 50]&apos;, 3648.9199999999873, [10, 50]),
 (&apos;[60, 200]&apos;, 2946.1400000000031, [60, 200]),
 (&apos;[15, 250]&apos;, 2349.9600000000064, [15, 250]),
 (&apos;[50, 200]&apos;, 2207.0199999999932, [50, 200]),
 (&apos;[40, 200]&apos;, 1970.9800000000032, [40, 200]),
 (&apos;[30, 250]&apos;, 1918.239999999998, [30, 250]),
 (&apos;[100, 250]&apos;, 1785.6799999999967, [100, 250]),
 (&apos;[20, 250]&apos;, 1772.5599999999977, [20, 250]),
 (&apos;[20, 200]&apos;, 1716.6800000000039, [20, 200]),
 (&apos;[50, 125]&apos;, 1667.2399999999907, [50, 125]),
 (&apos;[40, 300]&apos;, 1592.0799999999981, [40, 300]),
 (&apos;[15, 75]&apos;, 1559.7500000000073, [15, 75]),
 (&apos;[50, 250]&apos;, 1489.8700000000026, [50, 250]),
 (&apos;[15, 300]&apos;, 1354.3100000000049, [15, 300]),
 (&apos;[20, 300]&apos;, 1070.9599999999991, [20, 300]),
 (&apos;[80, 200]&apos;, 1057.4399999999987, [80, 200]),
 (&apos;[20, 50]&apos;, 859.13000000001193, [20, 50]),
 (&apos;[30, 200]&apos;, 711.18000000000029, [30, 200]),
 (&apos;[100, 200]&apos;, 651.33999999999651, [100, 200]),
 (&apos;[30, 50]&apos;, 619.25000000000728, [30, 50]),
 (&apos;[60, 300]&apos;, 552.09000000000378, [60, 300]),
 (&apos;[10, 30]&apos;, 523.43999999999869, [10, 30]),
 (&apos;[40, 250]&apos;, 394.63999999999942, [40, 250]),
 (&apos;[15, 30]&apos;, 238.77000000001135, [15, 30]),
 (&apos;[50, 300]&apos;, 199.93999999999869, [50, 300]),
 (&apos;[60, 125]&apos;, 48.509999999994761, [60, 125]),
 (&apos;[20, 125]&apos;, -1461.6999999999971, [20, 125]),
 (&apos;[20, 75]&apos;, -1737.4499999999935, [20, 75]),
 (&apos;[30, 75]&apos;, -1834.5700000000033, [30, 75]),
 (&apos;[50, 75]&apos;, -2047.0799999999945, [50, 75]),
 (&apos;[30, 300]&apos;, -2430.2599999999984, [30, 300]),
 (&apos;[80, 300]&apos;, -2708.6199999999953, [80, 300]),
 (&apos;[80, 250]&apos;, -2731.8300000000017, [80, 250]),
 (&apos;[100, 125]&apos;, -2894.1399999999958, [100, 125]),
 (&apos;[60, 250]&apos;, -3246.3499999999985, [60, 250]),
 (&apos;[100, 300]&apos;, -3659.4900000000016, [100, 300]),
 (&apos;[10, 125]&apos;, -3911.0699999999924, [10, 125]),
 (&apos;[40, 75]&apos;, -4129.7899999999918, [40, 75]),
 (&apos;[15, 125]&apos;, -4446.0099999999893, [15, 125]),
 (&apos;[40, 50]&apos;, -6091.029999999997, [40, 50]),
 (&apos;[80, 125]&apos;, -8651.5200000000004, [80, 125])]
</pre>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h3 id="dji-dow-jones-industrial-">DJI (Dow Jones Industrial)</h3>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[63]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="n">dji_runs</span> <span class="o">=</span> <span class="n">crossover_brute_force_analysis</span><span class="p">([</span><span class="s">&#39;DJIA&#39;</span><span class="p">])</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt"></div>
<div class="output_subarea output_stream output_stdout output_text">
<pre>


-----------------------------------------------------------------------
DJIA Calculations, N = [10, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-05 00:00:00
Account Value: 10000
    Buy Price: 10965.85
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-02-27 00:00:00
    Sell Price: 10636.88
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-04-19 00:00:00
Account Value: 10000.0
    Buy Price: 10693.71
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-12 00:00:00
    Sell Price: 10948.38
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-06-13 00:00:00
Account Value: 10000.0
    Buy Price: 10871.62
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-15 00:00:00
    Sell Price: 10623.64
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-08-08 00:00:00
Account Value: 10000.0
    Buy Price: 10293.5
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 10298.56
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-08-10 00:00:00
Account Value: 10000.0
    Buy Price: 10416.25
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-16 00:00:00
    Sell Price: 10392.52
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-10-18 00:00:00
Account Value: 10000.0
    Buy Price: 9163.22
    Num Shares: 1.0
    Remaining Value: 836.78
Sell Date: 
2002-01-22 00:00:00
    Sell Price: 9713.8
    Updated Value: 10550.58

-------------------------

Buy Date: 
2002-02-22 00:00:00
Account Value: 10550.58
    Buy Price: 9968.15
    Num Shares: 1.0
    Remaining Value: 582.43
Sell Date: 
2002-04-05 00:00:00
    Sell Price: 10271.64
    Updated Value: 10854.07

-------------------------

Buy Date: 
2002-05-21 00:00:00
Account Value: 10854.07
    Buy Price: 10105.71
    Num Shares: 1.0
    Remaining Value: 748.36
Sell Date: 
2002-06-04 00:00:00
    Sell Price: 9687.84
    Updated Value: 10436.2

-------------------------

Buy Date: 
2002-08-19 00:00:00
Account Value: 10436.2
    Buy Price: 8990.79
    Num Shares: 1.0
    Remaining Value: 1445.41
Sell Date: 
2002-09-09 00:00:00
    Sell Price: 8519.38
    Updated Value: 9964.79

-------------------------

Buy Date: 
2002-10-23 00:00:00
Account Value: 9964.79
    Buy Price: 8494.27
    Num Shares: 1.0
    Remaining Value: 1470.52
Sell Date: 
2002-12-17 00:00:00
    Sell Price: 8535.39
    Updated Value: 10005.91

-------------------------

Buy Date: 
2003-01-14 00:00:00
Account Value: 10005.91
    Buy Price: 8842.62
    Num Shares: 1.0
    Remaining Value: 1163.29
Sell Date: 
2003-01-28 00:00:00
    Sell Price: 8088.84
    Updated Value: 9252.13

-------------------------

Buy Date: 
2003-03-24 00:00:00
Account Value: 9252.13
    Buy Price: 8214.68
    Num Shares: 1.0
    Remaining Value: 1037.45
Sell Date: 
2003-07-11 00:00:00
    Sell Price: 9119.59
    Updated Value: 10157.04

-------------------------

Buy Date: 
2003-07-14 00:00:00
Account Value: 10157.04
    Buy Price: 9177.15
    Num Shares: 1.0
    Remaining Value: 979.89
Sell Date: 
2003-07-22 00:00:00
    Sell Price: 9158.45
    Updated Value: 10138.34

-------------------------

Buy Date: 
2003-07-29 00:00:00
Account Value: 10138.34
    Buy Price: 9204.46
    Num Shares: 1.0
    Remaining Value: 933.88
Sell Date: 
2003-10-03 00:00:00
    Sell Price: 9572.31
    Updated Value: 10506.19

-------------------------

Buy Date: 
2003-10-13 00:00:00
Account Value: 10506.19
    Buy Price: 9764.38
    Num Shares: 1.0
    Remaining Value: 741.81
Sell Date: 
2003-11-21 00:00:00
    Sell Price: 9628.53
    Updated Value: 10370.34

-------------------------

Buy Date: 
2003-12-04 00:00:00
Account Value: 10370.34
    Buy Price: 9930.82
    Num Shares: 1.0
    Remaining Value: 439.52
Sell Date: 
2004-02-10 00:00:00
    Sell Price: 10613.85
    Updated Value: 11053.37

-------------------------

Buy Date: 
2004-02-11 00:00:00
Account Value: 11053.37
    Buy Price: 10737.7
    Num Shares: 1.0
    Remaining Value: 315.67
Sell Date: 
2004-03-10 00:00:00
    Sell Price: 10296.89
    Updated Value: 10612.56

-------------------------

Buy Date: 
2004-04-08 00:00:00
Account Value: 10612.56
    Buy Price: 10442.03
    Num Shares: 1.0
    Remaining Value: 170.53
Sell Date: 
2004-05-06 00:00:00
    Sell Price: 10241.26
    Updated Value: 10411.79

-------------------------

Buy Date: 
2004-06-08 00:00:00
Account Value: 10411.79
    Buy Price: 10432.52
    Num Shares: 0.0
    Remaining Value: 10411.79
Sell Date: 
2004-07-12 00:00:00
    Sell Price: 10238.22
    Updated Value: 10411.79

-------------------------

Buy Date: 
2004-08-27 00:00:00
Account Value: 10411.79
    Buy Price: 10195.01
    Num Shares: 1.0
    Remaining Value: 216.78
Sell Date: 
2004-09-29 00:00:00
    Sell Price: 10136.24
    Updated Value: 10353.02

-------------------------

Buy Date: 
2004-11-08 00:00:00
Account Value: 10353.02
    Buy Price: 10391.31
    Num Shares: 0.0
    Remaining Value: 10353.02
Sell Date: 
2005-01-14 00:00:00
    Sell Price: 10558.0
    Updated Value: 10353.02

-------------------------

Buy Date: 
2005-02-11 00:00:00
Account Value: 10353.02
    Buy Price: 10796.01
    Num Shares: 0.0
    Remaining Value: 10353.02
Sell Date: 
2005-03-21 00:00:00
    Sell Price: 10565.39
    Updated Value: 10353.02

-------------------------

Buy Date: 
2005-05-16 00:00:00
Account Value: 10353.02
    Buy Price: 10252.29
    Num Shares: 1.0
    Remaining Value: 100.73
Sell Date: 
2005-06-30 00:00:00
    Sell Price: 10274.97
    Updated Value: 10375.7

-------------------------

Buy Date: 
2005-07-20 00:00:00
Account Value: 10375.7
    Buy Price: 10689.15
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2005-08-18 00:00:00
    Sell Price: 10554.92
    Updated Value: 10375.7

-------------------------

Buy Date: 
2005-09-15 00:00:00
Account Value: 10375.7
    Buy Price: 10558.75
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2005-09-27 00:00:00
    Sell Price: 10456.21
    Updated Value: 10375.7

-------------------------

Buy Date: 
2005-11-04 00:00:00
Account Value: 10375.7
    Buy Price: 10530.76
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2005-12-30 00:00:00
    Sell Price: 10717.5
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-01-11 00:00:00
Account Value: 10375.7
    Buy Price: 11043.44
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2006-01-26 00:00:00
    Sell Price: 10809.47
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-02-08 00:00:00
Account Value: 10375.7
    Buy Price: 10858.62
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2006-02-10 00:00:00
    Sell Price: 10919.05
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-02-17 00:00:00
Account Value: 10375.7
    Buy Price: 11115.32
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2006-04-19 00:00:00
    Sell Price: 11278.77
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-04-26 00:00:00
Account Value: 10375.7
    Buy Price: 11354.49
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2006-05-24 00:00:00
    Sell Price: 11117.32
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-07-05 00:00:00
Account Value: 10375.7
    Buy Price: 11151.82
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2006-07-20 00:00:00
    Sell Price: 10928.1
    Updated Value: 10375.7

-------------------------

Buy Date: 
2006-08-01 00:00:00
Account Value: 10375.7
    Buy Price: 11125.73
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-03-05 00:00:00
    Sell Price: 12050.41
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-04-02 00:00:00
Account Value: 10375.7
    Buy Price: 12382.3
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-06-19 00:00:00
    Sell Price: 13635.42
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-06-21 00:00:00
Account Value: 10375.7
    Buy Price: 13545.84
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-06-22 00:00:00
    Sell Price: 13360.26
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-06-26 00:00:00
Account Value: 10375.7
    Buy Price: 13337.66
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-06-29 00:00:00
    Sell Price: 13408.62
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-07-12 00:00:00
Account Value: 10375.7
    Buy Price: 13861.73
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-08-03 00:00:00
    Sell Price: 13181.91
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-09-06 00:00:00
Account Value: 10375.7
    Buy Price: 13363.35
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-09-11 00:00:00
    Sell Price: 13308.39
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-09-12 00:00:00
Account Value: 10375.7
    Buy Price: 13291.65
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2007-10-25 00:00:00
    Sell Price: 13671.92
    Updated Value: 10375.7

-------------------------

Buy Date: 
2007-12-11 00:00:00
Account Value: 10375.7
    Buy Price: 13432.77
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 12589.07
    Updated Value: 10375.7

-------------------------

Buy Date: 
2008-02-26 00:00:00
Account Value: 10375.7
    Buy Price: 12684.92
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2008-03-10 00:00:00
    Sell Price: 11740.15
    Updated Value: 10375.7

-------------------------

Buy Date: 
2008-04-01 00:00:00
Account Value: 10375.7
    Buy Price: 12654.36
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2008-05-28 00:00:00
    Sell Price: 12594.03
    Updated Value: 10375.7

-------------------------

Buy Date: 
2008-08-01 00:00:00
Account Value: 10375.7
    Buy Price: 11326.32
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2008-08-29 00:00:00
    Sell Price: 11543.55
    Updated Value: 10375.7

-------------------------

Buy Date: 
2008-09-03 00:00:00
Account Value: 10375.7
    Buy Price: 11532.88
    Num Shares: 0.0
    Remaining Value: 10375.7
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 11510.74
    Updated Value: 10375.7

-------------------------

Buy Date: 
2008-11-13 00:00:00
Account Value: 10375.7
    Buy Price: 8835.25
    Num Shares: 1.0
    Remaining Value: 1540.45
Sell Date: 
2008-11-17 00:00:00
    Sell Price: 8273.58
    Updated Value: 9814.03

-------------------------

Buy Date: 
2008-12-16 00:00:00
Account Value: 9814.03
    Buy Price: 8924.14
    Num Shares: 1.0
    Remaining Value: 889.89
Sell Date: 
2009-01-20 00:00:00
    Sell Price: 7949.09
    Updated Value: 8838.98

-------------------------

Buy Date: 
2009-03-25 00:00:00
Account Value: 8838.98
    Buy Price: 7749.81
    Num Shares: 1.0
    Remaining Value: 1089.17
Sell Date: 
2009-06-26 00:00:00
    Sell Price: 8438.39
    Updated Value: 9527.56

-------------------------

Buy Date: 
2009-07-23 00:00:00
Account Value: 9527.56
    Buy Price: 9069.29
    Num Shares: 1.0
    Remaining Value: 458.27
Sell Date: 
2010-01-28 00:00:00
    Sell Price: 10120.46
    Updated Value: 10578.73

-------------------------

Buy Date: 
2010-02-26 00:00:00
Account Value: 10578.73
    Buy Price: 10325.26
    Num Shares: 1.0
    Remaining Value: 253.47
Sell Date: 
2010-05-10 00:00:00
    Sell Price: 10785.14
    Updated Value: 11038.61

-------------------------

Buy Date: 
2010-06-23 00:00:00
Account Value: 11038.61
    Buy Price: 10298.44
    Num Shares: 1.0
    Remaining Value: 740.17
Sell Date: 
2010-07-06 00:00:00
    Sell Price: 9743.62
    Updated Value: 10483.79

-------------------------

Buy Date: 
2010-07-20 00:00:00
Account Value: 10483.79
    Buy Price: 10229.96
    Num Shares: 1.0
    Remaining Value: 253.83
Sell Date: 
2010-08-23 00:00:00
    Sell Price: 10174.41
    Updated Value: 10428.24

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 10428.24
    Buy Price: 10572.73
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2010-11-24 00:00:00
    Sell Price: 11187.28
    Updated Value: 10428.24

-------------------------

Buy Date: 
2010-12-10 00:00:00
Account Value: 10428.24
    Buy Price: 11410.32
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-03-14 00:00:00
    Sell Price: 11993.16
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-04-01 00:00:00
Account Value: 10428.24
    Buy Price: 12376.72
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-05-26 00:00:00
    Sell Price: 12402.76
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-07-06 00:00:00
Account Value: 10428.24
    Buy Price: 12626.02
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 11383.68
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-09-09 00:00:00
Account Value: 10428.24
    Buy Price: 10992.13
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-09-21 00:00:00
    Sell Price: 11124.84
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-09-27 00:00:00
Account Value: 10428.24
    Buy Price: 11190.69
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-09-29 00:00:00
    Sell Price: 11153.98
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-10-17 00:00:00
Account Value: 10428.24
    Buy Price: 11397.0
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 11523.01
    Updated Value: 10428.24

-------------------------

Buy Date: 
2011-12-09 00:00:00
Account Value: 10428.24
    Buy Price: 12184.26
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2012-04-16 00:00:00
    Sell Price: 12921.41
    Updated Value: 10428.24

-------------------------

Buy Date: 
2012-05-02 00:00:00
Account Value: 10428.24
    Buy Price: 13268.57
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2012-05-15 00:00:00
    Sell Price: 12632.0
    Updated Value: 10428.24

-------------------------

Buy Date: 
2012-06-20 00:00:00
Account Value: 10428.24
    Buy Price: 12824.39
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2012-09-06 00:00:00
    Sell Price: 13292.0
    Updated Value: 10428.24

-------------------------

Buy Date: 
2012-09-12 00:00:00
Account Value: 10428.24
    Buy Price: 13333.35
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2012-10-19 00:00:00
    Sell Price: 13343.51
    Updated Value: 10428.24

-------------------------

Buy Date: 
2012-12-06 00:00:00
Account Value: 10428.24
    Buy Price: 13074.04
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2013-06-13 00:00:00
    Sell Price: 15176.08
    Updated Value: 10428.24

-------------------------

Buy Date: 
2013-07-12 00:00:00
Account Value: 10428.24
    Buy Price: 15464.3
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2013-08-16 00:00:00
    Sell Price: 15081.47
    Updated Value: 10428.24

-------------------------

Buy Date: 
2013-09-18 00:00:00
Account Value: 10428.24
    Buy Price: 15676.94
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2013-10-09 00:00:00
    Sell Price: 14802.98
    Updated Value: 10428.24

-------------------------

Buy Date: 
2013-10-24 00:00:00
Account Value: 10428.24
    Buy Price: 15509.21
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2013-12-23 00:00:00
    Sell Price: 16294.61
    Updated Value: 10428.24

-------------------------

Buy Date: 
2013-12-26 00:00:00
Account Value: 10428.24
    Buy Price: 16479.88
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2014-01-29 00:00:00
    Sell Price: 15738.79
    Updated Value: 10428.24

-------------------------

Buy Date: 
2014-02-25 00:00:00
Account Value: 10428.24
    Buy Price: 16179.66
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2014-04-16 00:00:00
    Sell Price: 16424.85
    Updated Value: 10428.24

-------------------------

Buy Date: 
2014-04-28 00:00:00
Account Value: 10428.24
    Buy Price: 16448.74
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2014-08-04 00:00:00
    Sell Price: 16569.28
    Updated Value: 10428.24

-------------------------

Buy Date: 
2014-08-27 00:00:00
Account Value: 10428.24
    Buy Price: 17122.01
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2014-10-03 00:00:00
    Sell Price: 17009.69
    Updated Value: 10428.24

-------------------------

Buy Date: 
2014-11-03 00:00:00
Account Value: 10428.24
    Buy Price: 17366.24
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2014-12-17 00:00:00
    Sell Price: 17356.87
    Updated Value: 10428.24

-------------------------

Buy Date: 
2014-12-31 00:00:00
Account Value: 10428.24
    Buy Price: 17823.07
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2015-01-13 00:00:00
    Sell Price: 17613.68
    Updated Value: 10428.24

-------------------------

Buy Date: 
2015-02-12 00:00:00
Account Value: 10428.24
    Buy Price: 17972.38
    Num Shares: 0.0
    Remaining Value: 10428.24
Sell Date: 
2015-03-17 00:00:00
    Sell Price: 17849.08
    Updated Value: 10428.24


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 10428.24





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-01 00:00:00
Account Value: 10000
    Buy Price: 10983.63
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-02-28 00:00:00
    Sell Price: 10495.28
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-04-25 00:00:00
Account Value: 10000.0
    Buy Price: 10625.2
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-22 00:00:00
    Sell Price: 10604.59
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-09 00:00:00
Account Value: 10000.0
    Buy Price: 9608.0
    Num Shares: 1.0
    Remaining Value: 392.0
Sell Date: 
2002-01-24 00:00:00
    Sell Price: 9796.07
    Updated Value: 10188.07

-------------------------

Buy Date: 
2002-02-27 00:00:00
Account Value: 10188.07
    Buy Price: 10127.58
    Num Shares: 1.0
    Remaining Value: 60.49
Sell Date: 
2002-04-22 00:00:00
    Sell Price: 10136.43
    Updated Value: 10196.92

-------------------------

Buy Date: 
2002-08-27 00:00:00
Account Value: 10196.92
    Buy Price: 8824.41
    Num Shares: 1.0
    Remaining Value: 1372.51
Sell Date: 
2002-09-06 00:00:00
    Sell Price: 8427.2
    Updated Value: 9799.71

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 9799.71
    Buy Price: 8368.04
    Num Shares: 1.0
    Remaining Value: 1431.67
Sell Date: 
2002-12-24 00:00:00
    Sell Price: 8448.11
    Updated Value: 9879.78

-------------------------

Buy Date: 
2003-01-14 00:00:00
Account Value: 9879.78
    Buy Price: 8842.62
    Num Shares: 1.0
    Remaining Value: 1037.16
Sell Date: 
2003-01-27 00:00:00
    Sell Price: 7989.56
    Updated Value: 9026.72

-------------------------

Buy Date: 
2003-03-26 00:00:00
Account Value: 9026.72
    Buy Price: 8229.88
    Num Shares: 1.0
    Remaining Value: 796.84
Sell Date: 
2004-03-11 00:00:00
    Sell Price: 10128.38
    Updated Value: 10925.22

-------------------------

Buy Date: 
2004-06-15 00:00:00
Account Value: 10925.22
    Buy Price: 10380.43
    Num Shares: 1.0
    Remaining Value: 544.79
Sell Date: 
2004-07-21 00:00:00
    Sell Price: 10046.13
    Updated Value: 10590.92

-------------------------

Buy Date: 
2004-09-03 00:00:00
Account Value: 10590.92
    Buy Price: 10260.2
    Num Shares: 1.0
    Remaining Value: 330.72
Sell Date: 
2004-10-05 00:00:00
    Sell Price: 10177.68
    Updated Value: 10508.4

-------------------------

Buy Date: 
2004-10-07 00:00:00
Account Value: 10508.4
    Buy Price: 10125.4
    Num Shares: 1.0
    Remaining Value: 383.0
Sell Date: 
2004-10-18 00:00:00
    Sell Price: 9956.32
    Updated Value: 10339.32

-------------------------

Buy Date: 
2004-11-10 00:00:00
Account Value: 10339.32
    Buy Price: 10385.48
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2005-01-21 00:00:00
    Sell Price: 10392.99
    Updated Value: 10339.32

-------------------------

Buy Date: 
2005-02-11 00:00:00
Account Value: 10339.32
    Buy Price: 10796.01
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2005-03-28 00:00:00
    Sell Price: 10485.65
    Updated Value: 10339.32

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 10339.32
    Buy Price: 10537.6
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2005-07-06 00:00:00
    Sell Price: 10270.68
    Updated Value: 10339.32

-------------------------

Buy Date: 
2005-07-18 00:00:00
Account Value: 10339.32
    Buy Price: 10574.99
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2005-08-29 00:00:00
    Sell Price: 10463.05
    Updated Value: 10339.32

-------------------------

Buy Date: 
2005-09-16 00:00:00
Account Value: 10339.32
    Buy Price: 10641.94
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2005-09-22 00:00:00
    Sell Price: 10422.05
    Updated Value: 10339.32

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 10339.32
    Buy Price: 10640.1
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2006-01-27 00:00:00
    Sell Price: 10907.21
    Updated Value: 10339.32

-------------------------

Buy Date: 
2006-02-08 00:00:00
Account Value: 10339.32
    Buy Price: 10858.62
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2006-05-25 00:00:00
    Sell Price: 11211.05
    Updated Value: 10339.32

-------------------------

Buy Date: 
2006-08-01 00:00:00
Account Value: 10339.32
    Buy Price: 11125.73
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2007-03-06 00:00:00
    Sell Price: 12207.59
    Updated Value: 10339.32

-------------------------

Buy Date: 
2007-04-13 00:00:00
Account Value: 10339.32
    Buy Price: 12612.13
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2007-08-03 00:00:00
    Sell Price: 13181.91
    Updated Value: 10339.32

-------------------------

Buy Date: 
2007-09-24 00:00:00
Account Value: 10339.32
    Buy Price: 13759.06
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2007-11-09 00:00:00
    Sell Price: 13042.74
    Updated Value: 10339.32

-------------------------

Buy Date: 
2008-04-01 00:00:00
Account Value: 10339.32
    Buy Price: 12654.36
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2008-06-03 00:00:00
    Sell Price: 12402.85
    Updated Value: 10339.32

-------------------------

Buy Date: 
2008-08-21 00:00:00
Account Value: 10339.32
    Buy Price: 11430.21
    Num Shares: 0.0
    Remaining Value: 10339.32
Sell Date: 
2008-09-15 00:00:00
    Sell Price: 10917.51
    Updated Value: 10339.32

-------------------------

Buy Date: 
2009-01-09 00:00:00
Account Value: 10339.32
    Buy Price: 8599.18
    Num Shares: 1.0
    Remaining Value: 1740.14
Sell Date: 
2009-01-21 00:00:00
    Sell Price: 8228.1
    Updated Value: 9968.24

-------------------------

Buy Date: 
2009-04-02 00:00:00
Account Value: 9968.24
    Buy Price: 7978.08
    Num Shares: 1.0
    Remaining Value: 1990.16
Sell Date: 
2009-07-06 00:00:00
    Sell Price: 8324.87
    Updated Value: 10315.03

-------------------------

Buy Date: 
2009-07-23 00:00:00
Account Value: 10315.03
    Buy Price: 9069.29
    Num Shares: 1.0
    Remaining Value: 1245.74
Sell Date: 
2010-01-29 00:00:00
    Sell Price: 10067.33
    Updated Value: 11313.07

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 11313.07
    Buy Price: 10564.38
    Num Shares: 1.0
    Remaining Value: 748.69
Sell Date: 
2010-05-14 00:00:00
    Sell Price: 10620.16
    Updated Value: 11368.85

-------------------------

Buy Date: 
2010-07-22 00:00:00
Account Value: 11368.85
    Buy Price: 10322.3
    Num Shares: 1.0
    Remaining Value: 1046.55
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 9985.81
    Updated Value: 11032.36

-------------------------

Buy Date: 
2010-09-14 00:00:00
Account Value: 11032.36
    Buy Price: 10526.49
    Num Shares: 1.0
    Remaining Value: 505.87
Sell Date: 
2011-03-22 00:00:00
    Sell Price: 12018.63
    Updated Value: 12524.5

-------------------------

Buy Date: 
2011-03-31 00:00:00
Account Value: 12524.5
    Buy Price: 12319.73
    Num Shares: 1.0
    Remaining Value: 204.77
Sell Date: 
2011-06-03 00:00:00
    Sell Price: 12151.26
    Updated Value: 12356.03

-------------------------

Buy Date: 
2011-07-12 00:00:00
Account Value: 12356.03
    Buy Price: 12446.88
    Num Shares: 0.0
    Remaining Value: 12356.03
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 11444.61
    Updated Value: 12356.03

-------------------------

Buy Date: 
2011-10-17 00:00:00
Account Value: 12356.03
    Buy Price: 11397.0
    Num Shares: 1.0
    Remaining Value: 959.03
Sell Date: 
2012-04-18 00:00:00
    Sell Price: 13032.75
    Updated Value: 13991.78

-------------------------

Buy Date: 
2012-04-27 00:00:00
Account Value: 13991.78
    Buy Price: 13228.31
    Num Shares: 1.0
    Remaining Value: 763.47
Sell Date: 
2012-05-15 00:00:00
    Sell Price: 12632.0
    Updated Value: 13395.47

-------------------------

Buy Date: 
2012-07-10 00:00:00
Account Value: 13395.47
    Buy Price: 12653.12
    Num Shares: 1.0
    Remaining Value: 742.35
Sell Date: 
2012-11-01 00:00:00
    Sell Price: 13232.62
    Updated Value: 13974.97

-------------------------

Buy Date: 
2012-12-18 00:00:00
Account Value: 13974.97
    Buy Price: 13350.96
    Num Shares: 1.0
    Remaining Value: 624.01
Sell Date: 
2013-06-27 00:00:00
    Sell Price: 15024.49
    Updated Value: 15648.5

-------------------------

Buy Date: 
2013-07-15 00:00:00
Account Value: 15648.5
    Buy Price: 15484.26
    Num Shares: 1.0
    Remaining Value: 164.24
Sell Date: 
2013-08-23 00:00:00
    Sell Price: 15010.51
    Updated Value: 15174.75

-------------------------

Buy Date: 
2013-09-20 00:00:00
Account Value: 15174.75
    Buy Price: 15451.09
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2013-10-04 00:00:00
    Sell Price: 15072.58
    Updated Value: 15174.75

-------------------------

Buy Date: 
2013-10-22 00:00:00
Account Value: 15174.75
    Buy Price: 15467.66
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2014-01-31 00:00:00
    Sell Price: 15698.85
    Updated Value: 15174.75

-------------------------

Buy Date: 
2014-03-05 00:00:00
Account Value: 15174.75
    Buy Price: 16360.18
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2014-08-06 00:00:00
    Sell Price: 16443.34
    Updated Value: 15174.75

-------------------------

Buy Date: 
2014-08-27 00:00:00
Account Value: 15174.75
    Buy Price: 17122.01
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2014-10-13 00:00:00
    Sell Price: 16321.07
    Updated Value: 15174.75

-------------------------

Buy Date: 
2014-11-05 00:00:00
Account Value: 15174.75
    Buy Price: 17484.53
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2015-01-14 00:00:00
    Sell Price: 17427.09
    Updated Value: 15174.75

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 15174.75
    Buy Price: 18019.35
    Num Shares: 0.0
    Remaining Value: 15174.75
Sell Date: 
2015-04-07 00:00:00
    Sell Price: 17875.42
    Updated Value: 15174.75


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 15174.75





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-27 00:00:00
Account Value: 10000
    Buy Price: 10810.05
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-09 00:00:00
    Sell Price: 10299.4
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-20 00:00:00
Account Value: 10000.0
    Buy Price: 9901.38
    Num Shares: 1.0
    Remaining Value: 98.62
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 9744.24
    Updated Value: 9842.86

-------------------------

Buy Date: 
2002-02-22 00:00:00
Account Value: 9842.86
    Buy Price: 9968.15
    Num Shares: 0.0
    Remaining Value: 9842.86
Sell Date: 
2002-05-02 00:00:00
    Sell Price: 10091.87
    Updated Value: 9842.86

-------------------------

Buy Date: 
2002-05-24 00:00:00
Account Value: 9842.86
    Buy Price: 10104.26
    Num Shares: 0.0
    Remaining Value: 9842.86
Sell Date: 
2002-05-29 00:00:00
    Sell Price: 9923.04
    Updated Value: 9842.86

-------------------------

Buy Date: 
2002-10-30 00:00:00
Account Value: 9842.86
    Buy Price: 8427.41
    Num Shares: 1.0
    Remaining Value: 1415.45
Sell Date: 
2003-01-29 00:00:00
    Sell Price: 8110.71
    Updated Value: 9526.16

-------------------------

Buy Date: 
2003-04-01 00:00:00
Account Value: 9526.16
    Buy Price: 8069.86
    Num Shares: 1.0
    Remaining Value: 1456.3
Sell Date: 
2003-04-04 00:00:00
    Sell Price: 8277.15
    Updated Value: 9733.45

-------------------------

Buy Date: 
2003-04-14 00:00:00
Account Value: 9733.45
    Buy Price: 8351.1
    Num Shares: 1.0
    Remaining Value: 1382.35
Sell Date: 
2004-03-18 00:00:00
    Sell Price: 10295.78
    Updated Value: 11678.13

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 11678.13
    Buy Price: 10379.58
    Num Shares: 1.0
    Remaining Value: 1298.55
Sell Date: 
2004-07-14 00:00:00
    Sell Price: 10208.8
    Updated Value: 11507.35

-------------------------

Buy Date: 
2004-09-08 00:00:00
Account Value: 11507.35
    Buy Price: 10313.36
    Num Shares: 1.0
    Remaining Value: 1193.99
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 10077.4
    Updated Value: 11271.39

-------------------------

Buy Date: 
2004-10-14 00:00:00
Account Value: 11271.39
    Buy Price: 9894.45
    Num Shares: 1.0
    Remaining Value: 1376.94
Sell Date: 
2004-10-15 00:00:00
    Sell Price: 9933.38
    Updated Value: 11310.32

-------------------------

Buy Date: 
2004-11-09 00:00:00
Account Value: 11310.32
    Buy Price: 10386.37
    Num Shares: 1.0
    Remaining Value: 923.95
Sell Date: 
2005-03-24 00:00:00
    Sell Price: 10442.87
    Updated Value: 11366.82

-------------------------

Buy Date: 
2005-06-14 00:00:00
Account Value: 11366.82
    Buy Price: 10547.57
    Num Shares: 1.0
    Remaining Value: 819.25
Sell Date: 
2005-07-06 00:00:00
    Sell Price: 10270.68
    Updated Value: 11089.93

-------------------------

Buy Date: 
2005-07-14 00:00:00
Account Value: 11089.93
    Buy Price: 10628.88
    Num Shares: 1.0
    Remaining Value: 461.05
Sell Date: 
2005-08-30 00:00:00
    Sell Price: 10412.82
    Updated Value: 10873.87

-------------------------

Buy Date: 
2005-09-13 00:00:00
Account Value: 10873.87
    Buy Price: 10597.44
    Num Shares: 1.0
    Remaining Value: 276.43
Sell Date: 
2005-09-26 00:00:00
    Sell Price: 10443.63
    Updated Value: 10720.06

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10720.06
    Buy Price: 10686.04
    Num Shares: 1.0
    Remaining Value: 34.02
Sell Date: 
2006-05-31 00:00:00
    Sell Price: 11168.31
    Updated Value: 11202.33

-------------------------

Buy Date: 
2006-08-10 00:00:00
Account Value: 11202.33
    Buy Price: 11124.37
    Num Shares: 1.0
    Remaining Value: 77.96
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 12192.45
    Updated Value: 12270.41

-------------------------

Buy Date: 
2007-04-13 00:00:00
Account Value: 12270.41
    Buy Price: 12612.13
    Num Shares: 0.0
    Remaining Value: 12270.41
Sell Date: 
2007-08-07 00:00:00
    Sell Price: 13504.3
    Updated Value: 12270.41

-------------------------

Buy Date: 
2007-09-24 00:00:00
Account Value: 12270.41
    Buy Price: 13759.06
    Num Shares: 0.0
    Remaining Value: 12270.41
Sell Date: 
2007-11-14 00:00:00
    Sell Price: 13231.01
    Updated Value: 12270.41

-------------------------

Buy Date: 
2008-04-11 00:00:00
Account Value: 12270.41
    Buy Price: 12325.42
    Num Shares: 0.0
    Remaining Value: 12270.41
Sell Date: 
2008-06-10 00:00:00
    Sell Price: 12289.76
    Updated Value: 12270.41

-------------------------

Buy Date: 
2009-04-16 00:00:00
Account Value: 12270.41
    Buy Price: 8125.43
    Num Shares: 1.0
    Remaining Value: 4144.98
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 10270.55
    Updated Value: 14415.53

-------------------------

Buy Date: 
2010-03-09 00:00:00
Account Value: 14415.53
    Buy Price: 10564.38
    Num Shares: 1.0
    Remaining Value: 3851.15
Sell Date: 
2010-05-24 00:00:00
    Sell Price: 10066.57
    Updated Value: 13917.72

-------------------------

Buy Date: 
2010-08-04 00:00:00
Account Value: 13917.72
    Buy Price: 10680.43
    Num Shares: 1.0
    Remaining Value: 3237.29
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 9985.81
    Updated Value: 13223.1

-------------------------

Buy Date: 
2010-09-10 00:00:00
Account Value: 13223.1
    Buy Price: 10462.77
    Num Shares: 1.0
    Remaining Value: 2760.33
Sell Date: 
2011-06-10 00:00:00
    Sell Price: 11951.91
    Updated Value: 14712.24

-------------------------

Buy Date: 
2011-07-11 00:00:00
Account Value: 14712.24
    Buy Price: 12505.76
    Num Shares: 1.0
    Remaining Value: 2206.48
Sell Date: 
2011-08-03 00:00:00
    Sell Price: 11896.44
    Updated Value: 14102.92

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 14102.92
    Buy Price: 11869.04
    Num Shares: 1.0
    Remaining Value: 2233.88
Sell Date: 
2012-05-16 00:00:00
    Sell Price: 12598.55
    Updated Value: 14832.43

-------------------------

Buy Date: 
2012-07-26 00:00:00
Account Value: 14832.43
    Buy Price: 12887.93
    Num Shares: 1.0
    Remaining Value: 1944.5
Sell Date: 
2012-11-05 00:00:00
    Sell Price: 13112.44
    Updated Value: 15056.94

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 15056.94
    Buy Price: 13471.22
    Num Shares: 1.0
    Remaining Value: 1585.72
Sell Date: 
2013-07-03 00:00:00
    Sell Price: 14988.55
    Updated Value: 16574.27

-------------------------

Buy Date: 
2013-07-05 00:00:00
Account Value: 16574.27
    Buy Price: 15135.84
    Num Shares: 1.0
    Remaining Value: 1438.43
Sell Date: 
2013-08-23 00:00:00
    Sell Price: 15010.51
    Updated Value: 16448.94

-------------------------

Buy Date: 
2013-09-18 00:00:00
Account Value: 16448.94
    Buy Price: 15676.94
    Num Shares: 1.0
    Remaining Value: 772.0
Sell Date: 
2013-10-07 00:00:00
    Sell Price: 14936.24
    Updated Value: 15708.24

-------------------------

Buy Date: 
2013-10-24 00:00:00
Account Value: 15708.24
    Buy Price: 15509.21
    Num Shares: 1.0
    Remaining Value: 199.03
Sell Date: 
2014-02-05 00:00:00
    Sell Price: 15440.23
    Updated Value: 15639.26

-------------------------

Buy Date: 
2014-02-25 00:00:00
Account Value: 15639.26
    Buy Price: 16179.66
    Num Shares: 0.0
    Remaining Value: 15639.26
Sell Date: 
2014-08-08 00:00:00
    Sell Price: 16553.93
    Updated Value: 15639.26

-------------------------

Buy Date: 
2014-08-25 00:00:00
Account Value: 15639.26
    Buy Price: 17076.87
    Num Shares: 0.0
    Remaining Value: 15639.26
Sell Date: 
2014-10-10 00:00:00
    Sell Price: 16544.1
    Updated Value: 15639.26

-------------------------

Buy Date: 
2014-11-04 00:00:00
Account Value: 15639.26
    Buy Price: 17383.84
    Num Shares: 0.0
    Remaining Value: 15639.26
Sell Date: 
2015-02-06 00:00:00
    Sell Price: 17824.29
    Updated Value: 15639.26

-------------------------

Buy Date: 
2015-02-12 00:00:00
Account Value: 15639.26
    Buy Price: 17972.38
    Num Shares: 0.0
    Remaining Value: 15639.26
Sell Date: 
2015-04-08 00:00:00
    Sell Price: 17902.51
    Updated Value: 15639.26

-------------------------

Buy Date: 
2015-04-10 00:00:00
Account Value: 15639.26
    Buy Price: 18057.65
    Num Shares: 0.0
    Remaining Value: 15639.26
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 15639.26


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 15639.26





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-03-09 00:00:00
Account Value: 10000
    Buy Price: 10644.62
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-03-12 00:00:00
    Sell Price: 10208.25
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-05-01 00:00:00
Account Value: 10000.0
    Buy Price: 10898.34
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-02 00:00:00
    Sell Price: 10593.72
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-07-03 00:00:00
Account Value: 10000.0
    Buy Price: 10571.11
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-05 00:00:00
    Sell Price: 10479.86
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-26 00:00:00
Account Value: 10000.0
    Buy Price: 10088.14
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-06 00:00:00
    Sell Price: 9808.04
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-17 00:00:00
Account Value: 10000.0
    Buy Price: 10353.08
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-04 00:00:00
    Sell Price: 9687.84
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-11-29 00:00:00
Account Value: 10000.0
    Buy Price: 8896.09
    Num Shares: 1.0
    Remaining Value: 1103.91
Sell Date: 
2002-12-31 00:00:00
    Sell Price: 8341.63
    Updated Value: 9445.54

-------------------------

Buy Date: 
2003-01-02 00:00:00
Account Value: 9445.54
    Buy Price: 8607.52
    Num Shares: 1.0
    Remaining Value: 838.02
Sell Date: 
2003-01-30 00:00:00
    Sell Price: 7945.13
    Updated Value: 8783.15

-------------------------

Buy Date: 
2003-04-28 00:00:00
Account Value: 8783.15
    Buy Price: 8471.61
    Num Shares: 1.0
    Remaining Value: 311.54
Sell Date: 
2004-05-11 00:00:00
    Sell Price: 10019.47
    Updated Value: 10331.01

-------------------------

Buy Date: 
2004-09-13 00:00:00
Account Value: 10331.01
    Buy Price: 10314.76
    Num Shares: 1.0
    Remaining Value: 16.25
Sell Date: 
2004-09-24 00:00:00
    Sell Price: 10047.24
    Updated Value: 10063.49

-------------------------

Buy Date: 
2004-11-10 00:00:00
Account Value: 10063.49
    Buy Price: 10385.48
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2005-04-11 00:00:00
    Sell Price: 10448.56
    Updated Value: 10063.49

-------------------------

Buy Date: 
2005-04-12 00:00:00
Account Value: 10063.49
    Buy Price: 10507.97
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2005-04-13 00:00:00
    Sell Price: 10403.93
    Updated Value: 10063.49

-------------------------

Buy Date: 
2005-07-21 00:00:00
Account Value: 10063.49
    Buy Price: 10627.77
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2005-10-11 00:00:00
    Sell Price: 10253.17
    Updated Value: 10063.49

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10063.49
    Buy Price: 10686.04
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2006-06-14 00:00:00
    Sell Price: 10816.91
    Updated Value: 10063.49

-------------------------

Buy Date: 
2006-07-10 00:00:00
Account Value: 10063.49
    Buy Price: 11103.55
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2006-07-17 00:00:00
    Sell Price: 10747.36
    Updated Value: 10063.49

-------------------------

Buy Date: 
2006-08-04 00:00:00
Account Value: 10063.49
    Buy Price: 11240.35
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2007-11-13 00:00:00
    Sell Price: 13307.09
    Updated Value: 10063.49

-------------------------

Buy Date: 
2008-05-02 00:00:00
Account Value: 10063.49
    Buy Price: 13058.2
    Num Shares: 0.0
    Remaining Value: 10063.49
Sell Date: 
2008-06-02 00:00:00
    Sell Price: 12503.82
    Updated Value: 10063.49

-------------------------

Buy Date: 
2009-05-07 00:00:00
Account Value: 10063.49
    Buy Price: 8409.85
    Num Shares: 1.0
    Remaining Value: 1653.64
Sell Date: 
2010-05-25 00:00:00
    Sell Price: 10043.75
    Updated Value: 11697.39

-------------------------

Buy Date: 
2010-08-05 00:00:00
Account Value: 11697.39
    Buy Price: 10674.98
    Num Shares: 1.0
    Remaining Value: 1022.41
Sell Date: 
2010-08-17 00:00:00
    Sell Price: 10405.85
    Updated Value: 11428.26

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 11428.26
    Buy Price: 10739.31
    Num Shares: 1.0
    Remaining Value: 688.95
Sell Date: 
2011-06-16 00:00:00
    Sell Price: 11961.52
    Updated Value: 12650.47

-------------------------

Buy Date: 
2011-07-05 00:00:00
Account Value: 12650.47
    Buy Price: 12569.87
    Num Shares: 1.0
    Remaining Value: 80.6
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 11383.68
    Updated Value: 11464.28

-------------------------

Buy Date: 
2011-11-04 00:00:00
Account Value: 11464.28
    Buy Price: 11983.24
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2011-11-28 00:00:00
    Sell Price: 11523.01
    Updated Value: 11464.28

-------------------------

Buy Date: 
2011-12-08 00:00:00
Account Value: 11464.28
    Buy Price: 11997.7
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2012-05-24 00:00:00
    Sell Price: 12529.75
    Updated Value: 11464.28

-------------------------

Buy Date: 
2012-08-06 00:00:00
Account Value: 11464.28
    Buy Price: 13117.51
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2012-11-16 00:00:00
    Sell Price: 12588.31
    Updated Value: 11464.28

-------------------------

Buy Date: 
2012-12-11 00:00:00
Account Value: 11464.28
    Buy Price: 13248.44
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2013-08-30 00:00:00
    Sell Price: 14810.31
    Updated Value: 11464.28

-------------------------

Buy Date: 
2013-09-13 00:00:00
Account Value: 11464.28
    Buy Price: 15376.06
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2013-10-09 00:00:00
    Sell Price: 14802.98
    Updated Value: 11464.28

-------------------------

Buy Date: 
2013-10-22 00:00:00
Account Value: 11464.28
    Buy Price: 15467.66
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2014-08-14 00:00:00
    Sell Price: 16713.58
    Updated Value: 11464.28

-------------------------

Buy Date: 
2014-08-15 00:00:00
Account Value: 11464.28
    Buy Price: 16662.91
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2014-10-14 00:00:00
    Sell Price: 16315.19
    Updated Value: 11464.28

-------------------------

Buy Date: 
2014-11-03 00:00:00
Account Value: 11464.28
    Buy Price: 17366.24
    Num Shares: 0.0
    Remaining Value: 11464.28
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11464.28


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11464.28





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-26 00:00:00
Account Value: 10000
    Buy Price: 10692.35
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-18 00:00:00
    Sell Price: 10569.83
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-07-20 00:00:00
Account Value: 10000.0
    Buy Price: 10576.65
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-17 00:00:00
    Sell Price: 10240.78
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-06 00:00:00
Account Value: 10000.0
    Buy Price: 10574.29
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-11 00:00:00
    Sell Price: 9517.26
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-04-25 00:00:00
Account Value: 10000.0
    Buy Price: 8306.35
    Num Shares: 1.0
    Remaining Value: 1693.65
Sell Date: 
2004-07-23 00:00:00
    Sell Price: 9962.22
    Updated Value: 11655.87

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 11655.87
    Buy Price: 10550.24
    Num Shares: 1.0
    Remaining Value: 1105.63
Sell Date: 
2005-04-21 00:00:00
    Sell Price: 10218.6
    Updated Value: 11324.23

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 11324.23
    Buy Price: 10537.6
    Num Shares: 1.0
    Remaining Value: 786.63
Sell Date: 
2005-07-05 00:00:00
    Sell Price: 10371.8
    Updated Value: 11158.43

-------------------------

Buy Date: 
2005-07-18 00:00:00
Account Value: 11158.43
    Buy Price: 10574.99
    Num Shares: 1.0
    Remaining Value: 583.44
Sell Date: 
2005-08-26 00:00:00
    Sell Price: 10397.29
    Updated Value: 10980.73

-------------------------

Buy Date: 
2005-09-15 00:00:00
Account Value: 10980.73
    Buy Price: 10558.75
    Num Shares: 1.0
    Remaining Value: 421.98
Sell Date: 
2005-09-23 00:00:00
    Sell Price: 10419.59
    Updated Value: 10841.57

-------------------------

Buy Date: 
2005-11-14 00:00:00
Account Value: 10841.57
    Buy Price: 10697.17
    Num Shares: 1.0
    Remaining Value: 144.4
Sell Date: 
2006-07-26 00:00:00
    Sell Price: 11102.51
    Updated Value: 11246.91

-------------------------

Buy Date: 
2006-07-27 00:00:00
Account Value: 11246.91
    Buy Price: 11100.43
    Num Shares: 1.0
    Remaining Value: 146.48
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 12799.04
    Updated Value: 12945.52

-------------------------

Buy Date: 
2007-12-07 00:00:00
Account Value: 12945.52
    Buy Price: 13625.58
    Num Shares: 0.0
    Remaining Value: 12945.52
Sell Date: 
2008-01-07 00:00:00
    Sell Price: 12827.49
    Updated Value: 12945.52

-------------------------

Buy Date: 
2009-07-21 00:00:00
Account Value: 12945.52
    Buy Price: 8915.94
    Num Shares: 1.0
    Remaining Value: 4029.58
Sell Date: 
2010-06-02 00:00:00
    Sell Price: 10249.54
    Updated Value: 14279.12

-------------------------

Buy Date: 
2010-06-23 00:00:00
Account Value: 14279.12
    Buy Price: 10298.44
    Num Shares: 1.0
    Remaining Value: 3980.68
Sell Date: 
2010-06-30 00:00:00
    Sell Price: 9774.02
    Updated Value: 13754.7

-------------------------

Buy Date: 
2010-08-03 00:00:00
Account Value: 13754.7
    Buy Price: 10636.38
    Num Shares: 1.0
    Remaining Value: 3118.32
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 10213.62
    Updated Value: 13331.94

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 13331.94
    Buy Price: 10753.62
    Num Shares: 1.0
    Remaining Value: 2578.32
Sell Date: 
2011-08-09 00:00:00
    Sell Price: 11239.77
    Updated Value: 13818.09

-------------------------

Buy Date: 
2011-12-13 00:00:00
Account Value: 13818.09
    Buy Price: 11954.94
    Num Shares: 1.0
    Remaining Value: 1863.15
Sell Date: 
2011-12-20 00:00:00
    Sell Price: 12103.58
    Updated Value: 13966.73

-------------------------

Buy Date: 
2011-12-29 00:00:00
Account Value: 13966.73
    Buy Price: 12287.04
    Num Shares: 1.0
    Remaining Value: 1679.69
Sell Date: 
2012-11-15 00:00:00
    Sell Price: 12570.95
    Updated Value: 14250.64

-------------------------

Buy Date: 
2012-12-06 00:00:00
Account Value: 14250.64
    Buy Price: 13074.04
    Num Shares: 1.0
    Remaining Value: 1176.6
Sell Date: 
2014-10-21 00:00:00
    Sell Price: 16614.81
    Updated Value: 17791.41

-------------------------

Buy Date: 
2014-10-29 00:00:00
Account Value: 17791.41
    Buy Price: 16974.31
    Num Shares: 1.0
    Remaining Value: 817.1
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 18874.75


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 18874.75





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-25 00:00:00
Account Value: 10000
    Buy Price: 10625.2
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-28 00:00:00
    Sell Price: 10222.03
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-06 00:00:00
Account Value: 10000.0
    Buy Price: 10574.29
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-24 00:00:00
    Sell Price: 10030.43
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-21 00:00:00
Account Value: 10000.0
    Buy Price: 10105.71
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-04 00:00:00
    Sell Price: 9687.84
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-16 00:00:00
Account Value: 10000.0
    Buy Price: 8678.97
    Num Shares: 1.0
    Remaining Value: 1321.03
Sell Date: 
2004-08-12 00:00:00
    Sell Price: 9814.59
    Updated Value: 11135.62

-------------------------

Buy Date: 
2004-08-30 00:00:00
Account Value: 11135.62
    Buy Price: 10122.52
    Num Shares: 1.0
    Remaining Value: 1013.1
Sell Date: 
2004-09-30 00:00:00
    Sell Price: 10080.27
    Updated Value: 11093.37

-------------------------

Buy Date: 
2004-11-12 00:00:00
Account Value: 11093.37
    Buy Price: 10539.01
    Num Shares: 1.0
    Remaining Value: 554.36
Sell Date: 
2005-04-22 00:00:00
    Sell Price: 10157.71
    Updated Value: 10712.07

-------------------------

Buy Date: 
2005-05-24 00:00:00
Account Value: 10712.07
    Buy Price: 10503.68
    Num Shares: 1.0
    Remaining Value: 208.39
Sell Date: 
2005-07-07 00:00:00
    Sell Price: 10302.29
    Updated Value: 10510.68

-------------------------

Buy Date: 
2005-07-11 00:00:00
Account Value: 10510.68
    Buy Price: 10519.72
    Num Shares: 0.0
    Remaining Value: 10510.68
Sell Date: 
2005-10-03 00:00:00
    Sell Price: 10535.48
    Updated Value: 10510.68

-------------------------

Buy Date: 
2005-11-14 00:00:00
Account Value: 10510.68
    Buy Price: 10697.17
    Num Shares: 0.0
    Remaining Value: 10510.68
Sell Date: 
2008-01-10 00:00:00
    Sell Price: 12853.09
    Updated Value: 10510.68

-------------------------

Buy Date: 
2009-08-04 00:00:00
Account Value: 10510.68
    Buy Price: 9320.19
    Num Shares: 1.0
    Remaining Value: 1190.49
Sell Date: 
2010-07-08 00:00:00
    Sell Price: 10138.99
    Updated Value: 11329.48

-------------------------

Buy Date: 
2010-07-19 00:00:00
Account Value: 11329.48
    Buy Price: 10154.43
    Num Shares: 1.0
    Remaining Value: 1175.05
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 9985.81
    Updated Value: 11160.86

-------------------------

Buy Date: 
2010-09-14 00:00:00
Account Value: 11160.86
    Buy Price: 10526.49
    Num Shares: 1.0
    Remaining Value: 634.37
Sell Date: 
2011-08-12 00:00:00
    Sell Price: 11269.02
    Updated Value: 11903.39

-------------------------

Buy Date: 
2011-11-03 00:00:00
Account Value: 11903.39
    Buy Price: 12044.47
    Num Shares: 0.0
    Remaining Value: 11903.39
Sell Date: 
2011-11-22 00:00:00
    Sell Price: 11493.72
    Updated Value: 11903.39

-------------------------

Buy Date: 
2011-12-12 00:00:00
Account Value: 11903.39
    Buy Price: 12021.39
    Num Shares: 0.0
    Remaining Value: 11903.39
Sell Date: 
2011-12-21 00:00:00
    Sell Price: 12107.74
    Updated Value: 11903.39

-------------------------

Buy Date: 
2011-12-29 00:00:00
Account Value: 11903.39
    Buy Price: 12287.04
    Num Shares: 0.0
    Remaining Value: 11903.39
Sell Date: 
2012-11-21 00:00:00
    Sell Price: 12836.89
    Updated Value: 11903.39

-------------------------

Buy Date: 
2012-11-30 00:00:00
Account Value: 11903.39
    Buy Price: 13025.58
    Num Shares: 0.0
    Remaining Value: 11903.39
Sell Date: 
2014-10-24 00:00:00
    Sell Price: 16805.41
    Updated Value: 11903.39

-------------------------

Buy Date: 
2014-10-27 00:00:00
Account Value: 11903.39
    Buy Price: 16817.94
    Num Shares: 0.0
    Remaining Value: 11903.39
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11903.39


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11903.39





-----------------------------------------------------------------------
DJIA Calculations, N = [10, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-24 00:00:00
Account Value: 10000
    Buy Price: 10454.34
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-30 00:00:00
    Sell Price: 9919.58
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-08 00:00:00
Account Value: 10000.0
    Buy Price: 10572.49
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-24 00:00:00
    Sell Price: 10030.43
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-21 00:00:00
Account Value: 10000.0
    Buy Price: 10105.71
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-31 00:00:00
    Sell Price: 9925.25
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-09 00:00:00
Account Value: 10000.0
    Buy Price: 8980.0
    Num Shares: 1.0
    Remaining Value: 1020.0
Sell Date: 
2004-10-20 00:00:00
    Sell Price: 9886.93
    Updated Value: 10906.93

-------------------------

Buy Date: 
2004-11-09 00:00:00
Account Value: 10906.93
    Buy Price: 10386.37
    Num Shares: 1.0
    Remaining Value: 520.56
Sell Date: 
2005-04-21 00:00:00
    Sell Price: 10218.6
    Updated Value: 10739.16

-------------------------

Buy Date: 
2005-05-17 00:00:00
Account Value: 10739.16
    Buy Price: 10331.88
    Num Shares: 1.0
    Remaining Value: 407.28
Sell Date: 
2005-05-18 00:00:00
    Sell Price: 10464.45
    Updated Value: 10871.73

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 10871.73
    Buy Price: 10471.91
    Num Shares: 1.0
    Remaining Value: 399.82
Sell Date: 
2005-10-13 00:00:00
    Sell Price: 10216.59
    Updated Value: 10616.41

-------------------------

Buy Date: 
2005-11-09 00:00:00
Account Value: 10616.41
    Buy Price: 10546.21
    Num Shares: 1.0
    Remaining Value: 70.2
Sell Date: 
2008-01-14 00:00:00
    Sell Price: 12778.15
    Updated Value: 12848.35

-------------------------

Buy Date: 
2009-08-31 00:00:00
Account Value: 12848.35
    Buy Price: 9496.28
    Num Shares: 1.0
    Remaining Value: 3352.07
Sell Date: 
2011-08-17 00:00:00
    Sell Price: 11410.21
    Updated Value: 14762.28

-------------------------

Buy Date: 
2011-09-07 00:00:00
Account Value: 14762.28
    Buy Price: 11414.86
    Num Shares: 1.0
    Remaining Value: 3347.42
Sell Date: 
2011-09-08 00:00:00
    Sell Price: 11295.81
    Updated Value: 14643.23

-------------------------

Buy Date: 
2011-09-09 00:00:00
Account Value: 14643.23
    Buy Price: 10992.13
    Num Shares: 1.0
    Remaining Value: 3651.1
Sell Date: 
2011-09-12 00:00:00
    Sell Price: 11061.12
    Updated Value: 14712.22

-------------------------

Buy Date: 
2011-10-25 00:00:00
Account Value: 14712.22
    Buy Price: 11706.62
    Num Shares: 1.0
    Remaining Value: 3005.6
Sell Date: 
2011-11-29 00:00:00
    Sell Price: 11555.63
    Updated Value: 14561.23

-------------------------

Buy Date: 
2011-12-08 00:00:00
Account Value: 14561.23
    Buy Price: 11997.7
    Num Shares: 1.0
    Remaining Value: 2563.53
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20621.18


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20621.18





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-07 00:00:00
Account Value: 10000
    Buy Price: 10946.72
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-03-01 00:00:00
    Sell Price: 10450.14
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-04-20 00:00:00
Account Value: 10000.0
    Buy Price: 10579.85
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-14 00:00:00
    Sell Price: 10690.13
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-08-01 00:00:00
Account Value: 10000.0
    Buy Price: 10510.01
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 10298.56
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-08-14 00:00:00
Account Value: 10000.0
    Buy Price: 10412.17
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-20 00:00:00
    Sell Price: 10320.07
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-10-19 00:00:00
Account Value: 10000.0
    Buy Price: 9204.11
    Num Shares: 1.0
    Remaining Value: 795.89
Sell Date: 
2002-01-28 00:00:00
    Sell Price: 9865.75
    Updated Value: 10661.64

-------------------------

Buy Date: 
2002-02-26 00:00:00
Account Value: 10661.64
    Buy Price: 10115.26
    Num Shares: 1.0
    Remaining Value: 546.38
Sell Date: 
2002-04-09 00:00:00
    Sell Price: 10208.67
    Updated Value: 10755.05

-------------------------

Buy Date: 
2002-05-28 00:00:00
Account Value: 10755.05
    Buy Price: 9981.58
    Num Shares: 1.0
    Remaining Value: 773.47
Sell Date: 
2002-06-10 00:00:00
    Sell Price: 9645.4
    Updated Value: 10418.87

-------------------------

Buy Date: 
2002-08-16 00:00:00
Account Value: 10418.87
    Buy Price: 8778.06
    Num Shares: 1.0
    Remaining Value: 1640.81
Sell Date: 
2002-09-16 00:00:00
    Sell Price: 8380.18
    Updated Value: 10020.99

-------------------------

Buy Date: 
2002-10-28 00:00:00
Account Value: 10020.99
    Buy Price: 8368.04
    Num Shares: 1.0
    Remaining Value: 1652.95
Sell Date: 
2002-12-23 00:00:00
    Sell Price: 8493.29
    Updated Value: 10146.24

-------------------------

Buy Date: 
2003-01-16 00:00:00
Account Value: 10146.24
    Buy Price: 8697.87
    Num Shares: 1.0
    Remaining Value: 1448.37
Sell Date: 
2003-02-03 00:00:00
    Sell Price: 8109.82
    Updated Value: 9558.19

-------------------------

Buy Date: 
2003-03-26 00:00:00
Account Value: 9558.19
    Buy Price: 8229.88
    Num Shares: 1.0
    Remaining Value: 1328.31
Sell Date: 
2003-07-14 00:00:00
    Sell Price: 9177.15
    Updated Value: 10505.46

-------------------------

Buy Date: 
2003-07-25 00:00:00
Account Value: 10505.46
    Buy Price: 9284.57
    Num Shares: 1.0
    Remaining Value: 1220.89
Sell Date: 
2003-07-28 00:00:00
    Sell Price: 9266.51
    Updated Value: 10487.4

-------------------------

Buy Date: 
2003-07-29 00:00:00
Account Value: 10487.4
    Buy Price: 9204.46
    Num Shares: 1.0
    Remaining Value: 1282.94
Sell Date: 
2003-10-09 00:00:00
    Sell Price: 9680.01
    Updated Value: 10962.95

-------------------------

Buy Date: 
2003-10-16 00:00:00
Account Value: 10962.95
    Buy Price: 9791.72
    Num Shares: 1.0
    Remaining Value: 1171.23
Sell Date: 
2003-12-04 00:00:00
    Sell Price: 9930.82
    Updated Value: 11102.05

-------------------------

Buy Date: 
2003-12-11 00:00:00
Account Value: 11102.05
    Buy Price: 10008.16
    Num Shares: 1.0
    Remaining Value: 1093.89
Sell Date: 
2004-02-18 00:00:00
    Sell Price: 10671.99
    Updated Value: 11765.88

-------------------------

Buy Date: 
2004-02-19 00:00:00
Account Value: 11765.88
    Buy Price: 10664.73
    Num Shares: 1.0
    Remaining Value: 1101.15
Sell Date: 
2004-03-11 00:00:00
    Sell Price: 10128.38
    Updated Value: 11229.53

-------------------------

Buy Date: 
2004-04-14 00:00:00
Account Value: 11229.53
    Buy Price: 10377.95
    Num Shares: 1.0
    Remaining Value: 851.58
Sell Date: 
2004-05-06 00:00:00
    Sell Price: 10241.26
    Updated Value: 11092.84

-------------------------

Buy Date: 
2004-06-10 00:00:00
Account Value: 11092.84
    Buy Price: 10410.1
    Num Shares: 1.0
    Remaining Value: 682.74
Sell Date: 
2004-07-15 00:00:00
    Sell Price: 10163.16
    Updated Value: 10845.9

-------------------------

Buy Date: 
2004-09-02 00:00:00
Account Value: 10845.9
    Buy Price: 10290.28
    Num Shares: 1.0
    Remaining Value: 555.62
Sell Date: 
2004-10-04 00:00:00
    Sell Price: 10216.54
    Updated Value: 10772.16

-------------------------

Buy Date: 
2004-11-12 00:00:00
Account Value: 10772.16
    Buy Price: 10539.01
    Num Shares: 1.0
    Remaining Value: 233.15
Sell Date: 
2005-01-20 00:00:00
    Sell Price: 10471.47
    Updated Value: 10704.62

-------------------------

Buy Date: 
2005-02-15 00:00:00
Account Value: 10704.62
    Buy Price: 10837.32
    Num Shares: 0.0
    Remaining Value: 10704.62
Sell Date: 
2005-03-24 00:00:00
    Sell Price: 10442.87
    Updated Value: 10704.62

-------------------------

Buy Date: 
2005-05-19 00:00:00
Account Value: 10704.62
    Buy Price: 10493.19
    Num Shares: 1.0
    Remaining Value: 211.43
Sell Date: 
2005-07-05 00:00:00
    Sell Price: 10371.8
    Updated Value: 10583.23

-------------------------

Buy Date: 
2005-07-25 00:00:00
Account Value: 10583.23
    Buy Price: 10596.48
    Num Shares: 0.0
    Remaining Value: 10583.23
Sell Date: 
2005-08-22 00:00:00
    Sell Price: 10569.89
    Updated Value: 10583.23

-------------------------

Buy Date: 
2005-09-21 00:00:00
Account Value: 10583.23
    Buy Price: 10378.03
    Num Shares: 1.0
    Remaining Value: 205.2
Sell Date: 
2005-10-04 00:00:00
    Sell Price: 10441.11
    Updated Value: 10646.31

-------------------------

Buy Date: 
2005-11-08 00:00:00
Account Value: 10646.31
    Buy Price: 10539.72
    Num Shares: 1.0
    Remaining Value: 106.59
Sell Date: 
2005-12-28 00:00:00
    Sell Price: 10796.26
    Updated Value: 10902.85

-------------------------

Buy Date: 
2006-01-10 00:00:00
Account Value: 10902.85
    Buy Price: 11011.58
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2006-02-02 00:00:00
    Sell Price: 10851.98
    Updated Value: 10902.85

-------------------------

Buy Date: 
2006-02-16 00:00:00
Account Value: 10902.85
    Buy Price: 11120.68
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2006-04-19 00:00:00
    Sell Price: 11278.77
    Updated Value: 10902.85

-------------------------

Buy Date: 
2006-05-01 00:00:00
Account Value: 10902.85
    Buy Price: 11343.29
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2006-05-30 00:00:00
    Sell Price: 11094.43
    Updated Value: 10902.85

-------------------------

Buy Date: 
2006-07-10 00:00:00
Account Value: 10902.85
    Buy Price: 11103.55
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2006-07-26 00:00:00
    Sell Price: 11102.51
    Updated Value: 10902.85

-------------------------

Buy Date: 
2006-08-08 00:00:00
Account Value: 10902.85
    Buy Price: 11173.59
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 12192.45
    Updated Value: 10902.85

-------------------------

Buy Date: 
2007-04-04 00:00:00
Account Value: 10902.85
    Buy Price: 12530.05
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2007-06-25 00:00:00
    Sell Price: 13352.05
    Updated Value: 10902.85

-------------------------

Buy Date: 
2007-07-05 00:00:00
Account Value: 10902.85
    Buy Price: 13565.84
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2007-07-06 00:00:00
    Sell Price: 13611.68
    Updated Value: 10902.85

-------------------------

Buy Date: 
2007-07-16 00:00:00
Account Value: 10902.85
    Buy Price: 13950.98
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2007-08-08 00:00:00
    Sell Price: 13657.86
    Updated Value: 10902.85

-------------------------

Buy Date: 
2007-09-12 00:00:00
Account Value: 10902.85
    Buy Price: 13291.65
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2007-10-30 00:00:00
    Sell Price: 13792.47
    Updated Value: 10902.85

-------------------------

Buy Date: 
2007-12-14 00:00:00
Account Value: 10902.85
    Buy Price: 13339.85
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2008-01-07 00:00:00
    Sell Price: 12827.49
    Updated Value: 10902.85

-------------------------

Buy Date: 
2008-02-28 00:00:00
Account Value: 10902.85
    Buy Price: 12582.18
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2008-03-06 00:00:00
    Sell Price: 12040.39
    Updated Value: 10902.85

-------------------------

Buy Date: 
2008-04-04 00:00:00
Account Value: 10902.85
    Buy Price: 12609.42
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2008-05-28 00:00:00
    Sell Price: 12594.03
    Updated Value: 10902.85

-------------------------

Buy Date: 
2008-08-05 00:00:00
Account Value: 10902.85
    Buy Price: 11615.77
    Num Shares: 0.0
    Remaining Value: 10902.85
Sell Date: 
2008-09-08 00:00:00
    Sell Price: 11510.74
    Updated Value: 10902.85

-------------------------

Buy Date: 
2008-11-17 00:00:00
Account Value: 10902.85
    Buy Price: 8273.58
    Num Shares: 1.0
    Remaining Value: 2629.27
Sell Date: 
2008-11-21 00:00:00
    Sell Price: 8046.42
    Updated Value: 10675.69

-------------------------

Buy Date: 
2008-12-17 00:00:00
Account Value: 10675.69
    Buy Price: 8824.34
    Num Shares: 1.0
    Remaining Value: 1851.35
Sell Date: 
2009-01-14 00:00:00
    Sell Price: 8200.14
    Updated Value: 10051.49

-------------------------

Buy Date: 
2009-01-15 00:00:00
Account Value: 10051.49
    Buy Price: 8212.49
    Num Shares: 1.0
    Remaining Value: 1839.0
Sell Date: 
2009-01-20 00:00:00
    Sell Price: 7949.09
    Updated Value: 9788.09

-------------------------

Buy Date: 
2009-01-21 00:00:00
Account Value: 9788.09
    Buy Price: 8228.1
    Num Shares: 1.0
    Remaining Value: 1559.99
Sell Date: 
2009-01-23 00:00:00
    Sell Price: 8077.56
    Updated Value: 9637.55

-------------------------

Buy Date: 
2009-03-27 00:00:00
Account Value: 9637.55
    Buy Price: 7776.18
    Num Shares: 1.0
    Remaining Value: 1861.37
Sell Date: 
2009-07-01 00:00:00
    Sell Price: 8504.06
    Updated Value: 10365.43

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 10365.43
    Buy Price: 9108.51
    Num Shares: 1.0
    Remaining Value: 1256.92
Sell Date: 
2010-02-02 00:00:00
    Sell Price: 10296.85
    Updated Value: 11553.77

-------------------------

Buy Date: 
2010-03-03 00:00:00
Account Value: 11553.77
    Buy Price: 10396.76
    Num Shares: 1.0
    Remaining Value: 1157.01
Sell Date: 
2010-05-13 00:00:00
    Sell Price: 10782.95
    Updated Value: 11939.96

-------------------------

Buy Date: 
2010-06-28 00:00:00
Account Value: 11939.96
    Buy Price: 10138.52
    Num Shares: 1.0
    Remaining Value: 1801.44
Sell Date: 
2010-07-09 00:00:00
    Sell Price: 10198.03
    Updated Value: 11999.47

-------------------------

Buy Date: 
2010-07-27 00:00:00
Account Value: 11999.47
    Buy Price: 10537.69
    Num Shares: 1.0
    Remaining Value: 1461.78
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 9985.81
    Updated Value: 11447.59

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 11447.59
    Buy Price: 10753.62
    Num Shares: 1.0
    Remaining Value: 693.97
Sell Date: 
2010-12-01 00:00:00
    Sell Price: 11255.78
    Updated Value: 11949.75

-------------------------

Buy Date: 
2010-12-15 00:00:00
Account Value: 11949.75
    Buy Price: 11457.47
    Num Shares: 1.0
    Remaining Value: 492.28
Sell Date: 
2011-03-14 00:00:00
    Sell Price: 11993.16
    Updated Value: 12485.44

-------------------------

Buy Date: 
2011-04-06 00:00:00
Account Value: 12485.44
    Buy Price: 12426.75
    Num Shares: 1.0
    Remaining Value: 58.69
Sell Date: 
2011-05-31 00:00:00
    Sell Price: 12569.79
    Updated Value: 12628.48

-------------------------

Buy Date: 
2011-07-08 00:00:00
Account Value: 12628.48
    Buy Price: 12657.2
    Num Shares: 0.0
    Remaining Value: 12628.48
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 11444.61
    Updated Value: 12628.48

-------------------------

Buy Date: 
2011-09-13 00:00:00
Account Value: 12628.48
    Buy Price: 11105.85
    Num Shares: 1.0
    Remaining Value: 1522.63
Sell Date: 
2011-09-22 00:00:00
    Sell Price: 10733.83
    Updated Value: 12256.46

-------------------------

Buy Date: 
2011-10-20 00:00:00
Account Value: 12256.46
    Buy Price: 11541.78
    Num Shares: 1.0
    Remaining Value: 714.68
Sell Date: 
2011-11-30 00:00:00
    Sell Price: 12045.68
    Updated Value: 12760.36

-------------------------

Buy Date: 
2011-12-16 00:00:00
Account Value: 12760.36
    Buy Price: 11866.39
    Num Shares: 1.0
    Remaining Value: 893.97
Sell Date: 
2012-04-18 00:00:00
    Sell Price: 13032.75
    Updated Value: 13926.72

-------------------------

Buy Date: 
2012-05-07 00:00:00
Account Value: 13926.72
    Buy Price: 13008.53
    Num Shares: 1.0
    Remaining Value: 918.19
Sell Date: 
2012-05-21 00:00:00
    Sell Price: 12504.48
    Updated Value: 13422.67

-------------------------

Buy Date: 
2012-06-25 00:00:00
Account Value: 13422.67
    Buy Price: 12502.66
    Num Shares: 1.0
    Remaining Value: 920.01
Sell Date: 
2012-09-12 00:00:00
    Sell Price: 13333.35
    Updated Value: 14253.36

-------------------------

Buy Date: 
2012-09-17 00:00:00
Account Value: 14253.36
    Buy Price: 13553.1
    Num Shares: 1.0
    Remaining Value: 700.26
Sell Date: 
2012-10-22 00:00:00
    Sell Price: 13345.89
    Updated Value: 14046.15

-------------------------

Buy Date: 
2012-12-11 00:00:00
Account Value: 14046.15
    Buy Price: 13248.44
    Num Shares: 1.0
    Remaining Value: 797.71
Sell Date: 
2013-06-18 00:00:00
    Sell Price: 15318.23
    Updated Value: 16115.94

-------------------------

Buy Date: 
2013-07-17 00:00:00
Account Value: 16115.94
    Buy Price: 15470.52
    Num Shares: 1.0
    Remaining Value: 645.42
Sell Date: 
2013-08-19 00:00:00
    Sell Price: 15010.74
    Updated Value: 15656.16

-------------------------

Buy Date: 
2013-09-20 00:00:00
Account Value: 15656.16
    Buy Price: 15451.09
    Num Shares: 1.0
    Remaining Value: 205.07
Sell Date: 
2013-10-11 00:00:00
    Sell Price: 15237.11
    Updated Value: 15442.18

-------------------------

Buy Date: 
2013-10-29 00:00:00
Account Value: 15442.18
    Buy Price: 15680.35
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2013-12-23 00:00:00
    Sell Price: 16294.61
    Updated Value: 15442.18

-------------------------

Buy Date: 
2013-12-26 00:00:00
Account Value: 15442.18
    Buy Price: 16479.88
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-01-30 00:00:00
    Sell Price: 15848.61
    Updated Value: 15442.18

-------------------------

Buy Date: 
2014-02-28 00:00:00
Account Value: 15442.18
    Buy Price: 16321.71
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-04-02 00:00:00
    Sell Price: 16573.0
    Updated Value: 15442.18

-------------------------

Buy Date: 
2014-04-03 00:00:00
Account Value: 15442.18
    Buy Price: 16572.55
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-04-25 00:00:00
    Sell Price: 16361.46
    Updated Value: 15442.18

-------------------------

Buy Date: 
2014-05-02 00:00:00
Account Value: 15442.18
    Buy Price: 16512.89
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-08-06 00:00:00
    Sell Price: 16443.34
    Updated Value: 15442.18

-------------------------

Buy Date: 
2014-08-29 00:00:00
Account Value: 15442.18
    Buy Price: 17098.45
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-10-09 00:00:00
    Sell Price: 16659.25
    Updated Value: 15442.18

-------------------------

Buy Date: 
2014-11-06 00:00:00
Account Value: 15442.18
    Buy Price: 17554.47
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2014-12-23 00:00:00
    Sell Price: 18024.17
    Updated Value: 15442.18

-------------------------

Buy Date: 
2015-01-08 00:00:00
Account Value: 15442.18
    Buy Price: 17907.87
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2015-01-22 00:00:00
    Sell Price: 17813.98
    Updated Value: 15442.18

-------------------------

Buy Date: 
2015-02-18 00:00:00
Account Value: 15442.18
    Buy Price: 18029.85
    Num Shares: 0.0
    Remaining Value: 15442.18
Sell Date: 
2015-03-20 00:00:00
    Sell Price: 18127.65
    Updated Value: 15442.18


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 15442.18





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-05 00:00:00
Account Value: 10000
    Buy Price: 10965.85
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-03-06 00:00:00
    Sell Price: 10591.22
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000.0
    Buy Price: 10734.97
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-26 00:00:00
    Sell Price: 10472.48
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-09 00:00:00
Account Value: 10000.0
    Buy Price: 9608.0
    Num Shares: 1.0
    Remaining Value: 392.0
Sell Date: 
2002-01-29 00:00:00
    Sell Price: 9618.24
    Updated Value: 10010.24

-------------------------

Buy Date: 
2002-03-04 00:00:00
Account Value: 10010.24
    Buy Price: 10586.82
    Num Shares: 0.0
    Remaining Value: 10010.24
Sell Date: 
2002-04-23 00:00:00
    Sell Price: 10089.24
    Updated Value: 10010.24

-------------------------

Buy Date: 
2002-08-29 00:00:00
Account Value: 10010.24
    Buy Price: 8670.99
    Num Shares: 1.0
    Remaining Value: 1339.25
Sell Date: 
2002-09-17 00:00:00
    Sell Price: 8207.55
    Updated Value: 9546.8

-------------------------

Buy Date: 
2002-11-01 00:00:00
Account Value: 9546.8
    Buy Price: 8517.64
    Num Shares: 1.0
    Remaining Value: 1029.16
Sell Date: 
2002-12-27 00:00:00
    Sell Price: 8303.78
    Updated Value: 9332.94

-------------------------

Buy Date: 
2003-01-21 00:00:00
Account Value: 9332.94
    Buy Price: 8442.9
    Num Shares: 1.0
    Remaining Value: 890.04
Sell Date: 
2003-01-28 00:00:00
    Sell Price: 8088.84
    Updated Value: 8978.88

-------------------------

Buy Date: 
2003-03-31 00:00:00
Account Value: 8978.88
    Buy Price: 7992.13
    Num Shares: 1.0
    Remaining Value: 986.75
Sell Date: 
2004-03-12 00:00:00
    Sell Price: 10240.08
    Updated Value: 11226.83

-------------------------

Buy Date: 
2004-04-23 00:00:00
Account Value: 11226.83
    Buy Price: 10472.84
    Num Shares: 1.0
    Remaining Value: 753.99
Sell Date: 
2004-04-28 00:00:00
    Sell Price: 10342.6
    Updated Value: 11096.59

-------------------------

Buy Date: 
2004-06-18 00:00:00
Account Value: 11096.59
    Buy Price: 10416.41
    Num Shares: 1.0
    Remaining Value: 680.18
Sell Date: 
2004-07-23 00:00:00
    Sell Price: 9962.22
    Updated Value: 10642.4

-------------------------

Buy Date: 
2004-09-08 00:00:00
Account Value: 10642.4
    Buy Price: 10313.36
    Num Shares: 1.0
    Remaining Value: 329.04
Sell Date: 
2004-10-13 00:00:00
    Sell Price: 10002.33
    Updated Value: 10331.37

-------------------------

Buy Date: 
2004-10-14 00:00:00
Account Value: 10331.37
    Buy Price: 9894.45
    Num Shares: 1.0
    Remaining Value: 436.92
Sell Date: 
2004-10-15 00:00:00
    Sell Price: 9933.38
    Updated Value: 10370.3

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 10370.3
    Buy Price: 10550.24
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2005-01-25 00:00:00
    Sell Price: 10461.56
    Updated Value: 10370.3

-------------------------

Buy Date: 
2005-02-17 00:00:00
Account Value: 10370.3
    Buy Price: 10754.26
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2005-03-31 00:00:00
    Sell Price: 10503.76
    Updated Value: 10370.3

-------------------------

Buy Date: 
2005-05-31 00:00:00
Account Value: 10370.3
    Buy Price: 10467.48
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2005-07-12 00:00:00
    Sell Price: 10513.89
    Updated Value: 10370.3

-------------------------

Buy Date: 
2005-07-22 00:00:00
Account Value: 10370.3
    Buy Price: 10651.18
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2005-09-06 00:00:00
    Sell Price: 10589.24
    Updated Value: 10370.3

-------------------------

Buy Date: 
2005-11-15 00:00:00
Account Value: 10370.3
    Buy Price: 10686.44
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2006-02-02 00:00:00
    Sell Price: 10851.98
    Updated Value: 10370.3

-------------------------

Buy Date: 
2006-02-14 00:00:00
Account Value: 10370.3
    Buy Price: 11028.39
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2006-06-01 00:00:00
    Sell Price: 11260.28
    Updated Value: 10370.3

-------------------------

Buy Date: 
2006-08-07 00:00:00
Account Value: 10370.3
    Buy Price: 11219.38
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2007-03-08 00:00:00
    Sell Price: 12260.7
    Updated Value: 10370.3

-------------------------

Buy Date: 
2007-04-17 00:00:00
Account Value: 10370.3
    Buy Price: 12773.04
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2007-08-09 00:00:00
    Sell Price: 13270.68
    Updated Value: 10370.3

-------------------------

Buy Date: 
2007-09-26 00:00:00
Account Value: 10370.3
    Buy Price: 13878.15
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2007-11-08 00:00:00
    Sell Price: 13266.29
    Updated Value: 10370.3

-------------------------

Buy Date: 
2007-12-26 00:00:00
Account Value: 10370.3
    Buy Price: 13551.69
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2008-01-02 00:00:00
    Sell Price: 13043.96
    Updated Value: 10370.3

-------------------------

Buy Date: 
2008-04-07 00:00:00
Account Value: 10370.3
    Buy Price: 12612.43
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2008-06-06 00:00:00
    Sell Price: 12209.81
    Updated Value: 10370.3

-------------------------

Buy Date: 
2008-08-22 00:00:00
Account Value: 10370.3
    Buy Price: 11628.06
    Num Shares: 0.0
    Remaining Value: 10370.3
Sell Date: 
2008-09-17 00:00:00
    Sell Price: 10609.66
    Updated Value: 10370.3

-------------------------

Buy Date: 
2009-01-07 00:00:00
Account Value: 10370.3
    Buy Price: 8769.7
    Num Shares: 1.0
    Remaining Value: 1600.6
Sell Date: 
2009-01-08 00:00:00
    Sell Price: 8742.46
    Updated Value: 10343.06

-------------------------

Buy Date: 
2009-01-14 00:00:00
Account Value: 10343.06
    Buy Price: 8200.14
    Num Shares: 1.0
    Remaining Value: 2142.92
Sell Date: 
2009-01-27 00:00:00
    Sell Price: 8174.73
    Updated Value: 10317.65

-------------------------

Buy Date: 
2009-04-06 00:00:00
Account Value: 10317.65
    Buy Price: 7975.85
    Num Shares: 1.0
    Remaining Value: 2341.8
Sell Date: 
2009-07-08 00:00:00
    Sell Price: 8178.41
    Updated Value: 10520.21

-------------------------

Buy Date: 
2009-07-28 00:00:00
Account Value: 10520.21
    Buy Price: 9096.72
    Num Shares: 1.0
    Remaining Value: 1423.49
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 10270.55
    Updated Value: 11694.04

-------------------------

Buy Date: 
2010-03-10 00:00:00
Account Value: 11694.04
    Buy Price: 10567.33
    Num Shares: 1.0
    Remaining Value: 1126.71
Sell Date: 
2010-05-18 00:00:00
    Sell Price: 10510.95
    Updated Value: 11637.66

-------------------------

Buy Date: 
2010-07-27 00:00:00
Account Value: 11637.66
    Buy Price: 10537.69
    Num Shares: 1.0
    Remaining Value: 1099.97
Sell Date: 
2010-09-01 00:00:00
    Sell Price: 10269.47
    Updated Value: 11369.44

-------------------------

Buy Date: 
2010-09-21 00:00:00
Account Value: 11369.44
    Buy Price: 10761.03
    Num Shares: 1.0
    Remaining Value: 608.41
Sell Date: 
2011-03-24 00:00:00
    Sell Price: 12170.56
    Updated Value: 12778.97

-------------------------

Buy Date: 
2011-04-06 00:00:00
Account Value: 12778.97
    Buy Price: 12426.75
    Num Shares: 1.0
    Remaining Value: 352.22
Sell Date: 
2011-06-06 00:00:00
    Sell Price: 12089.96
    Updated Value: 12442.18

-------------------------

Buy Date: 
2011-07-18 00:00:00
Account Value: 12442.18
    Buy Price: 12385.16
    Num Shares: 1.0
    Remaining Value: 57.02
Sell Date: 
2011-08-09 00:00:00
    Sell Price: 11239.77
    Updated Value: 11296.79

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 11296.79
    Buy Price: 11913.62
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2012-04-24 00:00:00
    Sell Price: 13001.56
    Updated Value: 11296.79

-------------------------

Buy Date: 
2012-05-03 00:00:00
Account Value: 11296.79
    Buy Price: 13206.59
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2012-05-16 00:00:00
    Sell Price: 12598.55
    Updated Value: 11296.79

-------------------------

Buy Date: 
2012-07-09 00:00:00
Account Value: 11296.79
    Buy Price: 12736.29
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2012-11-02 00:00:00
    Sell Price: 13093.16
    Updated Value: 11296.79

-------------------------

Buy Date: 
2012-12-21 00:00:00
Account Value: 11296.79
    Buy Price: 13190.84
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2013-07-01 00:00:00
    Sell Price: 14974.96
    Updated Value: 11296.79

-------------------------

Buy Date: 
2013-07-18 00:00:00
Account Value: 11296.79
    Buy Price: 15548.54
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2013-08-28 00:00:00
    Sell Price: 14824.51
    Updated Value: 11296.79

-------------------------

Buy Date: 
2013-09-27 00:00:00
Account Value: 11296.79
    Buy Price: 15258.24
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2013-10-10 00:00:00
    Sell Price: 15126.07
    Updated Value: 11296.79

-------------------------

Buy Date: 
2013-10-24 00:00:00
Account Value: 11296.79
    Buy Price: 15509.21
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2014-02-05 00:00:00
    Sell Price: 15440.23
    Updated Value: 11296.79

-------------------------

Buy Date: 
2014-03-10 00:00:00
Account Value: 11296.79
    Buy Price: 16418.68
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2014-08-08 00:00:00
    Sell Price: 16553.93
    Updated Value: 11296.79

-------------------------

Buy Date: 
2014-09-03 00:00:00
Account Value: 11296.79
    Buy Price: 17078.28
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2014-10-15 00:00:00
    Sell Price: 16141.74
    Updated Value: 11296.79

-------------------------

Buy Date: 
2014-11-10 00:00:00
Account Value: 11296.79
    Buy Price: 17613.74
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2015-01-21 00:00:00
    Sell Price: 17554.28
    Updated Value: 11296.79

-------------------------

Buy Date: 
2015-02-19 00:00:00
Account Value: 11296.79
    Buy Price: 17985.77
    Num Shares: 0.0
    Remaining Value: 11296.79
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11296.79


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11296.79





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-03 00:00:00
Account Value: 10000
    Buy Price: 10796.65
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-11 00:00:00
    Sell Price: 10241.02
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-26 00:00:00
Account Value: 10000.0
    Buy Price: 9982.75
    Num Shares: 1.0
    Remaining Value: 17.25
Sell Date: 
2002-02-08 00:00:00
    Sell Price: 9744.24
    Updated Value: 9761.49

-------------------------

Buy Date: 
2002-03-01 00:00:00
Account Value: 9761.49
    Buy Price: 10368.86
    Num Shares: 0.0
    Remaining Value: 9761.49
Sell Date: 
2002-05-07 00:00:00
    Sell Price: 9836.55
    Updated Value: 9761.49

-------------------------

Buy Date: 
2002-11-04 00:00:00
Account Value: 9761.49
    Buy Price: 8571.6
    Num Shares: 1.0
    Remaining Value: 1189.89
Sell Date: 
2003-01-31 00:00:00
    Sell Price: 8053.81
    Updated Value: 9243.7

-------------------------

Buy Date: 
2003-04-07 00:00:00
Account Value: 9243.7
    Buy Price: 8300.41
    Num Shares: 1.0
    Remaining Value: 943.29
Sell Date: 
2004-03-23 00:00:00
    Sell Price: 10063.64
    Updated Value: 11006.93

-------------------------

Buy Date: 
2004-06-18 00:00:00
Account Value: 11006.93
    Buy Price: 10416.41
    Num Shares: 1.0
    Remaining Value: 590.52
Sell Date: 
2004-07-16 00:00:00
    Sell Price: 10139.78
    Updated Value: 10730.3

-------------------------

Buy Date: 
2004-09-15 00:00:00
Account Value: 10730.3
    Buy Price: 10231.36
    Num Shares: 1.0
    Remaining Value: 498.94
Sell Date: 
2004-10-04 00:00:00
    Sell Price: 10216.54
    Updated Value: 10715.48

-------------------------

Buy Date: 
2004-11-12 00:00:00
Account Value: 10715.48
    Buy Price: 10539.01
    Num Shares: 1.0
    Remaining Value: 176.47
Sell Date: 
2005-03-30 00:00:00
    Sell Price: 10540.93
    Updated Value: 10717.4

-------------------------

Buy Date: 
2005-06-13 00:00:00
Account Value: 10717.4
    Buy Price: 10522.56
    Num Shares: 1.0
    Remaining Value: 194.84
Sell Date: 
2005-07-14 00:00:00
    Sell Price: 10628.88
    Updated Value: 10823.72

-------------------------

Buy Date: 
2005-07-15 00:00:00
Account Value: 10823.72
    Buy Price: 10640.83
    Num Shares: 1.0
    Remaining Value: 182.89
Sell Date: 
2005-09-02 00:00:00
    Sell Price: 10447.37
    Updated Value: 10630.26

-------------------------

Buy Date: 
2005-09-19 00:00:00
Account Value: 10630.26
    Buy Price: 10557.63
    Num Shares: 1.0
    Remaining Value: 72.63
Sell Date: 
2005-10-03 00:00:00
    Sell Price: 10535.48
    Updated Value: 10608.11

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 10608.11
    Buy Price: 10674.76
    Num Shares: 0.0
    Remaining Value: 10608.11
Sell Date: 
2006-06-06 00:00:00
    Sell Price: 11002.14
    Updated Value: 10608.11

-------------------------

Buy Date: 
2006-08-15 00:00:00
Account Value: 10608.11
    Buy Price: 11230.26
    Num Shares: 0.0
    Remaining Value: 10608.11
Sell Date: 
2007-03-13 00:00:00
    Sell Price: 12075.96
    Updated Value: 10608.11

-------------------------

Buy Date: 
2007-04-18 00:00:00
Account Value: 10608.11
    Buy Price: 12803.84
    Num Shares: 0.0
    Remaining Value: 10608.11
Sell Date: 
2007-08-13 00:00:00
    Sell Price: 13236.53
    Updated Value: 10608.11

-------------------------

Buy Date: 
2007-09-27 00:00:00
Account Value: 10608.11
    Buy Price: 13912.94
    Num Shares: 0.0
    Remaining Value: 10608.11
Sell Date: 
2007-11-19 00:00:00
    Sell Price: 12958.44
    Updated Value: 10608.11

-------------------------

Buy Date: 
2008-04-17 00:00:00
Account Value: 10608.11
    Buy Price: 12620.49
    Num Shares: 0.0
    Remaining Value: 10608.11
Sell Date: 
2008-06-12 00:00:00
    Sell Price: 12141.58
    Updated Value: 10608.11

-------------------------

Buy Date: 
2009-04-21 00:00:00
Account Value: 10608.11
    Buy Price: 7969.56
    Num Shares: 1.0
    Remaining Value: 2638.55
Sell Date: 
2010-02-09 00:00:00
    Sell Price: 10058.64
    Updated Value: 12697.19

-------------------------

Buy Date: 
2010-03-10 00:00:00
Account Value: 12697.19
    Buy Price: 10567.33
    Num Shares: 1.0
    Remaining Value: 2129.86
Sell Date: 
2010-05-25 00:00:00
    Sell Price: 10043.75
    Updated Value: 12173.61

-------------------------

Buy Date: 
2010-08-09 00:00:00
Account Value: 12173.61
    Buy Price: 10698.75
    Num Shares: 1.0
    Remaining Value: 1474.86
Sell Date: 
2010-09-08 00:00:00
    Sell Price: 10387.01
    Updated Value: 11861.87

-------------------------

Buy Date: 
2010-09-15 00:00:00
Account Value: 11861.87
    Buy Price: 10572.73
    Num Shares: 1.0
    Remaining Value: 1289.14
Sell Date: 
2011-06-13 00:00:00
    Sell Price: 11952.97
    Updated Value: 13242.11

-------------------------

Buy Date: 
2011-07-18 00:00:00
Account Value: 13242.11
    Buy Price: 12385.16
    Num Shares: 1.0
    Remaining Value: 856.95
Sell Date: 
2011-08-04 00:00:00
    Sell Price: 11383.68
    Updated Value: 12240.63

-------------------------

Buy Date: 
2011-10-28 00:00:00
Account Value: 12240.63
    Buy Price: 12231.11
    Num Shares: 1.0
    Remaining Value: 9.52
Sell Date: 
2012-05-18 00:00:00
    Sell Price: 12369.38
    Updated Value: 12378.9

-------------------------

Buy Date: 
2012-07-20 00:00:00
Account Value: 12378.9
    Buy Price: 12822.57
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2012-07-24 00:00:00
    Sell Price: 12617.32
    Updated Value: 12378.9

-------------------------

Buy Date: 
2012-07-31 00:00:00
Account Value: 12378.9
    Buy Price: 13008.68
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2012-11-09 00:00:00
    Sell Price: 12815.39
    Updated Value: 12378.9

-------------------------

Buy Date: 
2013-01-08 00:00:00
Account Value: 12378.9
    Buy Price: 13328.85
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2013-08-27 00:00:00
    Sell Price: 14776.13
    Updated Value: 12378.9

-------------------------

Buy Date: 
2013-09-24 00:00:00
Account Value: 12378.9
    Buy Price: 15334.59
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2013-10-10 00:00:00
    Sell Price: 15126.07
    Updated Value: 12378.9

-------------------------

Buy Date: 
2013-10-30 00:00:00
Account Value: 12378.9
    Buy Price: 15618.76
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2014-02-10 00:00:00
    Sell Price: 15801.79
    Updated Value: 12378.9

-------------------------

Buy Date: 
2014-03-03 00:00:00
Account Value: 12378.9
    Buy Price: 16168.03
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2014-08-13 00:00:00
    Sell Price: 16651.8
    Updated Value: 12378.9

-------------------------

Buy Date: 
2014-08-29 00:00:00
Account Value: 12378.9
    Buy Price: 17098.45
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2014-10-14 00:00:00
    Sell Price: 16315.19
    Updated Value: 12378.9

-------------------------

Buy Date: 
2014-11-07 00:00:00
Account Value: 12378.9
    Buy Price: 17573.93
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2015-02-12 00:00:00
    Sell Price: 17972.38
    Updated Value: 12378.9

-------------------------

Buy Date: 
2015-02-19 00:00:00
Account Value: 12378.9
    Buy Price: 17985.77
    Num Shares: 0.0
    Remaining Value: 12378.9
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12378.9


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12378.9





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-04 00:00:00
Account Value: 10000
    Buy Price: 10951.24
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-09 00:00:00
    Sell Price: 10299.4
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-24 00:00:00
Account Value: 10000.0
    Buy Price: 10035.34
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-10 00:00:00
    Sell Price: 9939.92
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-20 00:00:00
Account Value: 10000.0
    Buy Price: 10229.5
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-06 00:00:00
    Sell Price: 9624.64
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-12-04 00:00:00
Account Value: 10000.0
    Buy Price: 8737.85
    Num Shares: 1.0
    Remaining Value: 1262.15
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 8013.29
    Updated Value: 9275.44

-------------------------

Buy Date: 
2003-05-02 00:00:00
Account Value: 9275.44
    Buy Price: 8582.68
    Num Shares: 1.0
    Remaining Value: 692.76
Sell Date: 
2004-05-14 00:00:00
    Sell Price: 10012.87
    Updated Value: 10705.63

-------------------------

Buy Date: 
2004-09-16 00:00:00
Account Value: 10705.63
    Buy Price: 10244.49
    Num Shares: 1.0
    Remaining Value: 461.14
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 10077.4
    Updated Value: 10538.54

-------------------------

Buy Date: 
2004-11-15 00:00:00
Account Value: 10538.54
    Buy Price: 10550.24
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2005-04-12 00:00:00
    Sell Price: 10507.97
    Updated Value: 10538.54

-------------------------

Buy Date: 
2005-07-27 00:00:00
Account Value: 10538.54
    Buy Price: 10637.09
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 10238.76
    Updated Value: 10538.54

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10538.54
    Buy Price: 10720.22
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2006-06-19 00:00:00
    Sell Price: 10942.11
    Updated Value: 10538.54

-------------------------

Buy Date: 
2006-08-14 00:00:00
Account Value: 10538.54
    Buy Price: 11097.87
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2007-03-21 00:00:00
    Sell Price: 12447.52
    Updated Value: 10538.54

-------------------------

Buy Date: 
2007-03-23 00:00:00
Account Value: 10538.54
    Buy Price: 12481.01
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2007-11-16 00:00:00
    Sell Price: 13176.79
    Updated Value: 10538.54

-------------------------

Buy Date: 
2008-05-06 00:00:00
Account Value: 10538.54
    Buy Price: 13020.83
    Num Shares: 0.0
    Remaining Value: 10538.54
Sell Date: 
2008-06-06 00:00:00
    Sell Price: 12209.81
    Updated Value: 10538.54

-------------------------

Buy Date: 
2009-05-11 00:00:00
Account Value: 10538.54
    Buy Price: 8418.77
    Num Shares: 1.0
    Remaining Value: 2119.77
Sell Date: 
2010-05-26 00:00:00
    Sell Price: 9974.45
    Updated Value: 12094.22

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 12094.22
    Buy Price: 10860.26
    Num Shares: 1.0
    Remaining Value: 1233.96
Sell Date: 
2011-06-21 00:00:00
    Sell Price: 12190.01
    Updated Value: 13423.97

-------------------------

Buy Date: 
2011-07-07 00:00:00
Account Value: 13423.97
    Buy Price: 12719.49
    Num Shares: 1.0
    Remaining Value: 704.48
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 10809.85
    Updated Value: 11514.33

-------------------------

Buy Date: 
2011-11-10 00:00:00
Account Value: 11514.33
    Buy Price: 11893.79
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2011-12-05 00:00:00
    Sell Price: 12097.83
    Updated Value: 11514.33

-------------------------

Buy Date: 
2011-12-14 00:00:00
Account Value: 11514.33
    Buy Price: 11823.48
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2012-05-30 00:00:00
    Sell Price: 12419.86
    Updated Value: 11514.33

-------------------------

Buy Date: 
2012-08-07 00:00:00
Account Value: 11514.33
    Buy Price: 13168.6
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2012-11-21 00:00:00
    Sell Price: 12836.89
    Updated Value: 11514.33

-------------------------

Buy Date: 
2012-12-18 00:00:00
Account Value: 11514.33
    Buy Price: 13350.96
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2013-09-06 00:00:00
    Sell Price: 14922.5
    Updated Value: 11514.33

-------------------------

Buy Date: 
2013-09-18 00:00:00
Account Value: 11514.33
    Buy Price: 15676.94
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2013-10-15 00:00:00
    Sell Price: 15168.01
    Updated Value: 11514.33

-------------------------

Buy Date: 
2013-10-28 00:00:00
Account Value: 11514.33
    Buy Price: 15568.93
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2014-10-17 00:00:00
    Sell Price: 16380.41
    Updated Value: 11514.33

-------------------------

Buy Date: 
2014-11-06 00:00:00
Account Value: 11514.33
    Buy Price: 17554.47
    Num Shares: 0.0
    Remaining Value: 11514.33
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11514.33


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11514.33





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-01 00:00:00
Account Value: 10000
    Buy Price: 10898.34
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-22 00:00:00
    Sell Price: 10276.9
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-08 00:00:00
Account Value: 10000.0
    Buy Price: 10572.49
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-17 00:00:00
    Sell Price: 9687.42
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-04-30 00:00:00
Account Value: 10000.0
    Buy Price: 8480.09
    Num Shares: 1.0
    Remaining Value: 1519.91
Sell Date: 
2004-07-26 00:00:00
    Sell Price: 9961.92
    Updated Value: 11481.83

-------------------------

Buy Date: 
2004-11-18 00:00:00
Account Value: 11481.83
    Buy Price: 10572.55
    Num Shares: 1.0
    Remaining Value: 909.28
Sell Date: 
2005-04-27 00:00:00
    Sell Price: 10198.8
    Updated Value: 11108.08

-------------------------

Buy Date: 
2005-06-01 00:00:00
Account Value: 11108.08
    Buy Price: 10549.87
    Num Shares: 1.0
    Remaining Value: 558.21
Sell Date: 
2005-07-11 00:00:00
    Sell Price: 10519.72
    Updated Value: 11077.93

-------------------------

Buy Date: 
2005-07-22 00:00:00
Account Value: 11077.93
    Buy Price: 10651.18
    Num Shares: 1.0
    Remaining Value: 426.75
Sell Date: 
2005-08-30 00:00:00
    Sell Price: 10412.82
    Updated Value: 10839.57

-------------------------

Buy Date: 
2005-09-22 00:00:00
Account Value: 10839.57
    Buy Price: 10422.05
    Num Shares: 1.0
    Remaining Value: 417.52
Sell Date: 
2005-09-28 00:00:00
    Sell Price: 10473.08
    Updated Value: 10890.6

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10890.6
    Buy Price: 10720.22
    Num Shares: 1.0
    Remaining Value: 170.38
Sell Date: 
2007-11-28 00:00:00
    Sell Price: 13289.45
    Updated Value: 13459.83

-------------------------

Buy Date: 
2007-12-12 00:00:00
Account Value: 13459.83
    Buy Price: 13473.9
    Num Shares: 0.0
    Remaining Value: 13459.83
Sell Date: 
2008-01-04 00:00:00
    Sell Price: 12800.18
    Updated Value: 13459.83

-------------------------

Buy Date: 
2009-07-20 00:00:00
Account Value: 13459.83
    Buy Price: 8848.15
    Num Shares: 1.0
    Remaining Value: 4611.68
Sell Date: 
2010-06-08 00:00:00
    Sell Price: 9939.98
    Updated Value: 14551.66

-------------------------

Buy Date: 
2010-08-06 00:00:00
Account Value: 14551.66
    Buy Price: 10653.56
    Num Shares: 1.0
    Remaining Value: 3898.1
Sell Date: 
2010-08-25 00:00:00
    Sell Price: 10060.06
    Updated Value: 13958.16

-------------------------

Buy Date: 
2010-09-23 00:00:00
Account Value: 13958.16
    Buy Price: 10662.42
    Num Shares: 1.0
    Remaining Value: 3295.74
Sell Date: 
2011-08-12 00:00:00
    Sell Price: 11269.02
    Updated Value: 14564.76

-------------------------

Buy Date: 
2011-12-20 00:00:00
Account Value: 14564.76
    Buy Price: 12103.58
    Num Shares: 1.0
    Remaining Value: 2461.18
Sell Date: 
2012-11-19 00:00:00
    Sell Price: 12795.96
    Updated Value: 15257.14

-------------------------

Buy Date: 
2012-12-12 00:00:00
Account Value: 15257.14
    Buy Price: 13245.45
    Num Shares: 1.0
    Remaining Value: 2011.69
Sell Date: 
2014-10-29 00:00:00
    Sell Price: 16974.31
    Updated Value: 18986.0

-------------------------

Buy Date: 
2014-10-31 00:00:00
Account Value: 18986.0
    Buy Price: 17390.52
    Num Shares: 1.0
    Remaining Value: 1595.48
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19653.13


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19653.13





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 10734.97
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-31 00:00:00
    Sell Price: 9949.75
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-11 00:00:00
Account Value: 10000.0
    Buy Price: 10611.24
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-29 00:00:00
    Sell Price: 9819.87
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-24 00:00:00
Account Value: 10000.0
    Buy Price: 10104.26
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-07 00:00:00
    Sell Price: 9589.67
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-21 00:00:00
Account Value: 10000.0
    Buy Price: 8516.43
    Num Shares: 1.0
    Remaining Value: 1483.57
Sell Date: 
2004-08-13 00:00:00
    Sell Price: 9825.35
    Updated Value: 11308.92

-------------------------

Buy Date: 
2004-09-03 00:00:00
Account Value: 11308.92
    Buy Price: 10260.2
    Num Shares: 1.0
    Remaining Value: 1048.72
Sell Date: 
2004-10-05 00:00:00
    Sell Price: 10177.68
    Updated Value: 11226.4

-------------------------

Buy Date: 
2004-11-18 00:00:00
Account Value: 11226.4
    Buy Price: 10572.55
    Num Shares: 1.0
    Remaining Value: 653.85
Sell Date: 
2005-04-28 00:00:00
    Sell Price: 10070.37
    Updated Value: 10724.22

-------------------------

Buy Date: 
2005-05-23 00:00:00
Account Value: 10724.22
    Buy Price: 10523.56
    Num Shares: 1.0
    Remaining Value: 200.66
Sell Date: 
2005-10-06 00:00:00
    Sell Price: 10287.1
    Updated Value: 10487.76

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10487.76
    Buy Price: 10720.22
    Num Shares: 0.0
    Remaining Value: 10487.76
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 12501.11
    Updated Value: 10487.76

-------------------------

Buy Date: 
2009-08-06 00:00:00
Account Value: 10487.76
    Buy Price: 9256.26
    Num Shares: 1.0
    Remaining Value: 1231.5
Sell Date: 
2010-07-14 00:00:00
    Sell Price: 10366.72
    Updated Value: 11598.22

-------------------------

Buy Date: 
2010-07-23 00:00:00
Account Value: 11598.22
    Buy Price: 10424.62
    Num Shares: 1.0
    Remaining Value: 1173.6
Sell Date: 
2010-08-31 00:00:00
    Sell Price: 10014.72
    Updated Value: 11188.32

-------------------------

Buy Date: 
2010-09-20 00:00:00
Account Value: 11188.32
    Buy Price: 10753.62
    Num Shares: 1.0
    Remaining Value: 434.7
Sell Date: 
2011-08-18 00:00:00
    Sell Price: 10990.58
    Updated Value: 11425.28

-------------------------

Buy Date: 
2011-11-09 00:00:00
Account Value: 11425.28
    Buy Price: 11780.94
    Num Shares: 0.0
    Remaining Value: 11425.28
Sell Date: 
2011-11-23 00:00:00
    Sell Price: 11257.55
    Updated Value: 11425.28

-------------------------

Buy Date: 
2011-12-20 00:00:00
Account Value: 11425.28
    Buy Price: 12103.58
    Num Shares: 0.0
    Remaining Value: 11425.28
Sell Date: 
2012-11-28 00:00:00
    Sell Price: 12985.11
    Updated Value: 11425.28

-------------------------

Buy Date: 
2012-12-06 00:00:00
Account Value: 11425.28
    Buy Price: 13074.04
    Num Shares: 0.0
    Remaining Value: 11425.28
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11425.28


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11425.28





-----------------------------------------------------------------------
DJIA Calculations, N = [15, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-04-30 00:00:00
Account Value: 10000
    Buy Price: 10734.97
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-04 00:00:00
    Sell Price: 9997.49
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-13 00:00:00
Account Value: 10000.0
    Buy Price: 10501.85
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-26 00:00:00
    Sell Price: 9910.72
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-29 00:00:00
Account Value: 10000.0
    Buy Price: 9923.04
    Num Shares: 1.0
    Remaining Value: 76.96
Sell Date: 
2002-05-30 00:00:00
    Sell Price: 9911.69
    Updated Value: 9988.65

-------------------------

Buy Date: 
2002-06-03 00:00:00
Account Value: 9988.65
    Buy Price: 9709.79
    Num Shares: 1.0
    Remaining Value: 278.86
Sell Date: 
2002-06-04 00:00:00
    Sell Price: 9687.84
    Updated Value: 9966.7

-------------------------

Buy Date: 
2003-06-12 00:00:00
Account Value: 9966.7
    Buy Price: 9196.55
    Num Shares: 1.0
    Remaining Value: 770.15
Sell Date: 
2004-10-25 00:00:00
    Sell Price: 9749.99
    Updated Value: 10520.14

-------------------------

Buy Date: 
2004-11-12 00:00:00
Account Value: 10520.14
    Buy Price: 10539.01
    Num Shares: 0.0
    Remaining Value: 10520.14
Sell Date: 
2005-04-26 00:00:00
    Sell Price: 10151.13
    Updated Value: 10520.14

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 10520.14
    Buy Price: 10471.91
    Num Shares: 1.0
    Remaining Value: 48.23
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 10287.34
    Updated Value: 10335.57

-------------------------

Buy Date: 
2005-11-11 00:00:00
Account Value: 10335.57
    Buy Price: 10686.04
    Num Shares: 0.0
    Remaining Value: 10335.57
Sell Date: 
2008-01-17 00:00:00
    Sell Price: 12159.21
    Updated Value: 10335.57

-------------------------

Buy Date: 
2009-09-01 00:00:00
Account Value: 10335.57
    Buy Price: 9310.6
    Num Shares: 1.0
    Remaining Value: 1024.97
Sell Date: 
2011-08-23 00:00:00
    Sell Price: 11176.76
    Updated Value: 12201.73

-------------------------

Buy Date: 
2011-10-28 00:00:00
Account Value: 12201.73
    Buy Price: 12231.11
    Num Shares: 0.0
    Remaining Value: 12201.73
Sell Date: 
2011-12-06 00:00:00
    Sell Price: 12150.13
    Updated Value: 12201.73

-------------------------

Buy Date: 
2011-12-14 00:00:00
Account Value: 12201.73
    Buy Price: 11823.48
    Num Shares: 1.0
    Remaining Value: 378.25
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 18435.9


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 18435.9





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 30]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-12 00:00:00
Account Value: 10000
    Buy Price: 10946.77
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-03-06 00:00:00
    Sell Price: 10591.22
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-04-23 00:00:00
Account Value: 10000.0
    Buy Price: 10532.23
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-19 00:00:00
    Sell Price: 10596.67
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-08-07 00:00:00
Account Value: 10000.0
    Buy Price: 10458.74
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-17 00:00:00
    Sell Price: 10240.78
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-10-23 00:00:00
Account Value: 10000.0
    Buy Price: 9340.08
    Num Shares: 1.0
    Remaining Value: 659.92
Sell Date: 
2002-01-29 00:00:00
    Sell Price: 9618.24
    Updated Value: 10278.16

-------------------------

Buy Date: 
2002-02-27 00:00:00
Account Value: 10278.16
    Buy Price: 10127.58
    Num Shares: 1.0
    Remaining Value: 150.58
Sell Date: 
2002-04-11 00:00:00
    Sell Price: 10176.08
    Updated Value: 10326.66

-------------------------

Buy Date: 
2002-05-30 00:00:00
Account Value: 10326.66
    Buy Price: 9911.69
    Num Shares: 1.0
    Remaining Value: 414.97
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 9502.8
    Updated Value: 9917.77

-------------------------

Buy Date: 
2002-08-20 00:00:00
Account Value: 9917.77
    Buy Price: 8872.07
    Num Shares: 1.0
    Remaining Value: 1045.7
Sell Date: 
2002-09-18 00:00:00
    Sell Price: 8172.45
    Updated Value: 9218.15

-------------------------

Buy Date: 
2002-10-30 00:00:00
Account Value: 9218.15
    Buy Price: 8427.41
    Num Shares: 1.0
    Remaining Value: 790.74
Sell Date: 
2002-12-27 00:00:00
    Sell Price: 8303.78
    Updated Value: 9094.52

-------------------------

Buy Date: 
2003-01-21 00:00:00
Account Value: 9094.52
    Buy Price: 8442.9
    Num Shares: 1.0
    Remaining Value: 651.62
Sell Date: 
2003-02-05 00:00:00
    Sell Price: 7985.18
    Updated Value: 8636.8

-------------------------

Buy Date: 
2003-04-01 00:00:00
Account Value: 8636.8
    Buy Price: 8069.86
    Num Shares: 1.0
    Remaining Value: 566.94
Sell Date: 
2003-07-16 00:00:00
    Sell Price: 9094.59
    Updated Value: 9661.53

-------------------------

Buy Date: 
2003-07-29 00:00:00
Account Value: 9661.53
    Buy Price: 9204.46
    Num Shares: 1.0
    Remaining Value: 457.07
Sell Date: 
2003-10-17 00:00:00
    Sell Price: 9721.79
    Updated Value: 10178.86

-------------------------

Buy Date: 
2003-10-20 00:00:00
Account Value: 10178.86
    Buy Price: 9777.94
    Num Shares: 1.0
    Remaining Value: 400.92
Sell Date: 
2003-11-18 00:00:00
    Sell Price: 9624.16
    Updated Value: 10025.08

-------------------------

Buy Date: 
2003-11-19 00:00:00
Account Value: 10025.08
    Buy Price: 9690.46
    Num Shares: 1.0
    Remaining Value: 334.62
Sell Date: 
2003-12-08 00:00:00
    Sell Price: 9965.27
    Updated Value: 10299.89

-------------------------

Buy Date: 
2003-12-17 00:00:00
Account Value: 10299.89
    Buy Price: 10145.26
    Num Shares: 1.0
    Remaining Value: 154.63
Sell Date: 
2004-02-25 00:00:00
    Sell Price: 10601.62
    Updated Value: 10756.25

-------------------------

Buy Date: 
2004-03-01 00:00:00
Account Value: 10756.25
    Buy Price: 10678.14
    Num Shares: 1.0
    Remaining Value: 78.11
Sell Date: 
2004-03-16 00:00:00
    Sell Price: 10184.67
    Updated Value: 10262.78

-------------------------

Buy Date: 
2004-04-19 00:00:00
Account Value: 10262.78
    Buy Price: 10437.85
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2004-05-07 00:00:00
    Sell Price: 10117.34
    Updated Value: 10262.78

-------------------------

Buy Date: 
2004-06-16 00:00:00
Account Value: 10262.78
    Buy Price: 10379.58
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2004-07-16 00:00:00
    Sell Price: 10139.78
    Updated Value: 10262.78

-------------------------

Buy Date: 
2004-09-08 00:00:00
Account Value: 10262.78
    Buy Price: 10313.36
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2004-10-06 00:00:00
    Sell Price: 10239.92
    Updated Value: 10262.78

-------------------------

Buy Date: 
2004-11-16 00:00:00
Account Value: 10262.78
    Buy Price: 10487.65
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-01-24 00:00:00
    Sell Price: 10368.61
    Updated Value: 10262.78

-------------------------

Buy Date: 
2005-02-18 00:00:00
Account Value: 10262.78
    Buy Price: 10785.22
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-03-29 00:00:00
    Sell Price: 10405.7
    Updated Value: 10262.78

-------------------------

Buy Date: 
2005-05-20 00:00:00
Account Value: 10262.78
    Buy Price: 10471.91
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-06-30 00:00:00
    Sell Price: 10274.97
    Updated Value: 10262.78

-------------------------

Buy Date: 
2005-07-29 00:00:00
Account Value: 10262.78
    Buy Price: 10640.91
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-08-24 00:00:00
    Sell Price: 10434.87
    Updated Value: 10262.78

-------------------------

Buy Date: 
2005-09-26 00:00:00
Account Value: 10262.78
    Buy Price: 10443.63
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 10238.76
    Updated Value: 10262.78

-------------------------

Buy Date: 
2005-11-10 00:00:00
Account Value: 10262.78
    Buy Price: 10640.1
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2005-12-30 00:00:00
    Sell Price: 10717.5
    Updated Value: 10262.78

-------------------------

Buy Date: 
2006-01-10 00:00:00
Account Value: 10262.78
    Buy Price: 11011.58
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2006-02-09 00:00:00
    Sell Price: 10883.35
    Updated Value: 10262.78

-------------------------

Buy Date: 
2006-02-22 00:00:00
Account Value: 10262.78
    Buy Price: 11137.17
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2006-04-21 00:00:00
    Sell Price: 11347.45
    Updated Value: 10262.78

-------------------------

Buy Date: 
2006-05-02 00:00:00
Account Value: 10262.78
    Buy Price: 11416.44
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2006-06-05 00:00:00
    Sell Price: 11048.72
    Updated Value: 10262.78

-------------------------

Buy Date: 
2006-07-12 00:00:00
Account Value: 10262.78
    Buy Price: 11013.18
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2006-08-01 00:00:00
    Sell Price: 11125.73
    Updated Value: 10262.78

-------------------------

Buy Date: 
2006-08-14 00:00:00
Account Value: 10262.78
    Buy Price: 11097.87
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2007-03-07 00:00:00
    Sell Price: 12192.45
    Updated Value: 10262.78

-------------------------

Buy Date: 
2007-04-05 00:00:00
Account Value: 10262.78
    Buy Price: 12560.83
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2007-06-27 00:00:00
    Sell Price: 13427.73
    Updated Value: 10262.78

-------------------------

Buy Date: 
2007-07-12 00:00:00
Account Value: 10262.78
    Buy Price: 13861.73
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2007-08-13 00:00:00
    Sell Price: 13236.53
    Updated Value: 10262.78

-------------------------

Buy Date: 
2007-09-17 00:00:00
Account Value: 10262.78
    Buy Price: 13403.42
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2007-11-02 00:00:00
    Sell Price: 13595.1
    Updated Value: 10262.78

-------------------------

Buy Date: 
2007-12-19 00:00:00
Account Value: 10262.78
    Buy Price: 13207.27
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2008-01-09 00:00:00
    Sell Price: 12735.31
    Updated Value: 10262.78

-------------------------

Buy Date: 
2008-02-25 00:00:00
Account Value: 10262.78
    Buy Price: 12570.22
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2008-03-04 00:00:00
    Sell Price: 12213.8
    Updated Value: 10262.78

-------------------------

Buy Date: 
2008-03-18 00:00:00
Account Value: 10262.78
    Buy Price: 12392.66
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2008-03-19 00:00:00
    Sell Price: 12099.66
    Updated Value: 10262.78

-------------------------

Buy Date: 
2008-04-09 00:00:00
Account Value: 10262.78
    Buy Price: 12527.26
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2008-06-02 00:00:00
    Sell Price: 12503.82
    Updated Value: 10262.78

-------------------------

Buy Date: 
2008-08-07 00:00:00
Account Value: 10262.78
    Buy Price: 11431.43
    Num Shares: 0.0
    Remaining Value: 10262.78
Sell Date: 
2008-09-09 00:00:00
    Sell Price: 11230.73
    Updated Value: 10262.78

-------------------------

Buy Date: 
2008-11-24 00:00:00
Account Value: 10262.78
    Buy Price: 8443.39
    Num Shares: 1.0
    Remaining Value: 1819.39
Sell Date: 
2008-11-28 00:00:00
    Sell Price: 8829.04
    Updated Value: 10648.43

-------------------------

Buy Date: 
2008-12-19 00:00:00
Account Value: 10648.43
    Buy Price: 8579.11
    Num Shares: 1.0
    Remaining Value: 2069.32
Sell Date: 
2009-01-15 00:00:00
    Sell Price: 8212.49
    Updated Value: 10281.81

-------------------------

Buy Date: 
2009-04-01 00:00:00
Account Value: 10281.81
    Buy Price: 7761.6
    Num Shares: 1.0
    Remaining Value: 2520.21
Sell Date: 
2009-07-07 00:00:00
    Sell Price: 8163.6
    Updated Value: 10683.81

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 10683.81
    Buy Price: 9108.51
    Num Shares: 1.0
    Remaining Value: 1575.3
Sell Date: 
2010-02-03 00:00:00
    Sell Price: 10270.55
    Updated Value: 11845.85

-------------------------

Buy Date: 
2010-03-05 00:00:00
Account Value: 11845.85
    Buy Price: 10566.2
    Num Shares: 1.0
    Remaining Value: 1279.65
Sell Date: 
2010-05-17 00:00:00
    Sell Price: 10625.83
    Updated Value: 11905.48

-------------------------

Buy Date: 
2010-07-01 00:00:00
Account Value: 11905.48
    Buy Price: 9732.53
    Num Shares: 1.0
    Remaining Value: 2172.95
Sell Date: 
2010-07-19 00:00:00
    Sell Price: 10154.43
    Updated Value: 12327.38

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 12327.38
    Buy Price: 10465.94
    Num Shares: 1.0
    Remaining Value: 1861.44
Sell Date: 
2010-08-31 00:00:00
    Sell Price: 10014.72
    Updated Value: 11876.16

-------------------------

Buy Date: 
2010-09-22 00:00:00
Account Value: 11876.16
    Buy Price: 10739.31
    Num Shares: 1.0
    Remaining Value: 1136.85
Sell Date: 
2010-12-07 00:00:00
    Sell Price: 11359.16
    Updated Value: 12496.01

-------------------------

Buy Date: 
2010-12-20 00:00:00
Account Value: 12496.01
    Buy Price: 11478.13
    Num Shares: 1.0
    Remaining Value: 1017.88
Sell Date: 
2011-03-16 00:00:00
    Sell Price: 11613.3
    Updated Value: 12631.18

-------------------------

Buy Date: 
2011-04-12 00:00:00
Account Value: 12631.18
    Buy Price: 12263.58
    Num Shares: 1.0
    Remaining Value: 367.6
Sell Date: 
2011-06-01 00:00:00
    Sell Price: 12290.14
    Updated Value: 12657.74

-------------------------

Buy Date: 
2011-07-12 00:00:00
Account Value: 12657.74
    Buy Price: 12446.88
    Num Shares: 1.0
    Remaining Value: 210.86
Sell Date: 
2011-08-08 00:00:00
    Sell Price: 10809.85
    Updated Value: 11020.71

-------------------------

Buy Date: 
2011-09-16 00:00:00
Account Value: 11020.71
    Buy Price: 11509.09
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2011-09-30 00:00:00
    Sell Price: 10913.38
    Updated Value: 11020.71

-------------------------

Buy Date: 
2011-10-24 00:00:00
Account Value: 11020.71
    Buy Price: 11913.62
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2011-12-02 00:00:00
    Sell Price: 12019.42
    Updated Value: 11020.71

-------------------------

Buy Date: 
2011-12-22 00:00:00
Account Value: 11020.71
    Buy Price: 12169.65
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2012-04-19 00:00:00
    Sell Price: 12964.1
    Updated Value: 11020.71

-------------------------

Buy Date: 
2012-05-11 00:00:00
Account Value: 11020.71
    Buy Price: 12820.6
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2012-05-23 00:00:00
    Sell Price: 12496.15
    Updated Value: 11020.71

-------------------------

Buy Date: 
2012-06-29 00:00:00
Account Value: 11020.71
    Buy Price: 12880.09
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2012-09-18 00:00:00
    Sell Price: 13564.64
    Updated Value: 11020.71

-------------------------

Buy Date: 
2012-09-20 00:00:00
Account Value: 11020.71
    Buy Price: 13596.93
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2012-10-22 00:00:00
    Sell Price: 13345.89
    Updated Value: 11020.71

-------------------------

Buy Date: 
2012-12-14 00:00:00
Account Value: 11020.71
    Buy Price: 13135.01
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2013-06-20 00:00:00
    Sell Price: 14758.32
    Updated Value: 11020.71

-------------------------

Buy Date: 
2013-07-22 00:00:00
Account Value: 11020.71
    Buy Price: 15545.55
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2013-08-21 00:00:00
    Sell Price: 14897.55
    Updated Value: 11020.71

-------------------------

Buy Date: 
2013-09-25 00:00:00
Account Value: 11020.71
    Buy Price: 15273.26
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2013-10-16 00:00:00
    Sell Price: 15373.83
    Updated Value: 11020.71

-------------------------

Buy Date: 
2013-11-01 00:00:00
Account Value: 11020.71
    Buy Price: 15615.55
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2013-12-30 00:00:00
    Sell Price: 16504.29
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-01-02 00:00:00
Account Value: 11020.71
    Buy Price: 16441.35
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-01-31 00:00:00
    Sell Price: 15698.85
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-03-05 00:00:00
Account Value: 11020.71
    Buy Price: 16360.18
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-04-07 00:00:00
    Sell Price: 16245.87
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-04-11 00:00:00
Account Value: 11020.71
    Buy Price: 16026.75
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-05-02 00:00:00
    Sell Price: 16512.89
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-05-12 00:00:00
Account Value: 11020.71
    Buy Price: 16695.47
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-08-08 00:00:00
    Sell Price: 16553.93
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-09-04 00:00:00
Account Value: 11020.71
    Buy Price: 17069.58
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-10-03 00:00:00
    Sell Price: 17009.69
    Updated Value: 11020.71

-------------------------

Buy Date: 
2014-11-11 00:00:00
Account Value: 11020.71
    Buy Price: 17614.9
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2014-12-29 00:00:00
    Sell Price: 18038.23
    Updated Value: 11020.71

-------------------------

Buy Date: 
2015-01-14 00:00:00
Account Value: 11020.71
    Buy Price: 17427.09
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2015-01-28 00:00:00
    Sell Price: 17191.37
    Updated Value: 11020.71

-------------------------

Buy Date: 
2015-02-17 00:00:00
Account Value: 11020.71
    Buy Price: 18047.58
    Num Shares: 0.0
    Remaining Value: 11020.71
Sell Date: 
2015-03-25 00:00:00
    Sell Price: 17718.54
    Updated Value: 11020.71


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11020.71





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-02-07 00:00:00
Account Value: 10000
    Buy Price: 10946.72
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-03-12 00:00:00
    Sell Price: 10208.25
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-05-02 00:00:00
Account Value: 10000.0
    Buy Price: 10876.68
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-06-28 00:00:00
    Sell Price: 10566.21
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-09 00:00:00
Account Value: 10000.0
    Buy Price: 9608.0
    Num Shares: 1.0
    Remaining Value: 392.0
Sell Date: 
2002-02-04 00:00:00
    Sell Price: 9687.09
    Updated Value: 10079.09

-------------------------

Buy Date: 
2002-03-07 00:00:00
Account Value: 10079.09
    Buy Price: 10525.37
    Num Shares: 0.0
    Remaining Value: 10079.09
Sell Date: 
2002-04-25 00:00:00
    Sell Price: 10035.06
    Updated Value: 10079.09

-------------------------

Buy Date: 
2002-09-04 00:00:00
Account Value: 10079.09
    Buy Price: 8425.12
    Num Shares: 1.0
    Remaining Value: 1653.97
Sell Date: 
2002-09-24 00:00:00
    Sell Price: 7683.13
    Updated Value: 9337.1

-------------------------

Buy Date: 
2002-11-06 00:00:00
Account Value: 9337.1
    Buy Price: 8771.01
    Num Shares: 1.0
    Remaining Value: 566.09
Sell Date: 
2002-12-31 00:00:00
    Sell Price: 8341.63
    Updated Value: 8907.72

-------------------------

Buy Date: 
2003-04-03 00:00:00
Account Value: 8907.72
    Buy Price: 8240.38
    Num Shares: 1.0
    Remaining Value: 667.34
Sell Date: 
2004-03-16 00:00:00
    Sell Price: 10184.67
    Updated Value: 10852.01

-------------------------

Buy Date: 
2004-04-28 00:00:00
Account Value: 10852.01
    Buy Price: 10342.6
    Num Shares: 1.0
    Remaining Value: 509.41
Sell Date: 
2004-05-10 00:00:00
    Sell Price: 9990.02
    Updated Value: 10499.43

-------------------------

Buy Date: 
2004-06-23 00:00:00
Account Value: 10499.43
    Buy Price: 10479.57
    Num Shares: 1.0
    Remaining Value: 19.86
Sell Date: 
2004-07-28 00:00:00
    Sell Price: 10117.07
    Updated Value: 10136.93

-------------------------

Buy Date: 
2004-09-13 00:00:00
Account Value: 10136.93
    Buy Price: 10314.76
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2004-10-18 00:00:00
    Sell Price: 9956.32
    Updated Value: 10136.93

-------------------------

Buy Date: 
2004-11-18 00:00:00
Account Value: 10136.93
    Buy Price: 10572.55
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2005-01-28 00:00:00
    Sell Price: 10427.2
    Updated Value: 10136.93

-------------------------

Buy Date: 
2005-02-25 00:00:00
Account Value: 10136.93
    Buy Price: 10841.6
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2005-04-05 00:00:00
    Sell Price: 10458.46
    Updated Value: 10136.93

-------------------------

Buy Date: 
2005-06-01 00:00:00
Account Value: 10136.93
    Buy Price: 10549.87
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2005-07-19 00:00:00
    Sell Price: 10646.56
    Updated Value: 10136.93

-------------------------

Buy Date: 
2005-07-29 00:00:00
Account Value: 10136.93
    Buy Price: 10640.91
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2005-09-09 00:00:00
    Sell Price: 10678.56
    Updated Value: 10136.93

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10136.93
    Buy Price: 10720.22
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2006-02-09 00:00:00
    Sell Price: 10883.35
    Updated Value: 10136.93

-------------------------

Buy Date: 
2006-02-21 00:00:00
Account Value: 10136.93
    Buy Price: 11069.06
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2006-06-08 00:00:00
    Sell Price: 10938.82
    Updated Value: 10136.93

-------------------------

Buy Date: 
2006-07-27 00:00:00
Account Value: 10136.93
    Buy Price: 11100.43
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2006-07-28 00:00:00
    Sell Price: 11219.7
    Updated Value: 10136.93

-------------------------

Buy Date: 
2006-08-11 00:00:00
Account Value: 10136.93
    Buy Price: 11088.02
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2007-03-12 00:00:00
    Sell Price: 12318.62
    Updated Value: 10136.93

-------------------------

Buy Date: 
2007-04-18 00:00:00
Account Value: 10136.93
    Buy Price: 12803.84
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2007-08-15 00:00:00
    Sell Price: 12861.47
    Updated Value: 10136.93

-------------------------

Buy Date: 
2007-09-27 00:00:00
Account Value: 10136.93
    Buy Price: 13912.94
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2007-11-12 00:00:00
    Sell Price: 12987.55
    Updated Value: 10136.93

-------------------------

Buy Date: 
2007-12-31 00:00:00
Account Value: 10136.93
    Buy Price: 13264.82
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 12589.07
    Updated Value: 10136.93

-------------------------

Buy Date: 
2008-04-11 00:00:00
Account Value: 10136.93
    Buy Price: 12325.42
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2008-06-10 00:00:00
    Sell Price: 12289.76
    Updated Value: 10136.93

-------------------------

Buy Date: 
2008-08-26 00:00:00
Account Value: 10136.93
    Buy Price: 11412.87
    Num Shares: 0.0
    Remaining Value: 10136.93
Sell Date: 
2008-09-18 00:00:00
    Sell Price: 11019.69
    Updated Value: 10136.93

-------------------------

Buy Date: 
2009-01-05 00:00:00
Account Value: 10136.93
    Buy Price: 8952.89
    Num Shares: 1.0
    Remaining Value: 1184.04
Sell Date: 
2009-01-07 00:00:00
    Sell Price: 8769.7
    Updated Value: 9953.74

-------------------------

Buy Date: 
2009-01-13 00:00:00
Account Value: 9953.74
    Buy Price: 8448.56
    Num Shares: 1.0
    Remaining Value: 1505.18
Sell Date: 
2009-02-02 00:00:00
    Sell Price: 7936.83
    Updated Value: 9442.01

-------------------------

Buy Date: 
2009-04-09 00:00:00
Account Value: 9442.01
    Buy Price: 8083.38
    Num Shares: 1.0
    Remaining Value: 1358.63
Sell Date: 
2009-07-10 00:00:00
    Sell Price: 8146.52
    Updated Value: 9505.15

-------------------------

Buy Date: 
2009-07-31 00:00:00
Account Value: 9505.15
    Buy Price: 9171.61
    Num Shares: 1.0
    Remaining Value: 333.54
Sell Date: 
2010-02-08 00:00:00
    Sell Price: 9908.39
    Updated Value: 10241.93

-------------------------

Buy Date: 
2010-03-15 00:00:00
Account Value: 10241.93
    Buy Price: 10642.15
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2010-05-21 00:00:00
    Sell Price: 10193.39
    Updated Value: 10241.93

-------------------------

Buy Date: 
2010-07-30 00:00:00
Account Value: 10241.93
    Buy Price: 10465.94
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2010-09-09 00:00:00
    Sell Price: 10415.24
    Updated Value: 10241.93

-------------------------

Buy Date: 
2010-09-24 00:00:00
Account Value: 10241.93
    Buy Price: 10860.26
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2011-03-29 00:00:00
    Sell Price: 12279.01
    Updated Value: 10241.93

-------------------------

Buy Date: 
2011-04-13 00:00:00
Account Value: 10241.93
    Buy Price: 12270.99
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2011-06-09 00:00:00
    Sell Price: 12124.36
    Updated Value: 10241.93

-------------------------

Buy Date: 
2011-07-21 00:00:00
Account Value: 10241.93
    Buy Price: 12724.41
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2011-08-11 00:00:00
    Sell Price: 11143.31
    Updated Value: 10241.93

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 10241.93
    Buy Price: 11869.04
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2011-12-19 00:00:00
    Sell Price: 11766.26
    Updated Value: 10241.93

-------------------------

Buy Date: 
2011-12-21 00:00:00
Account Value: 10241.93
    Buy Price: 12107.74
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2012-04-30 00:00:00
    Sell Price: 13213.63
    Updated Value: 10241.93

-------------------------

Buy Date: 
2012-05-11 00:00:00
Account Value: 10241.93
    Buy Price: 12820.6
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2012-05-15 00:00:00
    Sell Price: 12632.0
    Updated Value: 10241.93

-------------------------

Buy Date: 
2012-07-11 00:00:00
Account Value: 10241.93
    Buy Price: 12604.53
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2012-11-07 00:00:00
    Sell Price: 12932.73
    Updated Value: 10241.93

-------------------------

Buy Date: 
2012-12-26 00:00:00
Account Value: 10241.93
    Buy Price: 13114.59
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2013-07-02 00:00:00
    Sell Price: 14932.41
    Updated Value: 10241.93

-------------------------

Buy Date: 
2013-07-24 00:00:00
Account Value: 10241.93
    Buy Price: 15542.24
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2013-09-03 00:00:00
    Sell Price: 14833.96
    Updated Value: 10241.93

-------------------------

Buy Date: 
2013-10-03 00:00:00
Account Value: 10241.93
    Buy Price: 14996.48
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2014-02-07 00:00:00
    Sell Price: 15794.08
    Updated Value: 10241.93

-------------------------

Buy Date: 
2014-03-12 00:00:00
Account Value: 10241.93
    Buy Price: 16340.08
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2014-08-12 00:00:00
    Sell Price: 16560.54
    Updated Value: 10241.93

-------------------------

Buy Date: 
2014-09-09 00:00:00
Account Value: 10241.93
    Buy Price: 17013.87
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2014-10-17 00:00:00
    Sell Price: 16380.41
    Updated Value: 10241.93

-------------------------

Buy Date: 
2014-11-13 00:00:00
Account Value: 10241.93
    Buy Price: 17652.79
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2015-01-27 00:00:00
    Sell Price: 17387.21
    Updated Value: 10241.93

-------------------------

Buy Date: 
2015-02-23 00:00:00
Account Value: 10241.93
    Buy Price: 18116.84
    Num Shares: 0.0
    Remaining Value: 10241.93
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 10241.93


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 10241.93





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-08 00:00:00
Account Value: 10000
    Buy Price: 10883.51
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-12 00:00:00
    Sell Price: 10478.99
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-29 00:00:00
Account Value: 10000.0
    Buy Price: 9829.42
    Num Shares: 1.0
    Remaining Value: 170.58
Sell Date: 
2002-02-12 00:00:00
    Sell Price: 9863.74
    Updated Value: 10034.32

-------------------------

Buy Date: 
2002-03-06 00:00:00
Account Value: 10034.32
    Buy Price: 10574.29
    Num Shares: 0.0
    Remaining Value: 10034.32
Sell Date: 
2002-05-09 00:00:00
    Sell Price: 10037.42
    Updated Value: 10034.32

-------------------------

Buy Date: 
2002-11-11 00:00:00
Account Value: 10034.32
    Buy Price: 8358.95
    Num Shares: 1.0
    Remaining Value: 1675.37
Sell Date: 
2003-02-04 00:00:00
    Sell Price: 8013.29
    Updated Value: 9688.66

-------------------------

Buy Date: 
2003-04-11 00:00:00
Account Value: 9688.66
    Buy Price: 8203.41
    Num Shares: 1.0
    Remaining Value: 1485.25
Sell Date: 
2004-03-25 00:00:00
    Sell Price: 10218.82
    Updated Value: 11704.07

-------------------------

Buy Date: 
2004-06-23 00:00:00
Account Value: 11704.07
    Buy Price: 10479.57
    Num Shares: 1.0
    Remaining Value: 1224.5
Sell Date: 
2004-07-22 00:00:00
    Sell Price: 10050.33
    Updated Value: 11274.83

-------------------------

Buy Date: 
2004-09-21 00:00:00
Account Value: 11274.83
    Buy Price: 10244.93
    Num Shares: 1.0
    Remaining Value: 1029.9
Sell Date: 
2004-10-14 00:00:00
    Sell Price: 9894.45
    Updated Value: 10924.35

-------------------------

Buy Date: 
2004-11-17 00:00:00
Account Value: 10924.35
    Buy Price: 10549.57
    Num Shares: 1.0
    Remaining Value: 374.78
Sell Date: 
2005-04-05 00:00:00
    Sell Price: 10458.46
    Updated Value: 10833.24

-------------------------

Buy Date: 
2005-06-15 00:00:00
Account Value: 10833.24
    Buy Price: 10566.37
    Num Shares: 1.0
    Remaining Value: 266.87
Sell Date: 
2005-09-13 00:00:00
    Sell Price: 10597.44
    Updated Value: 10864.31

-------------------------

Buy Date: 
2005-09-27 00:00:00
Account Value: 10864.31
    Buy Price: 10456.21
    Num Shares: 1.0
    Remaining Value: 408.1
Sell Date: 
2005-10-07 00:00:00
    Sell Price: 10292.31
    Updated Value: 10700.41

-------------------------

Buy Date: 
2005-11-21 00:00:00
Account Value: 10700.41
    Buy Price: 10820.28
    Num Shares: 0.0
    Remaining Value: 10700.41
Sell Date: 
2006-06-09 00:00:00
    Sell Price: 10891.92
    Updated Value: 10700.41

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 10700.41
    Buy Price: 11381.47
    Num Shares: 0.0
    Remaining Value: 10700.41
Sell Date: 
2007-03-16 00:00:00
    Sell Price: 12110.41
    Updated Value: 10700.41

-------------------------

Buy Date: 
2007-04-19 00:00:00
Account Value: 10700.41
    Buy Price: 12808.63
    Num Shares: 0.0
    Remaining Value: 10700.41
Sell Date: 
2007-08-16 00:00:00
    Sell Price: 12845.78
    Updated Value: 10700.41

-------------------------

Buy Date: 
2007-10-01 00:00:00
Account Value: 10700.41
    Buy Price: 14087.55
    Num Shares: 0.0
    Remaining Value: 10700.41
Sell Date: 
2007-11-21 00:00:00
    Sell Price: 12799.04
    Updated Value: 10700.41

-------------------------

Buy Date: 
2008-04-17 00:00:00
Account Value: 10700.41
    Buy Price: 12620.49
    Num Shares: 0.0
    Remaining Value: 10700.41
Sell Date: 
2008-06-18 00:00:00
    Sell Price: 12029.06
    Updated Value: 10700.41

-------------------------

Buy Date: 
2009-04-22 00:00:00
Account Value: 10700.41
    Buy Price: 7886.57
    Num Shares: 1.0
    Remaining Value: 2813.84
Sell Date: 
2010-02-12 00:00:00
    Sell Price: 10099.14
    Updated Value: 12912.98

-------------------------

Buy Date: 
2010-03-15 00:00:00
Account Value: 12912.98
    Buy Price: 10642.15
    Num Shares: 1.0
    Remaining Value: 2270.83
Sell Date: 
2010-05-27 00:00:00
    Sell Price: 10258.99
    Updated Value: 12529.82

-------------------------

Buy Date: 
2010-08-11 00:00:00
Account Value: 12529.82
    Buy Price: 10378.83
    Num Shares: 1.0
    Remaining Value: 2150.99
Sell Date: 
2010-09-16 00:00:00
    Sell Price: 10594.83
    Updated Value: 12745.82

-------------------------

Buy Date: 
2010-09-17 00:00:00
Account Value: 12745.82
    Buy Price: 10607.85
    Num Shares: 1.0
    Remaining Value: 2137.97
Sell Date: 
2011-06-16 00:00:00
    Sell Price: 11961.52
    Updated Value: 14099.49

-------------------------

Buy Date: 
2011-07-22 00:00:00
Account Value: 14099.49
    Buy Price: 12681.16
    Num Shares: 1.0
    Remaining Value: 1418.33
Sell Date: 
2011-08-05 00:00:00
    Sell Price: 11444.61
    Updated Value: 12862.94

-------------------------

Buy Date: 
2011-11-02 00:00:00
Account Value: 12862.94
    Buy Price: 11836.04
    Num Shares: 1.0
    Remaining Value: 1026.9
Sell Date: 
2012-05-22 00:00:00
    Sell Price: 12502.81
    Updated Value: 13529.71

-------------------------

Buy Date: 
2012-07-26 00:00:00
Account Value: 13529.71
    Buy Price: 12887.93
    Num Shares: 1.0
    Remaining Value: 641.78
Sell Date: 
2012-11-13 00:00:00
    Sell Price: 12756.18
    Updated Value: 13397.96

-------------------------

Buy Date: 
2013-01-09 00:00:00
Account Value: 13397.96
    Buy Price: 13390.51
    Num Shares: 1.0
    Remaining Value: 7.45
Sell Date: 
2013-09-03 00:00:00
    Sell Price: 14833.96
    Updated Value: 14841.41

-------------------------

Buy Date: 
2013-10-01 00:00:00
Account Value: 14841.41
    Buy Price: 15191.7
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2013-10-15 00:00:00
    Sell Price: 15168.01
    Updated Value: 14841.41

-------------------------

Buy Date: 
2013-11-04 00:00:00
Account Value: 14841.41
    Buy Price: 15639.12
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2014-02-14 00:00:00
    Sell Price: 16154.39
    Updated Value: 14841.41

-------------------------

Buy Date: 
2014-03-07 00:00:00
Account Value: 14841.41
    Buy Price: 16452.72
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2014-08-19 00:00:00
    Sell Price: 16919.59
    Updated Value: 14841.41

-------------------------

Buy Date: 
2014-09-05 00:00:00
Account Value: 14841.41
    Buy Price: 17137.36
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2014-10-16 00:00:00
    Sell Price: 16117.24
    Updated Value: 14841.41

-------------------------

Buy Date: 
2014-11-12 00:00:00
Account Value: 14841.41
    Buy Price: 17612.2
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2015-02-10 00:00:00
    Sell Price: 17868.76
    Updated Value: 14841.41

-------------------------

Buy Date: 
2015-02-25 00:00:00
Account Value: 14841.41
    Buy Price: 18224.57
    Num Shares: 0.0
    Remaining Value: 14841.41
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 14841.41


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 14841.41





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 10910.44
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-12 00:00:00
    Sell Price: 10478.99
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-27 00:00:00
Account Value: 10000.0
    Buy Price: 10131.31
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-17 00:00:00
    Sell Price: 10353.08
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-24 00:00:00
Account Value: 10000.0
    Buy Price: 10104.26
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-07 00:00:00
    Sell Price: 9589.67
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-12-06 00:00:00
Account Value: 10000.0
    Buy Price: 8645.77
    Num Shares: 1.0
    Remaining Value: 1354.23
Sell Date: 
2003-02-07 00:00:00
    Sell Price: 7864.23
    Updated Value: 9218.46

-------------------------

Buy Date: 
2003-05-06 00:00:00
Account Value: 9218.46
    Buy Price: 8588.36
    Num Shares: 1.0
    Remaining Value: 630.1
Sell Date: 
2004-05-17 00:00:00
    Sell Price: 9906.91
    Updated Value: 10537.01

-------------------------

Buy Date: 
2004-09-30 00:00:00
Account Value: 10537.01
    Buy Price: 10080.27
    Num Shares: 1.0
    Remaining Value: 456.74
Sell Date: 
2004-10-01 00:00:00
    Sell Price: 10192.65
    Updated Value: 10649.39

-------------------------

Buy Date: 
2004-10-04 00:00:00
Account Value: 10649.39
    Buy Price: 10216.54
    Num Shares: 1.0
    Remaining Value: 432.85
Sell Date: 
2004-10-05 00:00:00
    Sell Price: 10177.68
    Updated Value: 10610.53

-------------------------

Buy Date: 
2004-11-19 00:00:00
Account Value: 10610.53
    Buy Price: 10456.91
    Num Shares: 1.0
    Remaining Value: 153.62
Sell Date: 
2005-04-15 00:00:00
    Sell Price: 10087.51
    Updated Value: 10241.13

-------------------------

Buy Date: 
2005-08-02 00:00:00
Account Value: 10241.13
    Buy Price: 10683.74
    Num Shares: 0.0
    Remaining Value: 10241.13
Sell Date: 
2005-10-13 00:00:00
    Sell Price: 10216.59
    Updated Value: 10241.13

-------------------------

Buy Date: 
2005-11-21 00:00:00
Account Value: 10241.13
    Buy Price: 10820.28
    Num Shares: 0.0
    Remaining Value: 10241.13
Sell Date: 
2006-06-23 00:00:00
    Sell Price: 10989.09
    Updated Value: 10241.13

-------------------------

Buy Date: 
2006-08-18 00:00:00
Account Value: 10241.13
    Buy Price: 11381.47
    Num Shares: 0.0
    Remaining Value: 10241.13
Sell Date: 
2007-03-28 00:00:00
    Sell Price: 12300.36
    Updated Value: 10241.13

-------------------------

Buy Date: 
2007-04-02 00:00:00
Account Value: 10241.13
    Buy Price: 12382.3
    Num Shares: 0.0
    Remaining Value: 10241.13
Sell Date: 
2007-11-20 00:00:00
    Sell Price: 13010.14
    Updated Value: 10241.13

-------------------------

Buy Date: 
2008-05-12 00:00:00
Account Value: 10241.13
    Buy Price: 12876.05
    Num Shares: 0.0
    Remaining Value: 10241.13
Sell Date: 
2008-06-12 00:00:00
    Sell Price: 12141.58
    Updated Value: 10241.13

-------------------------

Buy Date: 
2009-05-12 00:00:00
Account Value: 10241.13
    Buy Price: 8469.11
    Num Shares: 1.0
    Remaining Value: 1772.02
Sell Date: 
2010-06-01 00:00:00
    Sell Price: 10024.02
    Updated Value: 11796.04

-------------------------

Buy Date: 
2010-09-29 00:00:00
Account Value: 11796.04
    Buy Price: 10835.28
    Num Shares: 1.0
    Remaining Value: 960.76
Sell Date: 
2011-06-27 00:00:00
    Sell Price: 12043.56
    Updated Value: 13004.32

-------------------------

Buy Date: 
2011-07-13 00:00:00
Account Value: 13004.32
    Buy Price: 12491.61
    Num Shares: 1.0
    Remaining Value: 512.71
Sell Date: 
2011-08-09 00:00:00
    Sell Price: 11239.77
    Updated Value: 11752.48

-------------------------

Buy Date: 
2011-11-15 00:00:00
Account Value: 11752.48
    Buy Price: 12096.16
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2012-06-04 00:00:00
    Sell Price: 12101.46
    Updated Value: 11752.48

-------------------------

Buy Date: 
2012-08-09 00:00:00
Account Value: 11752.48
    Buy Price: 13165.19
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2012-11-27 00:00:00
    Sell Price: 12878.13
    Updated Value: 11752.48

-------------------------

Buy Date: 
2012-12-20 00:00:00
Account Value: 11752.48
    Buy Price: 13311.72
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2013-09-12 00:00:00
    Sell Price: 15300.64
    Updated Value: 11752.48

-------------------------

Buy Date: 
2013-09-19 00:00:00
Account Value: 11752.48
    Buy Price: 15636.55
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2013-10-22 00:00:00
    Sell Price: 15467.66
    Updated Value: 11752.48

-------------------------

Buy Date: 
2013-10-31 00:00:00
Account Value: 11752.48
    Buy Price: 15545.75
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2014-10-22 00:00:00
    Sell Price: 16461.32
    Updated Value: 11752.48

-------------------------

Buy Date: 
2014-11-12 00:00:00
Account Value: 11752.48
    Buy Price: 17612.2
    Num Shares: 0.0
    Remaining Value: 11752.48
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11752.48


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11752.48





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-07 00:00:00
Account Value: 10000
    Buy Price: 10935.17
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-28 00:00:00
    Sell Price: 10222.03
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-12 00:00:00
Account Value: 10000.0
    Buy Price: 10632.35
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-21 00:00:00
    Sell Price: 9253.79
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-02 00:00:00
Account Value: 10000.0
    Buy Price: 8582.68
    Num Shares: 1.0
    Remaining Value: 1417.32
Sell Date: 
2004-07-29 00:00:00
    Sell Price: 10129.24
    Updated Value: 11546.56

-------------------------

Buy Date: 
2004-11-23 00:00:00
Account Value: 11546.56
    Buy Price: 10492.6
    Num Shares: 1.0
    Remaining Value: 1053.96
Sell Date: 
2005-04-29 00:00:00
    Sell Price: 10192.51
    Updated Value: 11246.47

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 11246.47
    Buy Price: 10467.03
    Num Shares: 1.0
    Remaining Value: 779.44
Sell Date: 
2005-07-18 00:00:00
    Sell Price: 10574.99
    Updated Value: 11354.43

-------------------------

Buy Date: 
2005-07-26 00:00:00
Account Value: 11354.43
    Buy Price: 10579.77
    Num Shares: 1.0
    Remaining Value: 774.66
Sell Date: 
2005-09-01 00:00:00
    Sell Price: 10459.63
    Updated Value: 11234.29

-------------------------

Buy Date: 
2005-10-03 00:00:00
Account Value: 11234.29
    Buy Price: 10535.48
    Num Shares: 1.0
    Remaining Value: 698.81
Sell Date: 
2005-10-05 00:00:00
    Sell Price: 10317.36
    Updated Value: 11016.17

-------------------------

Buy Date: 
2005-11-22 00:00:00
Account Value: 11016.17
    Buy Price: 10871.43
    Num Shares: 1.0
    Remaining Value: 144.74
Sell Date: 
2007-12-05 00:00:00
    Sell Price: 13444.96
    Updated Value: 13589.7

-------------------------

Buy Date: 
2007-12-11 00:00:00
Account Value: 13589.7
    Buy Price: 13432.77
    Num Shares: 1.0
    Remaining Value: 156.93
Sell Date: 
2007-12-12 00:00:00
    Sell Price: 13473.9
    Updated Value: 13630.83

-------------------------

Buy Date: 
2007-12-18 00:00:00
Account Value: 13630.83
    Buy Price: 13232.47
    Num Shares: 1.0
    Remaining Value: 398.36
Sell Date: 
2008-01-08 00:00:00
    Sell Price: 12589.07
    Updated Value: 12987.43

-------------------------

Buy Date: 
2009-07-01 00:00:00
Account Value: 12987.43
    Buy Price: 8504.06
    Num Shares: 1.0
    Remaining Value: 4483.37
Sell Date: 
2009-07-07 00:00:00
    Sell Price: 8163.6
    Updated Value: 12646.97

-------------------------

Buy Date: 
2009-07-17 00:00:00
Account Value: 12646.97
    Buy Price: 8743.94
    Num Shares: 1.0
    Remaining Value: 3903.03
Sell Date: 
2010-06-14 00:00:00
    Sell Price: 10190.89
    Updated Value: 14093.92

-------------------------

Buy Date: 
2010-08-13 00:00:00
Account Value: 14093.92
    Buy Price: 10303.15
    Num Shares: 1.0
    Remaining Value: 3790.77
Sell Date: 
2010-08-26 00:00:00
    Sell Price: 9985.81
    Updated Value: 13776.58

-------------------------

Buy Date: 
2010-09-28 00:00:00
Account Value: 13776.58
    Buy Price: 10858.14
    Num Shares: 1.0
    Remaining Value: 2918.44
Sell Date: 
2011-08-18 00:00:00
    Sell Price: 10990.58
    Updated Value: 13909.02

-------------------------

Buy Date: 
2011-12-28 00:00:00
Account Value: 13909.02
    Buy Price: 12151.41
    Num Shares: 1.0
    Remaining Value: 1757.61
Sell Date: 
2012-11-23 00:00:00
    Sell Price: 13009.68
    Updated Value: 14767.29

-------------------------

Buy Date: 
2012-12-17 00:00:00
Account Value: 14767.29
    Buy Price: 13235.39
    Num Shares: 1.0
    Remaining Value: 1531.9
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19589.55


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19589.55





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-03 00:00:00
Account Value: 10000
    Buy Price: 10796.65
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-04 00:00:00
    Sell Price: 9997.49
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-13 00:00:00
Account Value: 10000.0
    Buy Price: 10501.85
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-30 00:00:00
    Sell Price: 9946.22
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-29 00:00:00
Account Value: 10000.0
    Buy Price: 9923.04
    Num Shares: 1.0
    Remaining Value: 76.96
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 9502.8
    Updated Value: 9579.76

-------------------------

Buy Date: 
2003-05-23 00:00:00
Account Value: 9579.76
    Buy Price: 8601.38
    Num Shares: 1.0
    Remaining Value: 978.38
Sell Date: 
2004-08-16 00:00:00
    Sell Price: 9954.55
    Updated Value: 10932.93

-------------------------

Buy Date: 
2004-09-10 00:00:00
Account Value: 10932.93
    Buy Price: 10313.07
    Num Shares: 1.0
    Remaining Value: 619.86
Sell Date: 
2004-10-08 00:00:00
    Sell Price: 10055.2
    Updated Value: 10675.06

-------------------------

Buy Date: 
2004-11-24 00:00:00
Account Value: 10675.06
    Buy Price: 10520.31
    Num Shares: 1.0
    Remaining Value: 154.75
Sell Date: 
2005-05-03 00:00:00
    Sell Price: 10256.95
    Updated Value: 10411.7

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 10411.7
    Buy Price: 10537.6
    Num Shares: 0.0
    Remaining Value: 10411.7
Sell Date: 
2005-10-11 00:00:00
    Sell Price: 10253.17
    Updated Value: 10411.7

-------------------------

Buy Date: 
2005-11-23 00:00:00
Account Value: 10411.7
    Buy Price: 10916.09
    Num Shares: 0.0
    Remaining Value: 10411.7
Sell Date: 
2008-01-17 00:00:00
    Sell Price: 12159.21
    Updated Value: 10411.7

-------------------------

Buy Date: 
2009-08-11 00:00:00
Account Value: 10411.7
    Buy Price: 9241.45
    Num Shares: 1.0
    Remaining Value: 1170.25
Sell Date: 
2010-07-20 00:00:00
    Sell Price: 10229.96
    Updated Value: 11400.21

-------------------------

Buy Date: 
2010-07-29 00:00:00
Account Value: 11400.21
    Buy Price: 10467.16
    Num Shares: 1.0
    Remaining Value: 933.05
Sell Date: 
2010-09-07 00:00:00
    Sell Price: 10340.69
    Updated Value: 11273.74

-------------------------

Buy Date: 
2010-09-23 00:00:00
Account Value: 11273.74
    Buy Price: 10662.42
    Num Shares: 1.0
    Remaining Value: 611.32
Sell Date: 
2011-08-23 00:00:00
    Sell Price: 11176.76
    Updated Value: 11788.08

-------------------------

Buy Date: 
2011-11-16 00:00:00
Account Value: 11788.08
    Buy Price: 11905.59
    Num Shares: 0.0
    Remaining Value: 11788.08
Sell Date: 
2011-11-25 00:00:00
    Sell Price: 11231.78
    Updated Value: 11788.08

-------------------------

Buy Date: 
2011-12-27 00:00:00
Account Value: 11788.08
    Buy Price: 12291.35
    Num Shares: 0.0
    Remaining Value: 11788.08
Sell Date: 
2012-12-06 00:00:00
    Sell Price: 13074.04
    Updated Value: 11788.08

-------------------------

Buy Date: 
2012-12-07 00:00:00
Account Value: 11788.08
    Buy Price: 13155.13
    Num Shares: 0.0
    Remaining Value: 11788.08
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11788.08


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11788.08





-----------------------------------------------------------------------
DJIA Calculations, N = [20, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-03 00:00:00
Account Value: 10000
    Buy Price: 10796.65
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-06 00:00:00
    Sell Price: 9840.84
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-19 00:00:00
Account Value: 10000.0
    Buy Price: 10635.25
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-30 00:00:00
    Sell Price: 9946.22
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-17 00:00:00
Account Value: 10000.0
    Buy Price: 9323.02
    Num Shares: 1.0
    Remaining Value: 676.98
Sell Date: 
2004-10-26 00:00:00
    Sell Price: 9888.48
    Updated Value: 10565.46

-------------------------

Buy Date: 
2004-11-17 00:00:00
Account Value: 10565.46
    Buy Price: 10549.57
    Num Shares: 1.0
    Remaining Value: 15.89
Sell Date: 
2005-04-28 00:00:00
    Sell Price: 10070.37
    Updated Value: 10086.26

-------------------------

Buy Date: 
2005-05-26 00:00:00
Account Value: 10086.26
    Buy Price: 10537.6
    Num Shares: 0.0
    Remaining Value: 10086.26
Sell Date: 
2005-10-17 00:00:00
    Sell Price: 10348.1
    Updated Value: 10086.26

-------------------------

Buy Date: 
2005-11-17 00:00:00
Account Value: 10086.26
    Buy Price: 10720.22
    Num Shares: 0.0
    Remaining Value: 10086.26
Sell Date: 
2008-01-23 00:00:00
    Sell Price: 12270.17
    Updated Value: 10086.26

-------------------------

Buy Date: 
2009-09-03 00:00:00
Account Value: 10086.26
    Buy Price: 9344.61
    Num Shares: 1.0
    Remaining Value: 741.65
Sell Date: 
2011-08-29 00:00:00
    Sell Price: 11539.25
    Updated Value: 12280.9

-------------------------

Buy Date: 
2011-11-03 00:00:00
Account Value: 12280.9
    Buy Price: 12044.47
    Num Shares: 1.0
    Remaining Value: 236.43
Sell Date: 
2011-12-14 00:00:00
    Sell Price: 11823.48
    Updated Value: 12059.91

-------------------------

Buy Date: 
2011-12-21 00:00:00
Account Value: 12059.91
    Buy Price: 12107.74
    Num Shares: 0.0
    Remaining Value: 12059.91
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12059.91


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12059.91





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-10 00:00:00
Account Value: 10000
    Buy Price: 10910.44
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-05 00:00:00
    Sell Price: 10479.86
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-13 00:00:00
Account Value: 10000.0
    Buy Price: 9750.95
    Num Shares: 1.0
    Remaining Value: 249.05
Sell Date: 
2002-02-12 00:00:00
    Sell Price: 9863.74
    Updated Value: 10112.79

-------------------------

Buy Date: 
2002-03-13 00:00:00
Account Value: 10112.79
    Buy Price: 10501.85
    Num Shares: 0.0
    Remaining Value: 10112.79
Sell Date: 
2002-05-01 00:00:00
    Sell Price: 10059.63
    Updated Value: 10112.79

-------------------------

Buy Date: 
2002-09-12 00:00:00
Account Value: 10112.79
    Buy Price: 8379.41
    Num Shares: 1.0
    Remaining Value: 1733.38
Sell Date: 
2002-10-02 00:00:00
    Sell Price: 7755.61
    Updated Value: 9488.99

-------------------------

Buy Date: 
2002-11-15 00:00:00
Account Value: 9488.99
    Buy Price: 8579.09
    Num Shares: 1.0
    Remaining Value: 909.9
Sell Date: 
2003-01-14 00:00:00
    Sell Price: 8842.62
    Updated Value: 9752.52

-------------------------

Buy Date: 
2003-04-09 00:00:00
Account Value: 9752.52
    Buy Price: 8197.94
    Num Shares: 1.0
    Remaining Value: 1554.58
Sell Date: 
2004-03-24 00:00:00
    Sell Price: 10048.23
    Updated Value: 11602.81

-------------------------

Buy Date: 
2004-05-06 00:00:00
Account Value: 11602.81
    Buy Price: 10241.26
    Num Shares: 1.0
    Remaining Value: 1361.55
Sell Date: 
2004-05-24 00:00:00
    Sell Price: 9958.43
    Updated Value: 11319.98

-------------------------

Buy Date: 
2004-07-02 00:00:00
Account Value: 11319.98
    Buy Price: 10282.83
    Num Shares: 1.0
    Remaining Value: 1037.15
Sell Date: 
2004-08-04 00:00:00
    Sell Price: 10126.51
    Updated Value: 11163.66

-------------------------

Buy Date: 
2004-09-21 00:00:00
Account Value: 11163.66
    Buy Price: 10244.93
    Num Shares: 1.0
    Remaining Value: 918.73
Sell Date: 
2004-10-25 00:00:00
    Sell Price: 9749.99
    Updated Value: 10668.72

-------------------------

Buy Date: 
2004-11-26 00:00:00
Account Value: 10668.72
    Buy Price: 10522.23
    Num Shares: 1.0
    Remaining Value: 146.49
Sell Date: 
2005-02-09 00:00:00
    Sell Price: 10664.11
    Updated Value: 10810.6

-------------------------

Buy Date: 
2005-03-08 00:00:00
Account Value: 10810.6
    Buy Price: 10912.62
    Num Shares: 0.0
    Remaining Value: 10810.6
Sell Date: 
2005-04-12 00:00:00
    Sell Price: 10507.97
    Updated Value: 10810.6

-------------------------

Buy Date: 
2005-06-09 00:00:00
Account Value: 10810.6
    Buy Price: 10503.02
    Num Shares: 1.0
    Remaining Value: 307.58
Sell Date: 
2005-07-28 00:00:00
    Sell Price: 10705.55
    Updated Value: 11013.13

-------------------------

Buy Date: 
2005-08-10 00:00:00
Account Value: 11013.13
    Buy Price: 10594.41
    Num Shares: 1.0
    Remaining Value: 418.72
Sell Date: 
2005-09-14 00:00:00
    Sell Price: 10558.75
    Updated Value: 10977.47

-------------------------

Buy Date: 
2005-11-25 00:00:00
Account Value: 10977.47
    Buy Price: 10931.62
    Num Shares: 1.0
    Remaining Value: 45.85
Sell Date: 
2006-02-28 00:00:00
    Sell Price: 10993.41
    Updated Value: 11039.26

-------------------------

Buy Date: 
2006-03-02 00:00:00
Account Value: 11039.26
    Buy Price: 11025.51
    Num Shares: 1.0
    Remaining Value: 13.75
Sell Date: 
2006-06-19 00:00:00
    Sell Price: 10942.11
    Updated Value: 10955.86

-------------------------

Buy Date: 
2006-08-02 00:00:00
Account Value: 10955.86
    Buy Price: 11199.92
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2007-03-19 00:00:00
    Sell Price: 12226.17
    Updated Value: 10955.86

-------------------------

Buy Date: 
2007-04-26 00:00:00
Account Value: 10955.86
    Buy Price: 13105.5
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2007-08-24 00:00:00
    Sell Price: 13378.87
    Updated Value: 10955.86

-------------------------

Buy Date: 
2007-10-02 00:00:00
Account Value: 10955.86
    Buy Price: 14047.31
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2007-11-19 00:00:00
    Sell Price: 12958.44
    Updated Value: 10955.86

-------------------------

Buy Date: 
2008-01-10 00:00:00
Account Value: 10955.86
    Buy Price: 12853.09
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2008-01-23 00:00:00
    Sell Price: 12270.17
    Updated Value: 10955.86

-------------------------

Buy Date: 
2008-04-22 00:00:00
Account Value: 10955.86
    Buy Price: 12720.23
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2008-06-17 00:00:00
    Sell Price: 12160.3
    Updated Value: 10955.86

-------------------------

Buy Date: 
2008-08-27 00:00:00
Account Value: 10955.86
    Buy Price: 11502.51
    Num Shares: 0.0
    Remaining Value: 10955.86
Sell Date: 
2008-09-23 00:00:00
    Sell Price: 10854.17
    Updated Value: 10955.86

-------------------------

Buy Date: 
2009-01-14 00:00:00
Account Value: 10955.86
    Buy Price: 8200.14
    Num Shares: 1.0
    Remaining Value: 2755.72
Sell Date: 
2009-02-03 00:00:00
    Sell Price: 8078.36
    Updated Value: 10834.08

-------------------------

Buy Date: 
2009-04-20 00:00:00
Account Value: 10834.08
    Buy Price: 7841.73
    Num Shares: 1.0
    Remaining Value: 2992.35
Sell Date: 
2009-07-23 00:00:00
    Sell Price: 9069.29
    Updated Value: 12061.64

-------------------------

Buy Date: 
2009-08-07 00:00:00
Account Value: 12061.64
    Buy Price: 9370.07
    Num Shares: 1.0
    Remaining Value: 2691.57
Sell Date: 
2010-02-17 00:00:00
    Sell Price: 10309.24
    Updated Value: 13000.81

-------------------------

Buy Date: 
2010-03-23 00:00:00
Account Value: 13000.81
    Buy Price: 10888.83
    Num Shares: 1.0
    Remaining Value: 2111.98
Sell Date: 
2010-05-27 00:00:00
    Sell Price: 10258.99
    Updated Value: 12370.97

-------------------------

Buy Date: 
2010-07-26 00:00:00
Account Value: 12370.97
    Buy Price: 10525.43
    Num Shares: 1.0
    Remaining Value: 1845.54
Sell Date: 
2010-08-04 00:00:00
    Sell Price: 10680.43
    Updated Value: 12525.97

-------------------------

Buy Date: 
2010-08-10 00:00:00
Account Value: 12525.97
    Buy Price: 10644.25
    Num Shares: 1.0
    Remaining Value: 1881.72
Sell Date: 
2010-09-17 00:00:00
    Sell Price: 10607.85
    Updated Value: 12489.57

-------------------------

Buy Date: 
2010-10-07 00:00:00
Account Value: 12489.57
    Buy Price: 10948.58
    Num Shares: 1.0
    Remaining Value: 1540.99
Sell Date: 
2011-04-04 00:00:00
    Sell Price: 12400.03
    Updated Value: 13941.02

-------------------------

Buy Date: 
2011-04-27 00:00:00
Account Value: 13941.02
    Buy Price: 12690.96
    Num Shares: 1.0
    Remaining Value: 1250.06
Sell Date: 
2011-06-16 00:00:00
    Sell Price: 11961.52
    Updated Value: 13211.58

-------------------------

Buy Date: 
2011-07-28 00:00:00
Account Value: 13211.58
    Buy Price: 12240.11
    Num Shares: 1.0
    Remaining Value: 971.47
Sell Date: 
2011-08-19 00:00:00
    Sell Price: 10817.65
    Updated Value: 11789.12

-------------------------

Buy Date: 
2011-10-26 00:00:00
Account Value: 11789.12
    Buy Price: 11869.04
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2011-10-28 00:00:00
    Sell Price: 12231.11
    Updated Value: 11789.12

-------------------------

Buy Date: 
2011-11-03 00:00:00
Account Value: 11789.12
    Buy Price: 12044.47
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2011-12-28 00:00:00
    Sell Price: 12151.41
    Updated Value: 11789.12

-------------------------

Buy Date: 
2012-01-09 00:00:00
Account Value: 11789.12
    Buy Price: 12392.69
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2012-05-10 00:00:00
    Sell Price: 12855.04
    Updated Value: 11789.12

-------------------------

Buy Date: 
2012-07-17 00:00:00
Account Value: 11789.12
    Buy Price: 12805.54
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2012-11-13 00:00:00
    Sell Price: 12756.18
    Updated Value: 11789.12

-------------------------

Buy Date: 
2013-01-03 00:00:00
Account Value: 11789.12
    Buy Price: 13391.36
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2013-07-10 00:00:00
    Sell Price: 15291.66
    Updated Value: 11789.12

-------------------------

Buy Date: 
2013-08-02 00:00:00
Account Value: 11789.12
    Buy Price: 15658.36
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2013-09-09 00:00:00
    Sell Price: 15063.12
    Updated Value: 11789.12

-------------------------

Buy Date: 
2013-10-14 00:00:00
Account Value: 11789.12
    Buy Price: 15301.26
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2014-02-19 00:00:00
    Sell Price: 16040.56
    Updated Value: 11789.12

-------------------------

Buy Date: 
2014-03-21 00:00:00
Account Value: 11789.12
    Buy Price: 16302.77
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2014-08-20 00:00:00
    Sell Price: 16979.13
    Updated Value: 11789.12

-------------------------

Buy Date: 
2014-09-19 00:00:00
Account Value: 11789.12
    Buy Price: 17279.74
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2014-10-22 00:00:00
    Sell Price: 16461.32
    Updated Value: 11789.12

-------------------------

Buy Date: 
2014-11-25 00:00:00
Account Value: 11789.12
    Buy Price: 17814.94
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2015-01-16 00:00:00
    Sell Price: 17511.57
    Updated Value: 11789.12

-------------------------

Buy Date: 
2015-01-30 00:00:00
Account Value: 11789.12
    Buy Price: 17164.95
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2015-02-06 00:00:00
    Sell Price: 17824.29
    Updated Value: 11789.12

-------------------------

Buy Date: 
2015-03-05 00:00:00
Account Value: 11789.12
    Buy Price: 18135.72
    Num Shares: 0.0
    Remaining Value: 11789.12
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11789.12


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11789.12





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 11248.58
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-20 00:00:00
    Sell Price: 10576.65
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-04 00:00:00
Account Value: 10000.0
    Buy Price: 9893.84
    Num Shares: 1.0
    Remaining Value: 106.16
Sell Date: 
2002-02-21 00:00:00
    Sell Price: 9834.68
    Updated Value: 9940.84

-------------------------

Buy Date: 
2002-03-12 00:00:00
Account Value: 9940.84
    Buy Price: 10632.35
    Num Shares: 0.0
    Remaining Value: 9940.84
Sell Date: 
2002-05-16 00:00:00
    Sell Price: 10289.21
    Updated Value: 9940.84

-------------------------

Buy Date: 
2002-11-22 00:00:00
Account Value: 9940.84
    Buy Price: 8804.84
    Num Shares: 1.0
    Remaining Value: 1136.0
Sell Date: 
2003-01-30 00:00:00
    Sell Price: 7945.13
    Updated Value: 9081.13

-------------------------

Buy Date: 
2003-04-24 00:00:00
Account Value: 9081.13
    Buy Price: 8440.04
    Num Shares: 1.0
    Remaining Value: 641.09
Sell Date: 
2004-03-31 00:00:00
    Sell Price: 10357.7
    Updated Value: 10998.79

-------------------------

Buy Date: 
2004-07-07 00:00:00
Account Value: 10998.79
    Buy Price: 10240.29
    Num Shares: 1.0
    Remaining Value: 758.5
Sell Date: 
2004-08-05 00:00:00
    Sell Price: 9963.03
    Updated Value: 10721.53

-------------------------

Buy Date: 
2004-10-01 00:00:00
Account Value: 10721.53
    Buy Price: 10192.65
    Num Shares: 1.0
    Remaining Value: 528.88
Sell Date: 
2004-10-26 00:00:00
    Sell Price: 9888.48
    Updated Value: 10417.36

-------------------------

Buy Date: 
2004-11-29 00:00:00
Account Value: 10417.36
    Buy Price: 10475.9
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2005-02-25 00:00:00
    Sell Price: 10841.6
    Updated Value: 10417.36

-------------------------

Buy Date: 
2005-02-28 00:00:00
Account Value: 10417.36
    Buy Price: 10766.23
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2005-04-15 00:00:00
    Sell Price: 10087.51
    Updated Value: 10417.36

-------------------------

Buy Date: 
2005-06-23 00:00:00
Account Value: 10417.36
    Buy Price: 10421.44
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2005-09-26 00:00:00
    Sell Price: 10443.63
    Updated Value: 10417.36

-------------------------

Buy Date: 
2005-11-29 00:00:00
Account Value: 10417.36
    Buy Price: 10888.16
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2006-06-20 00:00:00
    Sell Price: 10974.84
    Updated Value: 10417.36

-------------------------

Buy Date: 
2006-08-25 00:00:00
Account Value: 10417.36
    Buy Price: 11284.05
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2007-03-26 00:00:00
    Sell Price: 12469.07
    Updated Value: 10417.36

-------------------------

Buy Date: 
2007-04-27 00:00:00
Account Value: 10417.36
    Buy Price: 13120.94
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2007-08-27 00:00:00
    Sell Price: 13322.13
    Updated Value: 10417.36

-------------------------

Buy Date: 
2007-10-08 00:00:00
Account Value: 10417.36
    Buy Price: 14043.73
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2007-11-29 00:00:00
    Sell Price: 13311.73
    Updated Value: 10417.36

-------------------------

Buy Date: 
2008-04-24 00:00:00
Account Value: 10417.36
    Buy Price: 12848.95
    Num Shares: 0.0
    Remaining Value: 10417.36
Sell Date: 
2008-06-25 00:00:00
    Sell Price: 11811.83
    Updated Value: 10417.36

-------------------------

Buy Date: 
2009-04-28 00:00:00
Account Value: 10417.36
    Buy Price: 8016.95
    Num Shares: 1.0
    Remaining Value: 2400.41
Sell Date: 
2010-02-23 00:00:00
    Sell Price: 10282.41
    Updated Value: 12682.82

-------------------------

Buy Date: 
2010-03-25 00:00:00
Account Value: 12682.82
    Buy Price: 10841.21
    Num Shares: 1.0
    Remaining Value: 1841.61
Sell Date: 
2010-06-07 00:00:00
    Sell Price: 9816.49
    Updated Value: 11658.1

-------------------------

Buy Date: 
2010-08-17 00:00:00
Account Value: 11658.1
    Buy Price: 10405.85
    Num Shares: 1.0
    Remaining Value: 1252.25
Sell Date: 
2011-06-27 00:00:00
    Sell Price: 12043.56
    Updated Value: 13295.81

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 13295.81
    Buy Price: 12170.18
    Num Shares: 1.0
    Remaining Value: 1125.63
Sell Date: 
2012-05-17 00:00:00
    Sell Price: 12442.49
    Updated Value: 13568.12

-------------------------

Buy Date: 
2012-08-03 00:00:00
Account Value: 13568.12
    Buy Price: 13096.17
    Num Shares: 1.0
    Remaining Value: 471.95
Sell Date: 
2012-11-19 00:00:00
    Sell Price: 12795.96
    Updated Value: 13267.91

-------------------------

Buy Date: 
2013-01-16 00:00:00
Account Value: 13267.91
    Buy Price: 13511.23
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2013-09-16 00:00:00
    Sell Price: 15494.78
    Updated Value: 13267.91

-------------------------

Buy Date: 
2013-11-08 00:00:00
Account Value: 13267.91
    Buy Price: 15761.78
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2014-02-26 00:00:00
    Sell Price: 16198.41
    Updated Value: 13267.91

-------------------------

Buy Date: 
2014-03-21 00:00:00
Account Value: 13267.91
    Buy Price: 16302.77
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2014-09-03 00:00:00
    Sell Price: 17078.28
    Updated Value: 13267.91

-------------------------

Buy Date: 
2014-09-19 00:00:00
Account Value: 13267.91
    Buy Price: 17279.74
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2014-10-27 00:00:00
    Sell Price: 16817.94
    Updated Value: 13267.91

-------------------------

Buy Date: 
2014-11-24 00:00:00
Account Value: 13267.91
    Buy Price: 17817.9
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2015-02-13 00:00:00
    Sell Price: 18019.35
    Updated Value: 13267.91

-------------------------

Buy Date: 
2015-03-02 00:00:00
Account Value: 13267.91
    Buy Price: 18288.63
    Num Shares: 0.0
    Remaining Value: 13267.91
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 13267.91


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 13267.91





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 11337.92
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-25 00:00:00
    Sell Price: 10405.67
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-28 00:00:00
Account Value: 10000.0
    Buy Price: 10136.99
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-31 00:00:00
    Sell Price: 9925.25
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-12-10 00:00:00
Account Value: 10000.0
    Buy Price: 8574.26
    Num Shares: 1.0
    Remaining Value: 1425.74
Sell Date: 
2003-02-19 00:00:00
    Sell Price: 8000.6
    Updated Value: 9426.34

-------------------------

Buy Date: 
2003-05-13 00:00:00
Account Value: 9426.34
    Buy Price: 8679.25
    Num Shares: 1.0
    Remaining Value: 747.09
Sell Date: 
2004-05-20 00:00:00
    Sell Price: 9937.64
    Updated Value: 10684.73

-------------------------

Buy Date: 
2004-10-12 00:00:00
Account Value: 10684.73
    Buy Price: 10077.18
    Num Shares: 1.0
    Remaining Value: 607.55
Sell Date: 
2004-10-18 00:00:00
    Sell Price: 9956.32
    Updated Value: 10563.87

-------------------------

Buy Date: 
2004-12-01 00:00:00
Account Value: 10563.87
    Buy Price: 10590.22
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2005-04-21 00:00:00
    Sell Price: 10218.6
    Updated Value: 10563.87

-------------------------

Buy Date: 
2005-08-11 00:00:00
Account Value: 10563.87
    Buy Price: 10685.89
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2005-10-21 00:00:00
    Sell Price: 10215.22
    Updated Value: 10563.87

-------------------------

Buy Date: 
2005-11-30 00:00:00
Account Value: 10563.87
    Buy Price: 10805.87
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2006-06-29 00:00:00
    Sell Price: 11190.8
    Updated Value: 10563.87

-------------------------

Buy Date: 
2006-08-31 00:00:00
Account Value: 10563.87
    Buy Price: 11381.15
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2007-04-10 00:00:00
    Sell Price: 12573.85
    Updated Value: 10563.87

-------------------------

Buy Date: 
2007-04-17 00:00:00
Account Value: 10563.87
    Buy Price: 12773.04
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2007-11-27 00:00:00
    Sell Price: 12958.44
    Updated Value: 10563.87

-------------------------

Buy Date: 
2008-05-22 00:00:00
Account Value: 10563.87
    Buy Price: 12625.62
    Num Shares: 0.0
    Remaining Value: 10563.87
Sell Date: 
2008-06-25 00:00:00
    Sell Price: 11811.83
    Updated Value: 10563.87

-------------------------

Buy Date: 
2009-05-19 00:00:00
Account Value: 10563.87
    Buy Price: 8474.85
    Num Shares: 1.0
    Remaining Value: 2089.02
Sell Date: 
2010-06-10 00:00:00
    Sell Price: 10172.53
    Updated Value: 12261.55

-------------------------

Buy Date: 
2010-10-08 00:00:00
Account Value: 12261.55
    Buy Price: 11006.48
    Num Shares: 1.0
    Remaining Value: 1255.07
Sell Date: 
2011-07-12 00:00:00
    Sell Price: 12446.88
    Updated Value: 13701.95

-------------------------

Buy Date: 
2011-07-25 00:00:00
Account Value: 13701.95
    Buy Price: 12592.8
    Num Shares: 1.0
    Remaining Value: 1109.15
Sell Date: 
2011-08-15 00:00:00
    Sell Price: 11482.9
    Updated Value: 12592.05

-------------------------

Buy Date: 
2011-11-28 00:00:00
Account Value: 12592.05
    Buy Price: 11523.01
    Num Shares: 1.0
    Remaining Value: 1069.04
Sell Date: 
2012-06-13 00:00:00
    Sell Price: 12496.38
    Updated Value: 13565.42

-------------------------

Buy Date: 
2012-08-20 00:00:00
Account Value: 13565.42
    Buy Price: 13271.64
    Num Shares: 1.0
    Remaining Value: 293.78
Sell Date: 
2012-12-05 00:00:00
    Sell Price: 13034.49
    Updated Value: 13328.27

-------------------------

Buy Date: 
2013-01-10 00:00:00
Account Value: 13328.27
    Buy Price: 13471.22
    Num Shares: 0.0
    Remaining Value: 13328.27
Sell Date: 
2014-11-03 00:00:00
    Sell Price: 17366.24
    Updated Value: 13328.27

-------------------------

Buy Date: 
2014-11-20 00:00:00
Account Value: 13328.27
    Buy Price: 17719.0
    Num Shares: 0.0
    Remaining Value: 13328.27
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 13328.27


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 13328.27





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-16 00:00:00
Account Value: 10000
    Buy Price: 11215.92
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-30 00:00:00
    Sell Price: 9919.58
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-19 00:00:00
Account Value: 10000.0
    Buy Price: 10635.25
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-02 00:00:00
    Sell Price: 9007.75
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-13 00:00:00
Account Value: 10000.0
    Buy Price: 8679.25
    Num Shares: 1.0
    Remaining Value: 1320.75
Sell Date: 
2004-08-06 00:00:00
    Sell Price: 9815.33
    Updated Value: 11136.08

-------------------------

Buy Date: 
2004-12-06 00:00:00
Account Value: 11136.08
    Buy Price: 10547.06
    Num Shares: 1.0
    Remaining Value: 589.02
Sell Date: 
2005-05-10 00:00:00
    Sell Price: 10281.11
    Updated Value: 10870.13

-------------------------

Buy Date: 
2005-06-15 00:00:00
Account Value: 10870.13
    Buy Price: 10566.37
    Num Shares: 1.0
    Remaining Value: 303.76
Sell Date: 
2005-08-03 00:00:00
    Sell Price: 10697.59
    Updated Value: 11001.35

-------------------------

Buy Date: 
2005-08-09 00:00:00
Account Value: 11001.35
    Buy Price: 10615.67
    Num Shares: 1.0
    Remaining Value: 385.68
Sell Date: 
2005-09-15 00:00:00
    Sell Price: 10558.75
    Updated Value: 10944.43

-------------------------

Buy Date: 
2005-11-30 00:00:00
Account Value: 10944.43
    Buy Price: 10805.87
    Num Shares: 1.0
    Remaining Value: 138.56
Sell Date: 
2007-12-19 00:00:00
    Sell Price: 13207.27
    Updated Value: 13345.83

-------------------------

Buy Date: 
2009-07-07 00:00:00
Account Value: 13345.83
    Buy Price: 8163.6
    Num Shares: 1.0
    Remaining Value: 5182.23
Sell Date: 
2010-06-24 00:00:00
    Sell Price: 10152.8
    Updated Value: 15335.03

-------------------------

Buy Date: 
2010-10-08 00:00:00
Account Value: 15335.03
    Buy Price: 11006.48
    Num Shares: 1.0
    Remaining Value: 4328.55
Sell Date: 
2011-08-25 00:00:00
    Sell Price: 11149.82
    Updated Value: 15478.37

-------------------------

Buy Date: 
2012-01-10 00:00:00
Account Value: 15478.37
    Buy Price: 12462.47
    Num Shares: 1.0
    Remaining Value: 3015.9
Sell Date: 
2012-12-06 00:00:00
    Sell Price: 13074.04
    Updated Value: 16089.94

-------------------------

Buy Date: 
2012-12-28 00:00:00
Account Value: 16089.94
    Buy Price: 12938.11
    Num Shares: 1.0
    Remaining Value: 3151.83
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 21209.48


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 21209.48





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-14 00:00:00
Account Value: 10000
    Buy Price: 10877.33
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-10 00:00:00
    Sell Price: 9605.51
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-22 00:00:00
Account Value: 10000.0
    Buy Price: 10427.67
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-03 00:00:00
    Sell Price: 9709.79
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-06-12 00:00:00
Account Value: 10000.0
    Buy Price: 9617.71
    Num Shares: 1.0
    Remaining Value: 382.29
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 9502.8
    Updated Value: 9885.09

-------------------------

Buy Date: 
2003-05-30 00:00:00
Account Value: 9885.09
    Buy Price: 8850.26
    Num Shares: 1.0
    Remaining Value: 1034.83
Sell Date: 
2004-08-24 00:00:00
    Sell Price: 10098.63
    Updated Value: 11133.46

-------------------------

Buy Date: 
2004-09-27 00:00:00
Account Value: 11133.46
    Buy Price: 9988.54
    Num Shares: 1.0
    Remaining Value: 1144.92
Sell Date: 
2004-10-15 00:00:00
    Sell Price: 9933.38
    Updated Value: 11078.3

-------------------------

Buy Date: 
2004-12-07 00:00:00
Account Value: 11078.3
    Buy Price: 10440.58
    Num Shares: 1.0
    Remaining Value: 637.72
Sell Date: 
2005-05-12 00:00:00
    Sell Price: 10189.48
    Updated Value: 10827.2

-------------------------

Buy Date: 
2005-06-08 00:00:00
Account Value: 10827.2
    Buy Price: 10476.86
    Num Shares: 1.0
    Remaining Value: 350.34
Sell Date: 
2005-10-14 00:00:00
    Sell Price: 10287.34
    Updated Value: 10637.68

-------------------------

Buy Date: 
2005-12-02 00:00:00
Account Value: 10637.68
    Buy Price: 10877.51
    Num Shares: 0.0
    Remaining Value: 10637.68
Sell Date: 
2008-01-24 00:00:00
    Sell Price: 12378.61
    Updated Value: 10637.68

-------------------------

Buy Date: 
2009-08-19 00:00:00
Account Value: 10637.68
    Buy Price: 9279.16
    Num Shares: 1.0
    Remaining Value: 1358.52
Sell Date: 
2010-09-21 00:00:00
    Sell Price: 10761.03
    Updated Value: 12119.55

-------------------------

Buy Date: 
2010-10-01 00:00:00
Account Value: 12119.55
    Buy Price: 10829.68
    Num Shares: 1.0
    Remaining Value: 1289.87
Sell Date: 
2011-09-01 00:00:00
    Sell Price: 11493.57
    Updated Value: 12783.44

-------------------------

Buy Date: 
2012-01-10 00:00:00
Account Value: 12783.44
    Buy Price: 12462.47
    Num Shares: 1.0
    Remaining Value: 320.97
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 18378.62


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 18378.62





-----------------------------------------------------------------------
DJIA Calculations, N = [30, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-11 00:00:00
Account Value: 10000
    Buy Price: 10821.31
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-18 00:00:00
    Sell Price: 8903.4
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-28 00:00:00
Account Value: 10000.0
    Buy Price: 10403.94
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-10 00:00:00
    Sell Price: 9939.92
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-20 00:00:00
Account Value: 10000.0
    Buy Price: 9200.75
    Num Shares: 1.0
    Remaining Value: 799.25
Sell Date: 
2004-10-29 00:00:00
    Sell Price: 10027.47
    Updated Value: 10826.72

-------------------------

Buy Date: 
2004-11-26 00:00:00
Account Value: 10826.72
    Buy Price: 10522.23
    Num Shares: 1.0
    Remaining Value: 304.49
Sell Date: 
2005-05-12 00:00:00
    Sell Price: 10189.48
    Updated Value: 10493.97

-------------------------

Buy Date: 
2005-06-06 00:00:00
Account Value: 10493.97
    Buy Price: 10467.03
    Num Shares: 1.0
    Remaining Value: 26.94
Sell Date: 
2005-10-26 00:00:00
    Sell Price: 10344.98
    Updated Value: 10371.92

-------------------------

Buy Date: 
2005-11-23 00:00:00
Account Value: 10371.92
    Buy Price: 10916.09
    Num Shares: 0.0
    Remaining Value: 10371.92
Sell Date: 
2008-01-29 00:00:00
    Sell Price: 12480.3
    Updated Value: 10371.92

-------------------------

Buy Date: 
2009-09-09 00:00:00
Account Value: 10371.92
    Buy Price: 9547.22
    Num Shares: 1.0
    Remaining Value: 824.7
Sell Date: 
2011-09-12 00:00:00
    Sell Price: 11061.12
    Updated Value: 11885.82

-------------------------

Buy Date: 
2011-11-16 00:00:00
Account Value: 11885.82
    Buy Price: 11905.59
    Num Shares: 0.0
    Remaining Value: 11885.82
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11885.82


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11885.82





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 50]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 11248.58
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-13 00:00:00
    Sell Price: 10539.06
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-11-19 00:00:00
Account Value: 10000.0
    Buy Price: 9976.46
    Num Shares: 1.0
    Remaining Value: 23.54
Sell Date: 
2002-02-25 00:00:00
    Sell Price: 10145.71
    Updated Value: 10169.25

-------------------------

Buy Date: 
2002-03-20 00:00:00
Account Value: 10169.25
    Buy Price: 10501.57
    Num Shares: 0.0
    Remaining Value: 10169.25
Sell Date: 
2002-05-07 00:00:00
    Sell Price: 9836.55
    Updated Value: 10169.25

-------------------------

Buy Date: 
2002-09-18 00:00:00
Account Value: 10169.25
    Buy Price: 8172.45
    Num Shares: 1.0
    Remaining Value: 1996.8
Sell Date: 
2002-10-07 00:00:00
    Sell Price: 7422.84
    Updated Value: 9419.64

-------------------------

Buy Date: 
2002-11-21 00:00:00
Account Value: 9419.64
    Buy Price: 8845.15
    Num Shares: 1.0
    Remaining Value: 574.49
Sell Date: 
2003-01-27 00:00:00
    Sell Price: 7989.56
    Updated Value: 8564.05

-------------------------

Buy Date: 
2003-04-10 00:00:00
Account Value: 8564.05
    Buy Price: 8221.33
    Num Shares: 1.0
    Remaining Value: 342.72
Sell Date: 
2003-08-14 00:00:00
    Sell Price: 9310.56
    Updated Value: 9653.28

-------------------------

Buy Date: 
2003-08-26 00:00:00
Account Value: 9653.28
    Buy Price: 9340.45
    Num Shares: 1.0
    Remaining Value: 312.83
Sell Date: 
2004-03-23 00:00:00
    Sell Price: 10063.64
    Updated Value: 10376.47

-------------------------

Buy Date: 
2004-05-17 00:00:00
Account Value: 10376.47
    Buy Price: 9906.91
    Num Shares: 1.0
    Remaining Value: 469.56
Sell Date: 
2004-06-03 00:00:00
    Sell Price: 10195.91
    Updated Value: 10665.47

-------------------------

Buy Date: 
2004-07-13 00:00:00
Account Value: 10665.47
    Buy Price: 10247.59
    Num Shares: 1.0
    Remaining Value: 417.88
Sell Date: 
2004-08-09 00:00:00
    Sell Price: 9814.66
    Updated Value: 10232.54

-------------------------

Buy Date: 
2004-09-23 00:00:00
Account Value: 10232.54
    Buy Price: 10038.9
    Num Shares: 1.0
    Remaining Value: 193.64
Sell Date: 
2004-09-28 00:00:00
    Sell Price: 10077.4
    Updated Value: 10271.04

-------------------------

Buy Date: 
2004-10-01 00:00:00
Account Value: 10271.04
    Buy Price: 10192.65
    Num Shares: 1.0
    Remaining Value: 78.39
Sell Date: 
2004-10-29 00:00:00
    Sell Price: 10027.47
    Updated Value: 10105.86

-------------------------

Buy Date: 
2004-11-26 00:00:00
Account Value: 10105.86
    Buy Price: 10522.23
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-02-18 00:00:00
    Sell Price: 10785.22
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-03-14 00:00:00
Account Value: 10105.86
    Buy Price: 10804.51
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-04-14 00:00:00
    Sell Price: 10278.75
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-06-16 00:00:00
Account Value: 10105.86
    Buy Price: 10578.65
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-07-28 00:00:00
    Sell Price: 10705.55
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-08-03 00:00:00
Account Value: 10105.86
    Buy Price: 10697.59
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-08-12 00:00:00
    Sell Price: 10600.3
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-08-23 00:00:00
Account Value: 10105.86
    Buy Price: 10519.58
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-09-19 00:00:00
    Sell Price: 10557.63
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-10-31 00:00:00
Account Value: 10105.86
    Buy Price: 10440.07
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2005-11-02 00:00:00
    Sell Price: 10472.73
    Updated Value: 10105.86

-------------------------

Buy Date: 
2005-12-05 00:00:00
Account Value: 10105.86
    Buy Price: 10835.01
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2006-01-31 00:00:00
    Sell Price: 10864.86
    Updated Value: 10105.86

-------------------------

Buy Date: 
2006-02-08 00:00:00
Account Value: 10105.86
    Buy Price: 10858.62
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2006-03-13 00:00:00
    Sell Price: 11076.02
    Updated Value: 10105.86

-------------------------

Buy Date: 
2006-03-21 00:00:00
Account Value: 10105.86
    Buy Price: 11235.47
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2006-06-23 00:00:00
    Sell Price: 10989.09
    Updated Value: 10105.86

-------------------------

Buy Date: 
2006-08-09 00:00:00
Account Value: 10105.86
    Buy Price: 11076.18
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2006-09-05 00:00:00
    Sell Price: 11469.28
    Updated Value: 10105.86

-------------------------

Buy Date: 
2006-09-08 00:00:00
Account Value: 10105.86
    Buy Price: 11392.11
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2007-03-22 00:00:00
    Sell Price: 12461.14
    Updated Value: 10105.86

-------------------------

Buy Date: 
2007-05-02 00:00:00
Account Value: 10105.86
    Buy Price: 13211.88
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2007-07-30 00:00:00
    Sell Price: 13358.31
    Updated Value: 10105.86

-------------------------

Buy Date: 
2007-08-03 00:00:00
Account Value: 10105.86
    Buy Price: 13181.91
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2007-09-07 00:00:00
    Sell Price: 13113.38
    Updated Value: 10105.86

-------------------------

Buy Date: 
2007-10-10 00:00:00
Account Value: 10105.86
    Buy Price: 14078.69
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2007-11-26 00:00:00
    Sell Price: 12743.44
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-01-18 00:00:00
Account Value: 10105.86
    Buy Price: 12099.3
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-02-04 00:00:00
    Sell Price: 12635.16
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-03-25 00:00:00
Account Value: 10105.86
    Buy Price: 12532.6
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-04-01 00:00:00
    Sell Price: 12654.36
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-04-16 00:00:00
Account Value: 10105.86
    Buy Price: 12619.27
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-04-21 00:00:00
    Sell Price: 12825.02
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-05-05 00:00:00
Account Value: 10105.86
    Buy Price: 12969.54
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-06-24 00:00:00
    Sell Price: 11807.43
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-09-04 00:00:00
Account Value: 10105.86
    Buy Price: 11188.23
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-09-25 00:00:00
    Sell Price: 11022.06
    Updated Value: 10105.86

-------------------------

Buy Date: 
2008-09-29 00:00:00
Account Value: 10105.86
    Buy Price: 10365.45
    Num Shares: 0.0
    Remaining Value: 10105.86
Sell Date: 
2008-10-02 00:00:00
    Sell Price: 10482.85
    Updated Value: 10105.86

-------------------------

Buy Date: 
2009-01-21 00:00:00
Account Value: 10105.86
    Buy Price: 8228.1
    Num Shares: 1.0
    Remaining Value: 1877.76
Sell Date: 
2009-02-05 00:00:00
    Sell Price: 8063.07
    Updated Value: 9940.83

-------------------------

Buy Date: 
2009-04-28 00:00:00
Account Value: 9940.83
    Buy Price: 8016.95
    Num Shares: 1.0
    Remaining Value: 1923.88
Sell Date: 
2009-08-04 00:00:00
    Sell Price: 9320.19
    Updated Value: 11244.07

-------------------------

Buy Date: 
2009-08-18 00:00:00
Account Value: 11244.07
    Buy Price: 9217.94
    Num Shares: 1.0
    Remaining Value: 2026.13
Sell Date: 
2010-02-24 00:00:00
    Sell Price: 10374.16
    Updated Value: 12400.29

-------------------------

Buy Date: 
2010-03-30 00:00:00
Account Value: 12400.29
    Buy Price: 10907.42
    Num Shares: 1.0
    Remaining Value: 1492.87
Sell Date: 
2010-06-02 00:00:00
    Sell Price: 10249.54
    Updated Value: 11742.41

-------------------------

Buy Date: 
2010-07-29 00:00:00
Account Value: 11742.41
    Buy Price: 10467.16
    Num Shares: 1.0
    Remaining Value: 1275.25
Sell Date: 
2010-08-17 00:00:00
    Sell Price: 10405.85
    Updated Value: 11681.1

-------------------------

Buy Date: 
2010-08-26 00:00:00
Account Value: 11681.1
    Buy Price: 9985.81
    Num Shares: 1.0
    Remaining Value: 1695.29
Sell Date: 
2010-09-29 00:00:00
    Sell Price: 10835.28
    Updated Value: 12530.57

-------------------------

Buy Date: 
2010-10-15 00:00:00
Account Value: 12530.57
    Buy Price: 11062.78
    Num Shares: 1.0
    Remaining Value: 1467.79
Sell Date: 
2011-04-12 00:00:00
    Sell Price: 12263.58
    Updated Value: 13731.37

-------------------------

Buy Date: 
2011-05-02 00:00:00
Account Value: 13731.37
    Buy Price: 12807.36
    Num Shares: 1.0
    Remaining Value: 924.01
Sell Date: 
2011-06-27 00:00:00
    Sell Price: 12043.56
    Updated Value: 12967.57

-------------------------

Buy Date: 
2011-08-08 00:00:00
Account Value: 12967.57
    Buy Price: 10809.85
    Num Shares: 1.0
    Remaining Value: 2157.72
Sell Date: 
2011-08-29 00:00:00
    Sell Price: 11539.25
    Updated Value: 13696.97

-------------------------

Buy Date: 
2011-10-14 00:00:00
Account Value: 13696.97
    Buy Price: 11644.49
    Num Shares: 1.0
    Remaining Value: 2052.48
Sell Date: 
2011-10-28 00:00:00
    Sell Price: 12231.11
    Updated Value: 14283.59

-------------------------

Buy Date: 
2011-11-08 00:00:00
Account Value: 14283.59
    Buy Price: 12170.18
    Num Shares: 1.0
    Remaining Value: 2113.41
Sell Date: 
2012-01-03 00:00:00
    Sell Price: 12397.38
    Updated Value: 14510.79

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 14510.79
    Buy Price: 12720.48
    Num Shares: 1.0
    Remaining Value: 1790.31
Sell Date: 
2012-05-16 00:00:00
    Sell Price: 12598.55
    Updated Value: 14388.86

-------------------------

Buy Date: 
2012-07-24 00:00:00
Account Value: 14388.86
    Buy Price: 12617.32
    Num Shares: 1.0
    Remaining Value: 1771.54
Sell Date: 
2012-11-16 00:00:00
    Sell Price: 12588.31
    Updated Value: 14359.85

-------------------------

Buy Date: 
2013-01-11 00:00:00
Account Value: 14359.85
    Buy Price: 13488.43
    Num Shares: 1.0
    Remaining Value: 871.42
Sell Date: 
2013-07-17 00:00:00
    Sell Price: 15470.52
    Updated Value: 16341.94

-------------------------

Buy Date: 
2013-08-08 00:00:00
Account Value: 16341.94
    Buy Price: 15498.32
    Num Shares: 1.0
    Remaining Value: 843.62
Sell Date: 
2013-09-13 00:00:00
    Sell Price: 15376.06
    Updated Value: 16219.68

-------------------------

Buy Date: 
2013-10-22 00:00:00
Account Value: 16219.68
    Buy Price: 15467.66
    Num Shares: 1.0
    Remaining Value: 752.02
Sell Date: 
2013-11-14 00:00:00
    Sell Price: 15876.22
    Updated Value: 16628.24

-------------------------

Buy Date: 
2013-11-26 00:00:00
Account Value: 16628.24
    Buy Price: 16072.8
    Num Shares: 1.0
    Remaining Value: 555.44
Sell Date: 
2014-02-27 00:00:00
    Sell Price: 16272.65
    Updated Value: 16828.09

-------------------------

Buy Date: 
2014-04-01 00:00:00
Account Value: 16828.09
    Buy Price: 16532.61
    Num Shares: 1.0
    Remaining Value: 295.48
Sell Date: 
2014-05-08 00:00:00
    Sell Price: 16550.97
    Updated Value: 16846.45

-------------------------

Buy Date: 
2014-05-09 00:00:00
Account Value: 16846.45
    Buy Price: 16583.34
    Num Shares: 1.0
    Remaining Value: 263.11
Sell Date: 
2014-08-29 00:00:00
    Sell Price: 17098.45
    Updated Value: 17361.56

-------------------------

Buy Date: 
2014-10-01 00:00:00
Account Value: 17361.56
    Buy Price: 16804.71
    Num Shares: 1.0
    Remaining Value: 556.85
Sell Date: 
2014-10-24 00:00:00
    Sell Price: 16805.41
    Updated Value: 17362.26

-------------------------

Buy Date: 
2014-12-03 00:00:00
Account Value: 17362.26
    Buy Price: 17912.62
    Num Shares: 0.0
    Remaining Value: 17362.26
Sell Date: 
2015-01-27 00:00:00
    Sell Price: 17387.21
    Updated Value: 17362.26

-------------------------

Buy Date: 
2015-02-13 00:00:00
Account Value: 17362.26
    Buy Price: 18019.35
    Num Shares: 0.0
    Remaining Value: 17362.26
Sell Date: 
2015-02-26 00:00:00
    Sell Price: 18214.42
    Updated Value: 17362.26

-------------------------

Buy Date: 
2015-03-12 00:00:00
Account Value: 17362.26
    Buy Price: 17895.22
    Num Shares: 0.0
    Remaining Value: 17362.26
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 17362.26


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 17362.26





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-25 00:00:00
Account Value: 10000
    Buy Price: 11005.37
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-07-26 00:00:00
    Sell Price: 10455.63
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-07 00:00:00
Account Value: 10000.0
    Buy Price: 10049.46
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-03-04 00:00:00
    Sell Price: 10586.82
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-20 00:00:00
Account Value: 10000.0
    Buy Price: 10501.57
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-23 00:00:00
    Sell Price: 10216.08
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-12-04 00:00:00
Account Value: 10000.0
    Buy Price: 8737.85
    Num Shares: 1.0
    Remaining Value: 1262.15
Sell Date: 
2003-02-03 00:00:00
    Sell Price: 8109.82
    Updated Value: 9371.97

-------------------------

Buy Date: 
2003-05-01 00:00:00
Account Value: 9371.97
    Buy Price: 8454.25
    Num Shares: 1.0
    Remaining Value: 917.72
Sell Date: 
2004-04-08 00:00:00
    Sell Price: 10442.03
    Updated Value: 11359.75

-------------------------

Buy Date: 
2004-07-22 00:00:00
Account Value: 11359.75
    Buy Price: 10050.33
    Num Shares: 1.0
    Remaining Value: 1309.42
Sell Date: 
2004-08-19 00:00:00
    Sell Price: 10040.82
    Updated Value: 11350.24

-------------------------

Buy Date: 
2004-10-11 00:00:00
Account Value: 11350.24
    Buy Price: 10081.97
    Num Shares: 1.0
    Remaining Value: 1268.27
Sell Date: 
2004-11-10 00:00:00
    Sell Price: 10385.48
    Updated Value: 11653.75

-------------------------

Buy Date: 
2004-11-22 00:00:00
Account Value: 11653.75
    Buy Price: 10489.42
    Num Shares: 1.0
    Remaining Value: 1164.33
Sell Date: 
2004-11-23 00:00:00
    Sell Price: 10492.6
    Updated Value: 11656.93

-------------------------

Buy Date: 
2004-12-10 00:00:00
Account Value: 11656.93
    Buy Price: 10543.22
    Num Shares: 1.0
    Remaining Value: 1113.71
Sell Date: 
2005-04-26 00:00:00
    Sell Price: 10151.13
    Updated Value: 11264.84

-------------------------

Buy Date: 
2005-06-28 00:00:00
Account Value: 11264.84
    Buy Price: 10405.63
    Num Shares: 1.0
    Remaining Value: 859.21
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 10238.76
    Updated Value: 11097.97

-------------------------

Buy Date: 
2005-12-07 00:00:00
Account Value: 11097.97
    Buy Price: 10810.91
    Num Shares: 1.0
    Remaining Value: 287.06
Sell Date: 
2006-06-28 00:00:00
    Sell Price: 10973.56
    Updated Value: 11260.62

-------------------------

Buy Date: 
2006-08-28 00:00:00
Account Value: 11260.62
    Buy Price: 11352.01
    Num Shares: 0.0
    Remaining Value: 11260.62
Sell Date: 
2007-04-03 00:00:00
    Sell Price: 12510.93
    Updated Value: 11260.62

-------------------------

Buy Date: 
2007-05-08 00:00:00
Account Value: 11260.62
    Buy Price: 13309.07
    Num Shares: 0.0
    Remaining Value: 11260.62
Sell Date: 
2007-09-07 00:00:00
    Sell Price: 13113.38
    Updated Value: 11260.62

-------------------------

Buy Date: 
2007-10-17 00:00:00
Account Value: 11260.62
    Buy Price: 13892.54
    Num Shares: 0.0
    Remaining Value: 11260.62
Sell Date: 
2007-12-07 00:00:00
    Sell Price: 13625.58
    Updated Value: 11260.62

-------------------------

Buy Date: 
2008-05-02 00:00:00
Account Value: 11260.62
    Buy Price: 13058.2
    Num Shares: 0.0
    Remaining Value: 11260.62
Sell Date: 
2008-07-01 00:00:00
    Sell Price: 11382.26
    Updated Value: 11260.62

-------------------------

Buy Date: 
2009-05-06 00:00:00
Account Value: 11260.62
    Buy Price: 8512.28
    Num Shares: 1.0
    Remaining Value: 2748.34
Sell Date: 
2010-03-02 00:00:00
    Sell Price: 10405.98
    Updated Value: 13154.32

-------------------------

Buy Date: 
2010-04-06 00:00:00
Account Value: 13154.32
    Buy Price: 10969.99
    Num Shares: 1.0
    Remaining Value: 2184.33
Sell Date: 
2010-06-14 00:00:00
    Sell Price: 10190.89
    Updated Value: 12375.22

-------------------------

Buy Date: 
2010-08-26 00:00:00
Account Value: 12375.22
    Buy Price: 9985.81
    Num Shares: 1.0
    Remaining Value: 2389.41
Sell Date: 
2011-07-05 00:00:00
    Sell Price: 12569.87
    Updated Value: 14959.28

-------------------------

Buy Date: 
2011-11-11 00:00:00
Account Value: 14959.28
    Buy Price: 12153.68
    Num Shares: 1.0
    Remaining Value: 2805.6
Sell Date: 
2012-05-24 00:00:00
    Sell Price: 12529.75
    Updated Value: 15335.35

-------------------------

Buy Date: 
2012-08-08 00:00:00
Account Value: 15335.35
    Buy Price: 13175.64
    Num Shares: 1.0
    Remaining Value: 2159.71
Sell Date: 
2012-11-27 00:00:00
    Sell Price: 12878.13
    Updated Value: 15037.84

-------------------------

Buy Date: 
2013-01-23 00:00:00
Account Value: 15037.84
    Buy Price: 13779.33
    Num Shares: 1.0
    Remaining Value: 1258.51
Sell Date: 
2013-09-30 00:00:00
    Sell Price: 15129.67
    Updated Value: 16388.18

-------------------------

Buy Date: 
2013-11-01 00:00:00
Account Value: 16388.18
    Buy Price: 15615.55
    Num Shares: 1.0
    Remaining Value: 772.63
Sell Date: 
2014-03-07 00:00:00
    Sell Price: 16452.72
    Updated Value: 17225.35

-------------------------

Buy Date: 
2014-04-07 00:00:00
Account Value: 17225.35
    Buy Price: 16245.87
    Num Shares: 1.0
    Remaining Value: 979.48
Sell Date: 
2014-09-12 00:00:00
    Sell Price: 16987.51
    Updated Value: 17966.99

-------------------------

Buy Date: 
2014-10-02 00:00:00
Account Value: 17966.99
    Buy Price: 16801.05
    Num Shares: 1.0
    Remaining Value: 1165.94
Sell Date: 
2014-11-19 00:00:00
    Sell Price: 17685.73
    Updated Value: 18851.67

-------------------------

Buy Date: 
2014-12-05 00:00:00
Account Value: 18851.67
    Buy Price: 17958.79
    Num Shares: 1.0
    Remaining Value: 892.88
Sell Date: 
2015-02-25 00:00:00
    Sell Price: 18224.57
    Updated Value: 19117.45

-------------------------

Buy Date: 
2015-03-13 00:00:00
Account Value: 19117.45
    Buy Price: 17749.31
    Num Shares: 1.0
    Remaining Value: 1368.14
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19425.79


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19425.79





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-01 00:00:00
Account Value: 10000
    Buy Price: 10990.41
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-14 00:00:00
    Sell Price: 10412.17
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-01-07 00:00:00
Account Value: 10000.0
    Buy Price: 10197.05
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-07 00:00:00
    Sell Price: 9589.67
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-12-13 00:00:00
Account Value: 10000.0
    Buy Price: 8433.71
    Num Shares: 1.0
    Remaining Value: 1566.29
Sell Date: 
2003-03-04 00:00:00
    Sell Price: 7704.87
    Updated Value: 9271.16

-------------------------

Buy Date: 
2003-05-20 00:00:00
Account Value: 9271.16
    Buy Price: 8491.36
    Num Shares: 1.0
    Remaining Value: 779.8
Sell Date: 
2004-05-24 00:00:00
    Sell Price: 9958.43
    Updated Value: 10738.23

-------------------------

Buy Date: 
2004-12-09 00:00:00
Account Value: 10738.23
    Buy Price: 10552.82
    Num Shares: 1.0
    Remaining Value: 185.41
Sell Date: 
2005-04-29 00:00:00
    Sell Price: 10192.51
    Updated Value: 10377.92

-------------------------

Buy Date: 
2005-08-19 00:00:00
Account Value: 10377.92
    Buy Price: 10559.23
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2005-10-25 00:00:00
    Sell Price: 10377.87
    Updated Value: 10377.92

-------------------------

Buy Date: 
2005-12-08 00:00:00
Account Value: 10377.92
    Buy Price: 10755.12
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2006-07-13 00:00:00
    Sell Price: 10846.29
    Updated Value: 10377.92

-------------------------

Buy Date: 
2006-09-13 00:00:00
Account Value: 10377.92
    Buy Price: 11543.32
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2007-04-24 00:00:00
    Sell Price: 12953.94
    Updated Value: 10377.92

-------------------------

Buy Date: 
2007-04-25 00:00:00
Account Value: 10377.92
    Buy Price: 13089.89
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2007-10-04 00:00:00
    Sell Price: 13974.31
    Updated Value: 10377.92

-------------------------

Buy Date: 
2007-10-10 00:00:00
Account Value: 10377.92
    Buy Price: 14078.69
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2007-12-10 00:00:00
    Sell Price: 13727.03
    Updated Value: 10377.92

-------------------------

Buy Date: 
2008-06-02 00:00:00
Account Value: 10377.92
    Buy Price: 12503.82
    Num Shares: 0.0
    Remaining Value: 10377.92
Sell Date: 
2008-07-03 00:00:00
    Sell Price: 11288.53
    Updated Value: 10377.92

-------------------------

Buy Date: 
2009-05-28 00:00:00
Account Value: 10377.92
    Buy Price: 8403.8
    Num Shares: 1.0
    Remaining Value: 1974.12
Sell Date: 
2010-06-22 00:00:00
    Sell Price: 10293.52
    Updated Value: 12267.64

-------------------------

Buy Date: 
2010-10-13 00:00:00
Account Value: 12267.64
    Buy Price: 11096.08
    Num Shares: 1.0
    Remaining Value: 1171.56
Sell Date: 
2011-07-25 00:00:00
    Sell Price: 12592.8
    Updated Value: 13764.36

-------------------------

Buy Date: 
2011-12-07 00:00:00
Account Value: 13764.36
    Buy Price: 12196.37
    Num Shares: 1.0
    Remaining Value: 1567.99
Sell Date: 
2012-06-21 00:00:00
    Sell Price: 12573.57
    Updated Value: 14141.56

-------------------------

Buy Date: 
2012-08-23 00:00:00
Account Value: 14141.56
    Buy Price: 13057.46
    Num Shares: 1.0
    Remaining Value: 1084.1
Sell Date: 
2012-12-17 00:00:00
    Sell Price: 13235.39
    Updated Value: 14319.49

-------------------------

Buy Date: 
2013-01-24 00:00:00
Account Value: 14319.49
    Buy Price: 13825.33
    Num Shares: 1.0
    Remaining Value: 494.16
Sell Date: 
2013-10-09 00:00:00
    Sell Price: 14802.98
    Updated Value: 15297.14

-------------------------

Buy Date: 
2013-10-25 00:00:00
Account Value: 15297.14
    Buy Price: 15570.28
    Num Shares: 0.0
    Remaining Value: 15297.14
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 15297.14


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 15297.14





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-24 00:00:00
Account Value: 10000
    Buy Price: 11122.42
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-29 00:00:00
    Sell Price: 10090.9
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-22 00:00:00
Account Value: 10000.0
    Buy Price: 10427.67
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-10 00:00:00
    Sell Price: 8813.5
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-15 00:00:00
Account Value: 10000.0
    Buy Price: 8713.14
    Num Shares: 1.0
    Remaining Value: 1286.86
Sell Date: 
2004-08-13 00:00:00
    Sell Price: 9825.35
    Updated Value: 11112.21

-------------------------

Buy Date: 
2004-12-14 00:00:00
Account Value: 11112.21
    Buy Price: 10676.45
    Num Shares: 1.0
    Remaining Value: 435.76
Sell Date: 
2005-05-18 00:00:00
    Sell Price: 10464.45
    Updated Value: 10900.21

-------------------------

Buy Date: 
2005-06-28 00:00:00
Account Value: 10900.21
    Buy Price: 10405.63
    Num Shares: 1.0
    Remaining Value: 494.58
Sell Date: 
2005-08-11 00:00:00
    Sell Price: 10685.89
    Updated Value: 11180.47

-------------------------

Buy Date: 
2005-08-29 00:00:00
Account Value: 11180.47
    Buy Price: 10463.05
    Num Shares: 1.0
    Remaining Value: 717.42
Sell Date: 
2005-09-27 00:00:00
    Sell Price: 10456.21
    Updated Value: 11173.63

-------------------------

Buy Date: 
2005-12-07 00:00:00
Account Value: 11173.63
    Buy Price: 10810.91
    Num Shares: 1.0
    Remaining Value: 362.72
Sell Date: 
2007-12-31 00:00:00
    Sell Price: 13264.82
    Updated Value: 13627.54

-------------------------

Buy Date: 
2009-07-10 00:00:00
Account Value: 13627.54
    Buy Price: 8146.52
    Num Shares: 1.0
    Remaining Value: 5481.02
Sell Date: 
2010-07-02 00:00:00
    Sell Price: 9686.48
    Updated Value: 15167.5

-------------------------

Buy Date: 
2010-10-15 00:00:00
Account Value: 15167.5
    Buy Price: 11062.78
    Num Shares: 1.0
    Remaining Value: 4104.72
Sell Date: 
2011-09-02 00:00:00
    Sell Price: 11240.26
    Updated Value: 15344.98

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 15344.98
    Buy Price: 12720.48
    Num Shares: 1.0
    Remaining Value: 2624.5
Sell Date: 
2012-12-31 00:00:00
    Sell Price: 13104.14
    Updated Value: 15728.64

-------------------------

Buy Date: 
2013-01-07 00:00:00
Account Value: 15728.64
    Buy Price: 13384.29
    Num Shares: 1.0
    Remaining Value: 2344.35
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20402.0


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20402.0





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-21 00:00:00
Account Value: 10000
    Buy Price: 11337.92
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-18 00:00:00
    Sell Price: 8903.4
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-04-05 00:00:00
Account Value: 10000.0
    Buy Price: 10271.64
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-17 00:00:00
    Sell Price: 9687.42
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-05 00:00:00
Account Value: 10000.0
    Buy Price: 9041.3
    Num Shares: 1.0
    Remaining Value: 958.7
Sell Date: 
2004-09-02 00:00:00
    Sell Price: 10290.28
    Updated Value: 11248.98

-------------------------

Buy Date: 
2004-12-17 00:00:00
Account Value: 11248.98
    Buy Price: 10649.92
    Num Shares: 1.0
    Remaining Value: 599.06
Sell Date: 
2005-05-25 00:00:00
    Sell Price: 10457.8
    Updated Value: 11056.86

-------------------------

Buy Date: 
2005-06-16 00:00:00
Account Value: 11056.86
    Buy Price: 10578.65
    Num Shares: 1.0
    Remaining Value: 478.21
Sell Date: 
2005-10-13 00:00:00
    Sell Price: 10216.59
    Updated Value: 10694.8

-------------------------

Buy Date: 
2005-12-09 00:00:00
Account Value: 10694.8
    Buy Price: 10778.58
    Num Shares: 0.0
    Remaining Value: 10694.8
Sell Date: 
2008-01-29 00:00:00
    Sell Price: 12480.3
    Updated Value: 10694.8

-------------------------

Buy Date: 
2009-08-25 00:00:00
Account Value: 10694.8
    Buy Price: 9539.29
    Num Shares: 1.0
    Remaining Value: 1155.51
Sell Date: 
2010-08-19 00:00:00
    Sell Price: 10271.21
    Updated Value: 11426.72

-------------------------

Buy Date: 
2010-08-25 00:00:00
Account Value: 11426.72
    Buy Price: 10060.06
    Num Shares: 1.0
    Remaining Value: 1366.66
Sell Date: 
2011-09-13 00:00:00
    Sell Price: 11105.85
    Updated Value: 12472.51

-------------------------

Buy Date: 
2012-01-23 00:00:00
Account Value: 12472.51
    Buy Price: 12708.82
    Num Shares: 0.0
    Remaining Value: 12472.51
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12472.51


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12472.51





-----------------------------------------------------------------------
DJIA Calculations, N = [40, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-18 00:00:00
Account Value: 10000
    Buy Price: 11301.74
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-19 00:00:00
    Sell Price: 8759.13
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-04-09 00:00:00
Account Value: 10000.0
    Buy Price: 10208.67
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-05-29 00:00:00
    Sell Price: 9923.04
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-26 00:00:00
Account Value: 10000.0
    Buy Price: 9079.04
    Num Shares: 1.0
    Remaining Value: 920.96
Sell Date: 
2004-11-11 00:00:00
    Sell Price: 10469.84
    Updated Value: 11390.8

-------------------------

Buy Date: 
2004-11-22 00:00:00
Account Value: 11390.8
    Buy Price: 10489.42
    Num Shares: 1.0
    Remaining Value: 901.38
Sell Date: 
2005-05-31 00:00:00
    Sell Price: 10467.48
    Updated Value: 11368.86

-------------------------

Buy Date: 
2005-06-15 00:00:00
Account Value: 11368.86
    Buy Price: 10566.37
    Num Shares: 1.0
    Remaining Value: 802.49
Sell Date: 
2005-11-07 00:00:00
    Sell Price: 10586.23
    Updated Value: 11388.72

-------------------------

Buy Date: 
2005-12-02 00:00:00
Account Value: 11388.72
    Buy Price: 10877.51
    Num Shares: 1.0
    Remaining Value: 511.21
Sell Date: 
2008-02-07 00:00:00
    Sell Price: 12247.0
    Updated Value: 12758.21

-------------------------

Buy Date: 
2009-09-15 00:00:00
Account Value: 12758.21
    Buy Price: 9683.41
    Num Shares: 1.0
    Remaining Value: 3074.8
Sell Date: 
2011-09-21 00:00:00
    Sell Price: 11124.84
    Updated Value: 14199.64

-------------------------

Buy Date: 
2011-12-05 00:00:00
Account Value: 14199.64
    Buy Price: 12097.83
    Num Shares: 1.0
    Remaining Value: 2101.81
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20159.46


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20159.46





-----------------------------------------------------------------------
DJIA Calculations, N = [50, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-05 00:00:00
Account Value: 10000
    Buy Price: 11175.84
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-01 00:00:00
    Sell Price: 10510.01
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-13 00:00:00
Account Value: 10000.0
    Buy Price: 9766.45
    Num Shares: 1.0
    Remaining Value: 233.55
Sell Date: 
2002-03-19 00:00:00
    Sell Price: 10635.25
    Updated Value: 10868.8

-------------------------

Buy Date: 
2002-04-02 00:00:00
Account Value: 10868.8
    Buy Price: 10313.71
    Num Shares: 1.0
    Remaining Value: 555.09
Sell Date: 
2002-05-30 00:00:00
    Sell Price: 9911.69
    Updated Value: 10466.78

-------------------------

Buy Date: 
2002-12-12 00:00:00
Account Value: 10466.78
    Buy Price: 8538.4
    Num Shares: 1.0
    Remaining Value: 1928.38
Sell Date: 
2003-02-11 00:00:00
    Sell Price: 7843.11
    Updated Value: 9771.49

-------------------------

Buy Date: 
2003-05-06 00:00:00
Account Value: 9771.49
    Buy Price: 8588.36
    Num Shares: 1.0
    Remaining Value: 1183.13
Sell Date: 
2004-04-12 00:00:00
    Sell Price: 10515.56
    Updated Value: 11698.69

-------------------------

Buy Date: 
2004-08-03 00:00:00
Account Value: 11698.69
    Buy Price: 10120.24
    Num Shares: 1.0
    Remaining Value: 1578.45
Sell Date: 
2004-08-31 00:00:00
    Sell Price: 10173.92
    Updated Value: 11752.37

-------------------------

Buy Date: 
2004-10-20 00:00:00
Account Value: 11752.37
    Buy Price: 9886.93
    Num Shares: 1.0
    Remaining Value: 1865.44
Sell Date: 
2004-11-26 00:00:00
    Sell Price: 10522.23
    Updated Value: 12387.67

-------------------------

Buy Date: 
2004-12-20 00:00:00
Account Value: 12387.67
    Buy Price: 10661.6
    Num Shares: 1.0
    Remaining Value: 1726.07
Sell Date: 
2005-03-15 00:00:00
    Sell Price: 10745.1
    Updated Value: 12471.17

-------------------------

Buy Date: 
2005-04-06 00:00:00
Account Value: 12471.17
    Buy Price: 10486.02
    Num Shares: 1.0
    Remaining Value: 1985.15
Sell Date: 
2005-05-03 00:00:00
    Sell Price: 10256.95
    Updated Value: 12242.1

-------------------------

Buy Date: 
2005-07-07 00:00:00
Account Value: 12242.1
    Buy Price: 10302.29
    Num Shares: 1.0
    Remaining Value: 1939.81
Sell Date: 
2005-08-31 00:00:00
    Sell Price: 10481.6
    Updated Value: 12421.41

-------------------------

Buy Date: 
2005-09-07 00:00:00
Account Value: 12421.41
    Buy Price: 10633.5
    Num Shares: 1.0
    Remaining Value: 1787.91
Sell Date: 
2005-10-13 00:00:00
    Sell Price: 10216.59
    Updated Value: 12004.5

-------------------------

Buy Date: 
2005-12-19 00:00:00
Account Value: 12004.5
    Buy Price: 10836.53
    Num Shares: 1.0
    Remaining Value: 1167.97
Sell Date: 
2006-07-13 00:00:00
    Sell Price: 10846.29
    Updated Value: 12014.26

-------------------------

Buy Date: 
2006-08-30 00:00:00
Account Value: 12014.26
    Buy Price: 11382.91
    Num Shares: 1.0
    Remaining Value: 631.35
Sell Date: 
2007-04-13 00:00:00
    Sell Price: 12612.13
    Updated Value: 13243.48

-------------------------

Buy Date: 
2007-05-17 00:00:00
Account Value: 13243.48
    Buy Price: 13476.72
    Num Shares: 0.0
    Remaining Value: 13243.48
Sell Date: 
2007-08-29 00:00:00
    Sell Price: 13289.29
    Updated Value: 13243.48

-------------------------

Buy Date: 
2007-09-06 00:00:00
Account Value: 13243.48
    Buy Price: 13363.35
    Num Shares: 0.0
    Remaining Value: 13243.48
Sell Date: 
2007-09-17 00:00:00
    Sell Price: 13403.42
    Updated Value: 13243.48

-------------------------

Buy Date: 
2007-09-19 00:00:00
Account Value: 13243.48
    Buy Price: 13815.56
    Num Shares: 0.0
    Remaining Value: 13243.48
Sell Date: 
2007-09-21 00:00:00
    Sell Price: 13820.19
    Updated Value: 13243.48

-------------------------

Buy Date: 
2007-10-29 00:00:00
Account Value: 13243.48
    Buy Price: 13870.26
    Num Shares: 0.0
    Remaining Value: 13243.48
Sell Date: 
2007-12-17 00:00:00
    Sell Price: 13167.2
    Updated Value: 13243.48

-------------------------

Buy Date: 
2008-04-30 00:00:00
Account Value: 13243.48
    Buy Price: 12820.13
    Num Shares: 1.0
    Remaining Value: 423.35
Sell Date: 
2008-05-08 00:00:00
    Sell Price: 12866.78
    Updated Value: 13290.13

-------------------------

Buy Date: 
2008-05-15 00:00:00
Account Value: 13290.13
    Buy Price: 12992.66
    Num Shares: 1.0
    Remaining Value: 297.47
Sell Date: 
2008-07-08 00:00:00
    Sell Price: 11384.21
    Updated Value: 11681.68

-------------------------

Buy Date: 
2009-05-15 00:00:00
Account Value: 11681.68
    Buy Price: 8268.64
    Num Shares: 1.0
    Remaining Value: 3413.04
Sell Date: 
2010-03-11 00:00:00
    Sell Price: 10611.84
    Updated Value: 14024.88

-------------------------

Buy Date: 
2010-04-16 00:00:00
Account Value: 14024.88
    Buy Price: 11018.66
    Num Shares: 1.0
    Remaining Value: 3006.22
Sell Date: 
2010-06-21 00:00:00
    Sell Price: 10442.41
    Updated Value: 13448.63

-------------------------

Buy Date: 
2010-08-27 00:00:00
Account Value: 13448.63
    Buy Price: 10150.65
    Num Shares: 1.0
    Remaining Value: 3297.98
Sell Date: 
2011-07-14 00:00:00
    Sell Price: 12437.12
    Updated Value: 15735.1

-------------------------

Buy Date: 
2011-11-14 00:00:00
Account Value: 15735.1
    Buy Price: 12078.98
    Num Shares: 1.0
    Remaining Value: 3656.12
Sell Date: 
2012-06-01 00:00:00
    Sell Price: 12118.57
    Updated Value: 15774.69

-------------------------

Buy Date: 
2012-08-15 00:00:00
Account Value: 15774.69
    Buy Price: 13164.78
    Num Shares: 1.0
    Remaining Value: 2609.91
Sell Date: 
2012-12-05 00:00:00
    Sell Price: 13034.49
    Updated Value: 15644.4

-------------------------

Buy Date: 
2013-01-30 00:00:00
Account Value: 15644.4
    Buy Price: 13910.42
    Num Shares: 1.0
    Remaining Value: 1733.98
Sell Date: 
2013-08-21 00:00:00
    Sell Price: 14897.55
    Updated Value: 16631.53

-------------------------

Buy Date: 
2013-08-22 00:00:00
Account Value: 16631.53
    Buy Price: 14963.74
    Num Shares: 1.0
    Remaining Value: 1667.79
Sell Date: 
2013-08-23 00:00:00
    Sell Price: 15010.51
    Updated Value: 16678.3

-------------------------

Buy Date: 
2013-08-30 00:00:00
Account Value: 16678.3
    Buy Price: 14810.31
    Num Shares: 1.0
    Remaining Value: 1867.99
Sell Date: 
2013-10-09 00:00:00
    Sell Price: 14802.98
    Updated Value: 16670.97

-------------------------

Buy Date: 
2013-11-11 00:00:00
Account Value: 16670.97
    Buy Price: 15783.1
    Num Shares: 1.0
    Remaining Value: 887.87
Sell Date: 
2014-03-20 00:00:00
    Sell Price: 16331.05
    Updated Value: 17218.92

-------------------------

Buy Date: 
2014-04-21 00:00:00
Account Value: 17218.92
    Buy Price: 16449.25
    Num Shares: 1.0
    Remaining Value: 769.67
Sell Date: 
2014-09-25 00:00:00
    Sell Price: 16945.8
    Updated Value: 17715.47

-------------------------

Buy Date: 
2014-10-17 00:00:00
Account Value: 17715.47
    Buy Price: 16380.41
    Num Shares: 1.0
    Remaining Value: 1335.06
Sell Date: 
2014-11-28 00:00:00
    Sell Price: 17828.24
    Updated Value: 19163.3

-------------------------

Buy Date: 
2014-12-15 00:00:00
Account Value: 19163.3
    Buy Price: 17180.84
    Num Shares: 1.0
    Remaining Value: 1982.46
Sell Date: 
2015-02-19 00:00:00
    Sell Price: 17985.77
    Updated Value: 19968.23

-------------------------

Buy Date: 
2015-02-27 00:00:00
Account Value: 19968.23
    Buy Price: 18132.7
    Num Shares: 1.0
    Remaining Value: 1835.53
Sell Date: 
2015-03-11 00:00:00
    Sell Price: 17635.39
    Updated Value: 19470.92

-------------------------

Buy Date: 
2015-03-19 00:00:00
Account Value: 19470.92
    Buy Price: 17959.03
    Num Shares: 1.0
    Remaining Value: 1511.89
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19569.54


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19569.54





-----------------------------------------------------------------------
DJIA Calculations, N = [50, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-13 00:00:00
Account Value: 10000
    Buy Price: 10871.62
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-29 00:00:00
    Sell Price: 10090.9
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-01-15 00:00:00
Account Value: 10000.0
    Buy Price: 9924.15
    Num Shares: 1.0
    Remaining Value: 75.85
Sell Date: 
2002-06-14 00:00:00
    Sell Price: 9474.21
    Updated Value: 9550.06

-------------------------

Buy Date: 
2002-12-23 00:00:00
Account Value: 9550.06
    Buy Price: 8493.29
    Num Shares: 1.0
    Remaining Value: 1056.77
Sell Date: 
2003-03-07 00:00:00
    Sell Price: 7740.03
    Updated Value: 8796.8

-------------------------

Buy Date: 
2003-05-27 00:00:00
Account Value: 8796.8
    Buy Price: 8781.35
    Num Shares: 1.0
    Remaining Value: 15.45
Sell Date: 
2004-05-18 00:00:00
    Sell Price: 9968.51
    Updated Value: 9983.96

-------------------------

Buy Date: 
2004-12-10 00:00:00
Account Value: 9983.96
    Buy Price: 10543.22
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2005-05-04 00:00:00
    Sell Price: 10384.64
    Updated Value: 9983.96

-------------------------

Buy Date: 
2005-08-15 00:00:00
Account Value: 9983.96
    Buy Price: 10634.38
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2005-10-26 00:00:00
    Sell Price: 10344.98
    Updated Value: 9983.96

-------------------------

Buy Date: 
2005-12-19 00:00:00
Account Value: 9983.96
    Buy Price: 10836.53
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2006-07-21 00:00:00
    Sell Price: 10868.38
    Updated Value: 9983.96

-------------------------

Buy Date: 
2006-09-25 00:00:00
Account Value: 9983.96
    Buy Price: 11575.81
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2007-10-11 00:00:00
    Sell Price: 14015.12
    Updated Value: 9983.96

-------------------------

Buy Date: 
2007-10-25 00:00:00
Account Value: 9983.96
    Buy Price: 13671.92
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2007-12-20 00:00:00
    Sell Price: 13245.64
    Updated Value: 9983.96

-------------------------

Buy Date: 
2008-06-09 00:00:00
Account Value: 9983.96
    Buy Price: 12280.32
    Num Shares: 0.0
    Remaining Value: 9983.96
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 10962.54
    Updated Value: 9983.96

-------------------------

Buy Date: 
2009-06-04 00:00:00
Account Value: 9983.96
    Buy Price: 8750.24
    Num Shares: 1.0
    Remaining Value: 1233.72
Sell Date: 
2010-07-02 00:00:00
    Sell Price: 9686.48
    Updated Value: 10920.2

-------------------------

Buy Date: 
2010-10-08 00:00:00
Account Value: 10920.2
    Buy Price: 11006.48
    Num Shares: 0.0
    Remaining Value: 10920.2
Sell Date: 
2011-08-02 00:00:00
    Sell Price: 11866.62
    Updated Value: 10920.2

-------------------------

Buy Date: 
2011-12-16 00:00:00
Account Value: 10920.2
    Buy Price: 11866.39
    Num Shares: 0.0
    Remaining Value: 10920.2
Sell Date: 
2012-06-27 00:00:00
    Sell Price: 12627.01
    Updated Value: 10920.2

-------------------------

Buy Date: 
2012-09-05 00:00:00
Account Value: 10920.2
    Buy Price: 13047.48
    Num Shares: 0.0
    Remaining Value: 10920.2
Sell Date: 
2012-12-27 00:00:00
    Sell Price: 13096.31
    Updated Value: 10920.2

-------------------------

Buy Date: 
2013-02-04 00:00:00
Account Value: 10920.2
    Buy Price: 13880.08
    Num Shares: 0.0
    Remaining Value: 10920.2
Sell Date: 
2013-10-17 00:00:00
    Sell Price: 15371.65
    Updated Value: 10920.2

-------------------------

Buy Date: 
2013-11-07 00:00:00
Account Value: 10920.2
    Buy Price: 15593.98
    Num Shares: 0.0
    Remaining Value: 10920.2
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 10920.2


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 10920.2





-----------------------------------------------------------------------
DJIA Calculations, N = [50, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-05 00:00:00
Account Value: 10000
    Buy Price: 11175.84
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-05 00:00:00
    Sell Price: 10033.27
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-28 00:00:00
Account Value: 10000.0
    Buy Price: 10403.94
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-12 00:00:00
    Sell Price: 8684.53
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-05-27 00:00:00
Account Value: 10000.0
    Buy Price: 8781.35
    Num Shares: 1.0
    Remaining Value: 1218.65
Sell Date: 
2004-08-18 00:00:00
    Sell Price: 10083.15
    Updated Value: 11301.8

-------------------------

Buy Date: 
2004-12-20 00:00:00
Account Value: 11301.8
    Buy Price: 10661.6
    Num Shares: 1.0
    Remaining Value: 640.2
Sell Date: 
2005-05-27 00:00:00
    Sell Price: 10542.55
    Updated Value: 11182.75

-------------------------

Buy Date: 
2005-07-21 00:00:00
Account Value: 11182.75
    Buy Price: 10627.77
    Num Shares: 1.0
    Remaining Value: 554.98
Sell Date: 
2005-08-11 00:00:00
    Sell Price: 10685.89
    Updated Value: 11240.87

-------------------------

Buy Date: 
2005-09-13 00:00:00
Account Value: 11240.87
    Buy Price: 10597.44
    Num Shares: 1.0
    Remaining Value: 643.43
Sell Date: 
2005-10-10 00:00:00
    Sell Price: 10238.76
    Updated Value: 10882.19

-------------------------

Buy Date: 
2005-12-13 00:00:00
Account Value: 10882.19
    Buy Price: 10823.72
    Num Shares: 1.0
    Remaining Value: 58.47
Sell Date: 
2008-01-09 00:00:00
    Sell Price: 12735.31
    Updated Value: 12793.78

-------------------------

Buy Date: 
2009-07-13 00:00:00
Account Value: 12793.78
    Buy Price: 8331.68
    Num Shares: 1.0
    Remaining Value: 4462.1
Sell Date: 
2010-07-14 00:00:00
    Sell Price: 10366.72
    Updated Value: 14828.82

-------------------------

Buy Date: 
2010-10-13 00:00:00
Account Value: 14828.82
    Buy Price: 11096.08
    Num Shares: 1.0
    Remaining Value: 3732.74
Sell Date: 
2010-10-14 00:00:00
    Sell Price: 11096.92
    Updated Value: 14829.66

-------------------------

Buy Date: 
2010-10-21 00:00:00
Account Value: 14829.66
    Buy Price: 11146.57
    Num Shares: 1.0
    Remaining Value: 3683.09
Sell Date: 
2011-09-12 00:00:00
    Sell Price: 11061.12
    Updated Value: 14744.21

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 14744.21
    Buy Price: 12675.75
    Num Shares: 1.0
    Remaining Value: 2068.46
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20126.11


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20126.11





-----------------------------------------------------------------------
DJIA Calculations, N = [50, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-31 00:00:00
Account Value: 10000
    Buy Price: 10911.94
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-19 00:00:00
    Sell Price: 8759.13
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-04-19 00:00:00
Account Value: 10000.0
    Buy Price: 10257.11
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-27 00:00:00
    Sell Price: 9269.92
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-10 00:00:00
Account Value: 10000.0
    Buy Price: 9054.89
    Num Shares: 1.0
    Remaining Value: 945.11
Sell Date: 
2004-09-14 00:00:00
    Sell Price: 10318.16
    Updated Value: 11263.27

-------------------------

Buy Date: 
2004-12-29 00:00:00
Account Value: 11263.27
    Buy Price: 10829.19
    Num Shares: 1.0
    Remaining Value: 434.08
Sell Date: 
2005-06-21 00:00:00
    Sell Price: 10599.67
    Updated Value: 11033.75

-------------------------

Buy Date: 
2005-06-27 00:00:00
Account Value: 11033.75
    Buy Price: 10290.78
    Num Shares: 1.0
    Remaining Value: 742.97
Sell Date: 
2005-10-19 00:00:00
    Sell Price: 10414.13
    Updated Value: 11157.1

-------------------------

Buy Date: 
2005-12-20 00:00:00
Account Value: 11157.1
    Buy Price: 10805.55
    Num Shares: 1.0
    Remaining Value: 351.55
Sell Date: 
2008-01-24 00:00:00
    Sell Price: 12378.61
    Updated Value: 12730.16

-------------------------

Buy Date: 
2009-08-28 00:00:00
Account Value: 12730.16
    Buy Price: 9544.2
    Num Shares: 1.0
    Remaining Value: 3185.96
Sell Date: 
2010-08-27 00:00:00
    Sell Price: 10150.65
    Updated Value: 13336.61

-------------------------

Buy Date: 
2010-09-14 00:00:00
Account Value: 13336.61
    Buy Price: 10526.49
    Num Shares: 1.0
    Remaining Value: 2810.12
Sell Date: 
2011-09-21 00:00:00
    Sell Price: 11124.84
    Updated Value: 13934.96

-------------------------

Buy Date: 
2012-01-27 00:00:00
Account Value: 13934.96
    Buy Price: 12660.46
    Num Shares: 1.0
    Remaining Value: 1274.5
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19332.15


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19332.15





-----------------------------------------------------------------------
DJIA Calculations, N = [50, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-29 00:00:00
Account Value: 10000
    Buy Price: 11039.14
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-20 00:00:00
    Sell Price: 8376.21
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-04-22 00:00:00
Account Value: 10000.0
    Buy Price: 10136.43
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-06 00:00:00
    Sell Price: 9624.64
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-07-02 00:00:00
Account Value: 10000.0
    Buy Price: 9142.84
    Num Shares: 1.0
    Remaining Value: 857.16
Sell Date: 
2008-02-14 00:00:00
    Sell Price: 12376.98
    Updated Value: 13234.14

-------------------------

Buy Date: 
2009-09-23 00:00:00
Account Value: 13234.14
    Buy Price: 9748.55
    Num Shares: 1.0
    Remaining Value: 3485.59
Sell Date: 
2011-10-03 00:00:00
    Sell Price: 10655.3
    Updated Value: 14140.89

-------------------------

Buy Date: 
2011-12-20 00:00:00
Account Value: 14140.89
    Buy Price: 12103.58
    Num Shares: 1.0
    Remaining Value: 2037.31
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20094.96


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20094.96





-----------------------------------------------------------------------
DJIA Calculations, N = [60, 75]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-14 00:00:00
Account Value: 10000
    Buy Price: 10690.13
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-08-09 00:00:00
    Sell Price: 10298.56
    Updated Value: 10000.0

-------------------------

Buy Date: 
2001-12-19 00:00:00
Account Value: 10000.0
    Buy Price: 10070.49
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-04-03 00:00:00
    Sell Price: 10198.29
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-04-17 00:00:00
Account Value: 10000.0
    Buy Price: 10220.78
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-06 00:00:00
    Sell Price: 9624.64
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-10-23 00:00:00
Account Value: 10000.0
    Buy Price: 8494.27
    Num Shares: 1.0
    Remaining Value: 1505.73
Sell Date: 
2002-11-05 00:00:00
    Sell Price: 8678.27
    Updated Value: 10184.0

-------------------------

Buy Date: 
2002-12-20 00:00:00
Account Value: 10184.0
    Buy Price: 8511.32
    Num Shares: 1.0
    Remaining Value: 1672.68
Sell Date: 
2003-02-20 00:00:00
    Sell Price: 7914.96
    Updated Value: 9587.64

-------------------------

Buy Date: 
2003-05-09 00:00:00
Account Value: 9587.64
    Buy Price: 8604.6
    Num Shares: 1.0
    Remaining Value: 983.04
Sell Date: 
2004-04-16 00:00:00
    Sell Price: 10451.97
    Updated Value: 11435.01

-------------------------

Buy Date: 
2004-06-21 00:00:00
Account Value: 11435.01
    Buy Price: 10371.47
    Num Shares: 1.0
    Remaining Value: 1063.54
Sell Date: 
2004-07-06 00:00:00
    Sell Price: 10219.34
    Updated Value: 11282.88

-------------------------

Buy Date: 
2004-08-12 00:00:00
Account Value: 11282.88
    Buy Price: 9814.59
    Num Shares: 1.0
    Remaining Value: 1468.29
Sell Date: 
2004-09-08 00:00:00
    Sell Price: 10313.36
    Updated Value: 11781.65

-------------------------

Buy Date: 
2004-11-01 00:00:00
Account Value: 11781.65
    Buy Price: 10054.39
    Num Shares: 1.0
    Remaining Value: 1727.26
Sell Date: 
2004-12-03 00:00:00
    Sell Price: 10592.21
    Updated Value: 12319.47

-------------------------

Buy Date: 
2004-12-22 00:00:00
Account Value: 12319.47
    Buy Price: 10815.89
    Num Shares: 1.0
    Remaining Value: 1503.58
Sell Date: 
2005-03-24 00:00:00
    Sell Price: 10442.87
    Updated Value: 11946.45

-------------------------

Buy Date: 
2005-04-18 00:00:00
Account Value: 11946.45
    Buy Price: 10071.25
    Num Shares: 1.0
    Remaining Value: 1875.2
Sell Date: 
2005-05-11 00:00:00
    Sell Price: 10300.25
    Updated Value: 12175.45

-------------------------

Buy Date: 
2005-07-15 00:00:00
Account Value: 12175.45
    Buy Price: 10640.83
    Num Shares: 1.0
    Remaining Value: 1534.62
Sell Date: 
2005-09-13 00:00:00
    Sell Price: 10597.44
    Updated Value: 12132.06

-------------------------

Buy Date: 
2005-09-20 00:00:00
Account Value: 12132.06
    Buy Price: 10481.52
    Num Shares: 1.0
    Remaining Value: 1650.54
Sell Date: 
2005-10-19 00:00:00
    Sell Price: 10414.13
    Updated Value: 12064.67

-------------------------

Buy Date: 
2005-12-28 00:00:00
Account Value: 12064.67
    Buy Price: 10796.26
    Num Shares: 1.0
    Remaining Value: 1268.41
Sell Date: 
2006-07-21 00:00:00
    Sell Price: 10868.38
    Updated Value: 12136.79

-------------------------

Buy Date: 
2006-09-07 00:00:00
Account Value: 12136.79
    Buy Price: 11331.44
    Num Shares: 1.0
    Remaining Value: 805.35
Sell Date: 
2007-04-20 00:00:00
    Sell Price: 12961.98
    Updated Value: 13767.33

-------------------------

Buy Date: 
2007-04-24 00:00:00
Account Value: 13767.33
    Buy Price: 12953.94
    Num Shares: 1.0
    Remaining Value: 813.39
Sell Date: 
2007-04-25 00:00:00
    Sell Price: 13089.89
    Updated Value: 13903.28

-------------------------

Buy Date: 
2007-05-29 00:00:00
Account Value: 13903.28
    Buy Price: 13521.34
    Num Shares: 1.0
    Remaining Value: 381.94
Sell Date: 
2007-08-28 00:00:00
    Sell Price: 13041.85
    Updated Value: 13423.79

-------------------------

Buy Date: 
2007-09-19 00:00:00
Account Value: 13423.79
    Buy Price: 13815.56
    Num Shares: 0.0
    Remaining Value: 13423.79
Sell Date: 
2007-10-05 00:00:00
    Sell Price: 14066.01
    Updated Value: 13423.79

-------------------------

Buy Date: 
2007-11-05 00:00:00
Account Value: 13423.79
    Buy Price: 13543.4
    Num Shares: 0.0
    Remaining Value: 13423.79
Sell Date: 
2007-12-26 00:00:00
    Sell Price: 13551.69
    Updated Value: 13423.79

-------------------------

Buy Date: 
2008-05-01 00:00:00
Account Value: 13423.79
    Buy Price: 13010.0
    Num Shares: 1.0
    Remaining Value: 413.79
Sell Date: 
2008-07-15 00:00:00
    Sell Price: 10962.54
    Updated Value: 11376.33

-------------------------

Buy Date: 
2008-10-08 00:00:00
Account Value: 11376.33
    Buy Price: 9258.1
    Num Shares: 1.0
    Remaining Value: 2118.23
Sell Date: 
2008-10-15 00:00:00
    Sell Price: 8577.91
    Updated Value: 10696.14

-------------------------

Buy Date: 
2009-02-27 00:00:00
Account Value: 10696.14
    Buy Price: 7062.93
    Num Shares: 1.0
    Remaining Value: 3633.21
Sell Date: 
2009-03-05 00:00:00
    Sell Price: 6594.44
    Updated Value: 10227.65

-------------------------

Buy Date: 
2009-05-27 00:00:00
Account Value: 10227.65
    Buy Price: 8300.02
    Num Shares: 1.0
    Remaining Value: 1927.63
Sell Date: 
2010-03-29 00:00:00
    Sell Price: 10895.86
    Updated Value: 12823.49

-------------------------

Buy Date: 
2010-04-27 00:00:00
Account Value: 12823.49
    Buy Price: 10991.99
    Num Shares: 1.0
    Remaining Value: 1831.5
Sell Date: 
2010-06-25 00:00:00
    Sell Price: 10143.81
    Updated Value: 11975.31

-------------------------

Buy Date: 
2010-08-31 00:00:00
Account Value: 11975.31
    Buy Price: 10014.72
    Num Shares: 1.0
    Remaining Value: 1960.59
Sell Date: 
2010-11-04 00:00:00
    Sell Price: 11434.84
    Updated Value: 13395.43

-------------------------

Buy Date: 
2010-11-05 00:00:00
Account Value: 13395.43
    Buy Price: 11444.08
    Num Shares: 1.0
    Remaining Value: 1951.35
Sell Date: 
2011-07-26 00:00:00
    Sell Price: 12501.3
    Updated Value: 14452.65

-------------------------

Buy Date: 
2011-11-15 00:00:00
Account Value: 14452.65
    Buy Price: 12096.16
    Num Shares: 1.0
    Remaining Value: 2356.49
Sell Date: 
2012-06-11 00:00:00
    Sell Price: 12411.23
    Updated Value: 14767.72

-------------------------

Buy Date: 
2012-08-21 00:00:00
Account Value: 14767.72
    Buy Price: 13203.58
    Num Shares: 1.0
    Remaining Value: 1564.14
Sell Date: 
2012-12-17 00:00:00
    Sell Price: 13235.39
    Updated Value: 14799.53

-------------------------

Buy Date: 
2013-02-07 00:00:00
Account Value: 14799.53
    Buy Price: 13944.05
    Num Shares: 1.0
    Remaining Value: 855.48
Sell Date: 
2013-08-21 00:00:00
    Sell Price: 14897.55
    Updated Value: 15753.03

-------------------------

Buy Date: 
2013-09-10 00:00:00
Account Value: 15753.03
    Buy Price: 15191.06
    Num Shares: 1.0
    Remaining Value: 561.97
Sell Date: 
2013-10-15 00:00:00
    Sell Price: 15168.01
    Updated Value: 15729.98

-------------------------

Buy Date: 
2013-11-19 00:00:00
Account Value: 15729.98
    Buy Price: 15967.03
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2014-04-01 00:00:00
    Sell Price: 16532.61
    Updated Value: 15729.98

-------------------------

Buy Date: 
2014-04-30 00:00:00
Account Value: 15729.98
    Buy Price: 16580.84
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2014-10-06 00:00:00
    Sell Price: 16991.91
    Updated Value: 15729.98

-------------------------

Buy Date: 
2014-10-30 00:00:00
Account Value: 15729.98
    Buy Price: 17195.42
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2014-12-03 00:00:00
    Sell Price: 17912.62
    Updated Value: 15729.98

-------------------------

Buy Date: 
2014-12-08 00:00:00
Account Value: 15729.98
    Buy Price: 17852.48
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2014-12-12 00:00:00
    Sell Price: 17280.83
    Updated Value: 15729.98

-------------------------

Buy Date: 
2014-12-23 00:00:00
Account Value: 15729.98
    Buy Price: 18024.17
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2015-03-02 00:00:00
    Sell Price: 18288.63
    Updated Value: 15729.98

-------------------------

Buy Date: 
2015-03-13 00:00:00
Account Value: 15729.98
    Buy Price: 17749.31
    Num Shares: 0.0
    Remaining Value: 15729.98
Sell Date: 
2015-04-07 00:00:00
    Sell Price: 17875.42
    Updated Value: 15729.98


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 15729.98





-----------------------------------------------------------------------
DJIA Calculations, N = [60, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-25 00:00:00
Account Value: 10000
    Buy Price: 10504.22
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-10 00:00:00
    Sell Price: 9605.51
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-01-25 00:00:00
Account Value: 10000.0
    Buy Price: 9840.08
    Num Shares: 1.0
    Remaining Value: 159.92
Sell Date: 
2002-06-21 00:00:00
    Sell Price: 9253.79
    Updated Value: 9413.71

-------------------------

Buy Date: 
2003-01-03 00:00:00
Account Value: 9413.71
    Buy Price: 8601.69
    Num Shares: 1.0
    Remaining Value: 812.02
Sell Date: 
2003-03-18 00:00:00
    Sell Price: 8194.23
    Updated Value: 9006.25

-------------------------

Buy Date: 
2003-06-04 00:00:00
Account Value: 9006.25
    Buy Price: 9038.98
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2004-05-24 00:00:00
    Sell Price: 9958.43
    Updated Value: 9006.25

-------------------------

Buy Date: 
2004-12-14 00:00:00
Account Value: 9006.25
    Buy Price: 10676.45
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2005-05-11 00:00:00
    Sell Price: 10300.25
    Updated Value: 9006.25

-------------------------

Buy Date: 
2005-08-15 00:00:00
Account Value: 9006.25
    Buy Price: 10634.38
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2005-11-03 00:00:00
    Sell Price: 10522.59
    Updated Value: 9006.25

-------------------------

Buy Date: 
2006-01-03 00:00:00
Account Value: 9006.25
    Buy Price: 10847.41
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2006-08-02 00:00:00
    Sell Price: 11199.92
    Updated Value: 9006.25

-------------------------

Buy Date: 
2006-10-02 00:00:00
Account Value: 9006.25
    Buy Price: 11670.35
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2007-10-16 00:00:00
    Sell Price: 13912.94
    Updated Value: 9006.25

-------------------------

Buy Date: 
2007-11-08 00:00:00
Account Value: 9006.25
    Buy Price: 13266.29
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2008-01-04 00:00:00
    Sell Price: 12800.18
    Updated Value: 9006.25

-------------------------

Buy Date: 
2008-06-13 00:00:00
Account Value: 9006.25
    Buy Price: 12307.35
    Num Shares: 0.0
    Remaining Value: 9006.25
Sell Date: 
2008-07-22 00:00:00
    Sell Price: 11602.5
    Updated Value: 9006.25

-------------------------

Buy Date: 
2009-06-12 00:00:00
Account Value: 9006.25
    Buy Price: 8799.26
    Num Shares: 1.0
    Remaining Value: 206.99
Sell Date: 
2010-07-15 00:00:00
    Sell Price: 10359.31
    Updated Value: 10566.3

-------------------------

Buy Date: 
2010-10-12 00:00:00
Account Value: 10566.3
    Buy Price: 11020.4
    Num Shares: 0.0
    Remaining Value: 10566.3
Sell Date: 
2011-08-09 00:00:00
    Sell Price: 11239.77
    Updated Value: 10566.3

-------------------------

Buy Date: 
2011-12-28 00:00:00
Account Value: 10566.3
    Buy Price: 12151.41
    Num Shares: 0.0
    Remaining Value: 10566.3
Sell Date: 
2012-06-29 00:00:00
    Sell Price: 12880.09
    Updated Value: 10566.3

-------------------------

Buy Date: 
2012-09-12 00:00:00
Account Value: 10566.3
    Buy Price: 13333.35
    Num Shares: 0.0
    Remaining Value: 10566.3
Sell Date: 
2013-01-08 00:00:00
    Sell Price: 13328.85
    Updated Value: 10566.3

-------------------------

Buy Date: 
2013-02-14 00:00:00
Account Value: 10566.3
    Buy Price: 13973.39
    Num Shares: 0.0
    Remaining Value: 10566.3
Sell Date: 
2013-10-29 00:00:00
    Sell Price: 15680.35
    Updated Value: 10566.3

-------------------------

Buy Date: 
2013-11-18 00:00:00
Account Value: 10566.3
    Buy Price: 15976.02
    Num Shares: 0.0
    Remaining Value: 10566.3
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 10566.3


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 10566.3





-----------------------------------------------------------------------
DJIA Calculations, N = [60, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-06-14 00:00:00
Account Value: 10000
    Buy Price: 10690.13
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-17 00:00:00
    Sell Price: 8920.7
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-03-25 00:00:00
Account Value: 10000.0
    Buy Price: 10281.67
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-16 00:00:00
    Sell Price: 8473.11
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-05 00:00:00
Account Value: 10000.0
    Buy Price: 9041.3
    Num Shares: 1.0
    Remaining Value: 958.7
Sell Date: 
2004-07-30 00:00:00
    Sell Price: 10139.71
    Updated Value: 11098.41

-------------------------

Buy Date: 
2004-12-22 00:00:00
Account Value: 11098.41
    Buy Price: 10815.89
    Num Shares: 1.0
    Remaining Value: 282.52
Sell Date: 
2005-06-09 00:00:00
    Sell Price: 10503.02
    Updated Value: 10785.54

-------------------------

Buy Date: 
2005-09-28 00:00:00
Account Value: 10785.54
    Buy Price: 10473.08
    Num Shares: 1.0
    Remaining Value: 312.46
Sell Date: 
2005-10-21 00:00:00
    Sell Price: 10215.22
    Updated Value: 10527.68

-------------------------

Buy Date: 
2005-12-13 00:00:00
Account Value: 10527.68
    Buy Price: 10823.72
    Num Shares: 0.0
    Remaining Value: 10527.68
Sell Date: 
2008-01-15 00:00:00
    Sell Price: 12501.11
    Updated Value: 10527.68

-------------------------

Buy Date: 
2009-07-17 00:00:00
Account Value: 10527.68
    Buy Price: 8743.94
    Num Shares: 1.0
    Remaining Value: 1783.74
Sell Date: 
2010-07-23 00:00:00
    Sell Price: 10424.62
    Updated Value: 12208.36

-------------------------

Buy Date: 
2010-10-14 00:00:00
Account Value: 12208.36
    Buy Price: 11096.92
    Num Shares: 1.0
    Remaining Value: 1111.44
Sell Date: 
2011-09-13 00:00:00
    Sell Price: 11105.85
    Updated Value: 12217.29

-------------------------

Buy Date: 
2012-01-24 00:00:00
Account Value: 12217.29
    Buy Price: 12675.75
    Num Shares: 0.0
    Remaining Value: 12217.29
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12217.29


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12217.29





-----------------------------------------------------------------------
DJIA Calculations, N = [60, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-05-17 00:00:00
Account Value: 10000
    Buy Price: 11248.58
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-21 00:00:00
    Sell Price: 8235.81
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-05-02 00:00:00
Account Value: 10000.0
    Buy Price: 10091.87
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-08 00:00:00
    Sell Price: 9274.9
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-13 00:00:00
Account Value: 10000.0
    Buy Price: 9117.12
    Num Shares: 1.0
    Remaining Value: 882.88
Sell Date: 
2004-09-23 00:00:00
    Sell Price: 10038.9
    Updated Value: 10921.78

-------------------------

Buy Date: 
2005-01-06 00:00:00
Account Value: 10921.78
    Buy Price: 10622.88
    Num Shares: 1.0
    Remaining Value: 298.9
Sell Date: 
2005-07-08 00:00:00
    Sell Price: 10449.14
    Updated Value: 10748.04

-------------------------

Buy Date: 
2005-07-11 00:00:00
Account Value: 10748.04
    Buy Price: 10519.72
    Num Shares: 1.0
    Remaining Value: 228.32
Sell Date: 
2005-10-24 00:00:00
    Sell Price: 10385.0
    Updated Value: 10613.32

-------------------------

Buy Date: 
2005-12-23 00:00:00
Account Value: 10613.32
    Buy Price: 10883.27
    Num Shares: 0.0
    Remaining Value: 10613.32
Sell Date: 
2008-01-30 00:00:00
    Sell Price: 12442.83
    Updated Value: 10613.32

-------------------------

Buy Date: 
2009-08-28 00:00:00
Account Value: 10613.32
    Buy Price: 9544.2
    Num Shares: 1.0
    Remaining Value: 1069.12
Sell Date: 
2010-08-13 00:00:00
    Sell Price: 10303.15
    Updated Value: 11372.27

-------------------------

Buy Date: 
2010-09-28 00:00:00
Account Value: 11372.27
    Buy Price: 10858.14
    Num Shares: 1.0
    Remaining Value: 514.13
Sell Date: 
2011-09-29 00:00:00
    Sell Price: 11153.98
    Updated Value: 11668.11

-------------------------

Buy Date: 
2012-01-30 00:00:00
Account Value: 11668.11
    Buy Price: 12653.72
    Num Shares: 0.0
    Remaining Value: 11668.11
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11668.11


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11668.11





-----------------------------------------------------------------------
DJIA Calculations, N = [60, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-05-02 00:00:00
Account Value: 10000
    Buy Price: 10091.87
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-13 00:00:00
    Sell Price: 9502.8
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-07-10 00:00:00
Account Value: 10000.0
    Buy Price: 9036.04
    Num Shares: 1.0
    Remaining Value: 963.96
Sell Date: 
2008-02-14 00:00:00
    Sell Price: 12376.98
    Updated Value: 13340.94

-------------------------

Buy Date: 
2009-10-01 00:00:00
Account Value: 13340.94
    Buy Price: 9509.28
    Num Shares: 1.0
    Remaining Value: 3831.66
Sell Date: 
2011-10-13 00:00:00
    Sell Price: 11478.13
    Updated Value: 15309.79

-------------------------

Buy Date: 
2012-01-05 00:00:00
Account Value: 15309.79
    Buy Price: 12415.7
    Num Shares: 1.0
    Remaining Value: 2894.09
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20951.74


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20951.74





-----------------------------------------------------------------------
DJIA Calculations, N = [80, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-07-20 00:00:00
Account Value: 10000
    Buy Price: 10576.65
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-09-26 00:00:00
    Sell Price: 8567.39
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-02-07 00:00:00
Account Value: 10000.0
    Buy Price: 9625.44
    Num Shares: 1.0
    Remaining Value: 374.56
Sell Date: 
2002-07-12 00:00:00
    Sell Price: 8684.53
    Updated Value: 9059.09

-------------------------

Buy Date: 
2003-01-31 00:00:00
Account Value: 9059.09
    Buy Price: 8053.81
    Num Shares: 1.0
    Remaining Value: 1005.28
Sell Date: 
2003-04-01 00:00:00
    Sell Price: 8069.86
    Updated Value: 9075.14

-------------------------

Buy Date: 
2003-06-20 00:00:00
Account Value: 9075.14
    Buy Price: 9200.75
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2004-06-07 00:00:00
    Sell Price: 10391.08
    Updated Value: 9075.14

-------------------------

Buy Date: 
2004-12-09 00:00:00
Account Value: 9075.14
    Buy Price: 10552.82
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2005-05-05 00:00:00
    Sell Price: 10340.38
    Updated Value: 9075.14

-------------------------

Buy Date: 
2005-08-30 00:00:00
Account Value: 9075.14
    Buy Price: 10412.82
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2005-11-23 00:00:00
    Sell Price: 10916.09
    Updated Value: 9075.14

-------------------------

Buy Date: 
2005-12-20 00:00:00
Account Value: 9075.14
    Buy Price: 10805.55
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2005-12-21 00:00:00
    Sell Price: 10833.73
    Updated Value: 9075.14

-------------------------

Buy Date: 
2005-12-27 00:00:00
Account Value: 9075.14
    Buy Price: 10777.77
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2005-12-28 00:00:00
    Sell Price: 10796.26
    Updated Value: 9075.14

-------------------------

Buy Date: 
2006-01-19 00:00:00
Account Value: 9075.14
    Buy Price: 10880.71
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2006-08-23 00:00:00
    Sell Price: 11297.9
    Updated Value: 9075.14

-------------------------

Buy Date: 
2006-10-16 00:00:00
Account Value: 9075.14
    Buy Price: 11980.59
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2007-11-07 00:00:00
    Sell Price: 13300.02
    Updated Value: 9075.14

-------------------------

Buy Date: 
2007-12-11 00:00:00
Account Value: 9075.14
    Buy Price: 13432.77
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2008-01-31 00:00:00
    Sell Price: 12650.36
    Updated Value: 9075.14

-------------------------

Buy Date: 
2008-07-01 00:00:00
Account Value: 9075.14
    Buy Price: 11382.26
    Num Shares: 0.0
    Remaining Value: 9075.14
Sell Date: 
2008-08-08 00:00:00
    Sell Price: 11734.32
    Updated Value: 9075.14

-------------------------

Buy Date: 
2009-07-01 00:00:00
Account Value: 9075.14
    Buy Price: 8504.06
    Num Shares: 1.0
    Remaining Value: 571.08
Sell Date: 
2010-08-05 00:00:00
    Sell Price: 10674.98
    Updated Value: 11246.06

-------------------------

Buy Date: 
2010-10-22 00:00:00
Account Value: 11246.06
    Buy Price: 11132.56
    Num Shares: 1.0
    Remaining Value: 113.5
Sell Date: 
2011-08-26 00:00:00
    Sell Price: 11284.54
    Updated Value: 11398.04

-------------------------

Buy Date: 
2012-01-12 00:00:00
Account Value: 11398.04
    Buy Price: 12471.02
    Num Shares: 0.0
    Remaining Value: 11398.04
Sell Date: 
2012-07-16 00:00:00
    Sell Price: 12727.21
    Updated Value: 11398.04

-------------------------

Buy Date: 
2012-09-27 00:00:00
Account Value: 11398.04
    Buy Price: 13485.97
    Num Shares: 0.0
    Remaining Value: 11398.04
Sell Date: 
2013-01-28 00:00:00
    Sell Price: 13881.93
    Updated Value: 11398.04

-------------------------

Buy Date: 
2013-03-13 00:00:00
Account Value: 11398.04
    Buy Price: 14455.28
    Num Shares: 0.0
    Remaining Value: 11398.04
Sell Date: 
2014-05-16 00:00:00
    Sell Price: 16491.31
    Updated Value: 11398.04

-------------------------

Buy Date: 
2014-05-21 00:00:00
Account Value: 11398.04
    Buy Price: 16533.06
    Num Shares: 0.0
    Remaining Value: 11398.04
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 11398.04


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 11398.04





-----------------------------------------------------------------------
DJIA Calculations, N = [80, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-03-27 00:00:00
Account Value: 10000
    Buy Price: 10426.91
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-24 00:00:00
    Sell Price: 8191.29
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-20 00:00:00
Account Value: 10000.0
    Buy Price: 9200.75
    Num Shares: 1.0
    Remaining Value: 799.25
Sell Date: 
2004-08-12 00:00:00
    Sell Price: 9814.59
    Updated Value: 10613.84

-------------------------

Buy Date: 
2004-12-21 00:00:00
Account Value: 10613.84
    Buy Price: 10759.43
    Num Shares: 0.0
    Remaining Value: 10613.84
Sell Date: 
2005-07-06 00:00:00
    Sell Price: 10270.68
    Updated Value: 10613.84

-------------------------

Buy Date: 
2005-10-25 00:00:00
Account Value: 10613.84
    Buy Price: 10377.87
    Num Shares: 1.0
    Remaining Value: 235.97
Sell Date: 
2005-11-11 00:00:00
    Sell Price: 10686.04
    Updated Value: 10922.01

-------------------------

Buy Date: 
2005-11-30 00:00:00
Account Value: 10922.01
    Buy Price: 10805.87
    Num Shares: 1.0
    Remaining Value: 116.14
Sell Date: 
2008-01-30 00:00:00
    Sell Price: 12442.83
    Updated Value: 12558.97

-------------------------

Buy Date: 
2009-07-27 00:00:00
Account Value: 12558.97
    Buy Price: 9108.51
    Num Shares: 1.0
    Remaining Value: 3450.46
Sell Date: 
2010-08-16 00:00:00
    Sell Price: 10302.01
    Updated Value: 13752.47

-------------------------

Buy Date: 
2010-10-28 00:00:00
Account Value: 13752.47
    Buy Price: 11113.95
    Num Shares: 1.0
    Remaining Value: 2638.52
Sell Date: 
2011-09-16 00:00:00
    Sell Price: 11509.09
    Updated Value: 14147.61

-------------------------

Buy Date: 
2012-02-07 00:00:00
Account Value: 14147.61
    Buy Price: 12878.2
    Num Shares: 1.0
    Remaining Value: 1269.41
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 19327.06


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 19327.06





-----------------------------------------------------------------------
DJIA Calculations, N = [80, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-05-20 00:00:00
Account Value: 10000
    Buy Price: 10229.5
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-07-23 00:00:00
    Sell Price: 7702.34
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-06-30 00:00:00
Account Value: 10000.0
    Buy Price: 8985.44
    Num Shares: 1.0
    Remaining Value: 1014.56
Sell Date: 
2004-10-08 00:00:00
    Sell Price: 10055.2
    Updated Value: 11069.76

-------------------------

Buy Date: 
2005-01-20 00:00:00
Account Value: 11069.76
    Buy Price: 10471.47
    Num Shares: 1.0
    Remaining Value: 598.29
Sell Date: 
2005-10-20 00:00:00
    Sell Price: 10281.1
    Updated Value: 10879.39

-------------------------

Buy Date: 
2005-12-22 00:00:00
Account Value: 10879.39
    Buy Price: 10889.44
    Num Shares: 0.0
    Remaining Value: 10879.39
Sell Date: 
2008-02-19 00:00:00
    Sell Price: 12337.22
    Updated Value: 10879.39

-------------------------

Buy Date: 
2009-09-03 00:00:00
Account Value: 10879.39
    Buy Price: 9344.61
    Num Shares: 1.0
    Remaining Value: 1534.78
Sell Date: 
2010-09-01 00:00:00
    Sell Price: 10269.47
    Updated Value: 11804.25

-------------------------

Buy Date: 
2010-10-25 00:00:00
Account Value: 11804.25
    Buy Price: 11164.05
    Num Shares: 1.0
    Remaining Value: 640.2
Sell Date: 
2011-10-12 00:00:00
    Sell Price: 11518.85
    Updated Value: 12159.05

-------------------------

Buy Date: 
2012-02-10 00:00:00
Account Value: 12159.05
    Buy Price: 12801.23
    Num Shares: 0.0
    Remaining Value: 12159.05
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12159.05


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12159.05





-----------------------------------------------------------------------
DJIA Calculations, N = [80, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-05-23 00:00:00
Account Value: 10000
    Buy Price: 10216.08
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-06-27 00:00:00
    Sell Price: 9269.92
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-07-23 00:00:00
Account Value: 10000.0
    Buy Price: 9194.24
    Num Shares: 1.0
    Remaining Value: 805.76
Sell Date: 
2004-11-09 00:00:00
    Sell Price: 10386.37
    Updated Value: 11192.13

-------------------------

Buy Date: 
2004-11-16 00:00:00
Account Value: 11192.13
    Buy Price: 10487.65
    Num Shares: 1.0
    Remaining Value: 704.48
Sell Date: 
2004-11-18 00:00:00
    Sell Price: 10572.55
    Updated Value: 11277.03

-------------------------

Buy Date: 
2004-12-01 00:00:00
Account Value: 11277.03
    Buy Price: 10590.22
    Num Shares: 1.0
    Remaining Value: 686.81
Sell Date: 
2008-02-28 00:00:00
    Sell Price: 12582.18
    Updated Value: 13268.99

-------------------------

Buy Date: 
2009-10-14 00:00:00
Account Value: 13268.99
    Buy Price: 10015.86
    Num Shares: 1.0
    Remaining Value: 3253.13
Sell Date: 
2011-11-02 00:00:00
    Sell Price: 11836.04
    Updated Value: 15089.17

-------------------------

Buy Date: 
2012-02-01 00:00:00
Account Value: 15089.17
    Buy Price: 12716.46
    Num Shares: 1.0
    Remaining Value: 2372.71
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 20430.36


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 20430.36





-----------------------------------------------------------------------
DJIA Calculations, N = [100, 125]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2001-08-13 00:00:00
Account Value: 10000
    Buy Price: 10415.91
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2001-10-09 00:00:00
    Sell Price: 9052.44
    Updated Value: 10000.0

-------------------------

Buy Date: 
2002-02-22 00:00:00
Account Value: 10000.0
    Buy Price: 9968.15
    Num Shares: 1.0
    Remaining Value: 31.85
Sell Date: 
2002-07-30 00:00:00
    Sell Price: 8680.03
    Updated Value: 8711.88

-------------------------

Buy Date: 
2003-02-24 00:00:00
Account Value: 8711.88
    Buy Price: 7858.24
    Num Shares: 1.0
    Remaining Value: 853.64
Sell Date: 
2003-04-11 00:00:00
    Sell Price: 8203.41
    Updated Value: 9057.05

-------------------------

Buy Date: 
2003-07-09 00:00:00
Account Value: 9057.05
    Buy Price: 9156.21
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2004-06-16 00:00:00
    Sell Price: 10379.58
    Updated Value: 9057.05

-------------------------

Buy Date: 
2004-10-15 00:00:00
Account Value: 9057.05
    Buy Price: 9933.38
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2004-11-08 00:00:00
    Sell Price: 10391.31
    Updated Value: 9057.05

-------------------------

Buy Date: 
2004-12-27 00:00:00
Account Value: 9057.05
    Buy Price: 10776.13
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2005-05-19 00:00:00
    Sell Price: 10493.19
    Updated Value: 9057.05

-------------------------

Buy Date: 
2005-09-12 00:00:00
Account Value: 9057.05
    Buy Price: 10682.94
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2005-11-10 00:00:00
    Sell Price: 10640.1
    Updated Value: 9057.05

-------------------------

Buy Date: 
2005-11-16 00:00:00
Account Value: 9057.05
    Buy Price: 10674.76
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2005-12-27 00:00:00
    Sell Price: 10777.77
    Updated Value: 9057.05

-------------------------

Buy Date: 
2006-01-25 00:00:00
Account Value: 9057.05
    Buy Price: 10709.74
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2006-09-12 00:00:00
    Sell Price: 11498.09
    Updated Value: 9057.05

-------------------------

Buy Date: 
2006-11-01 00:00:00
Account Value: 9057.05
    Buy Price: 12031.02
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2007-12-04 00:00:00
    Sell Price: 13248.73
    Updated Value: 9057.05

-------------------------

Buy Date: 
2008-01-10 00:00:00
Account Value: 9057.05
    Buy Price: 12853.09
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2008-02-20 00:00:00
    Sell Price: 12427.26
    Updated Value: 9057.05

-------------------------

Buy Date: 
2008-07-09 00:00:00
Account Value: 9057.05
    Buy Price: 11147.44
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2008-07-18 00:00:00
    Sell Price: 11496.57
    Updated Value: 9057.05

-------------------------

Buy Date: 
2008-07-31 00:00:00
Account Value: 9057.05
    Buy Price: 11378.02
    Num Shares: 0.0
    Remaining Value: 9057.05
Sell Date: 
2008-08-28 00:00:00
    Sell Price: 11715.18
    Updated Value: 9057.05

-------------------------

Buy Date: 
2009-07-21 00:00:00
Account Value: 9057.05
    Buy Price: 8915.94
    Num Shares: 1.0
    Remaining Value: 141.11
Sell Date: 
2010-06-09 00:00:00
    Sell Price: 9899.25
    Updated Value: 10040.36

-------------------------

Buy Date: 
2010-06-18 00:00:00
Account Value: 10040.36
    Buy Price: 10450.64
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2010-08-20 00:00:00
    Sell Price: 10213.62
    Updated Value: 10040.36

-------------------------

Buy Date: 
2010-10-29 00:00:00
Account Value: 10040.36
    Buy Price: 11118.4
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2011-09-14 00:00:00
    Sell Price: 11246.73
    Updated Value: 10040.36

-------------------------

Buy Date: 
2012-01-20 00:00:00
Account Value: 10040.36
    Buy Price: 12720.48
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2012-08-01 00:00:00
    Sell Price: 12971.06
    Updated Value: 10040.36

-------------------------

Buy Date: 
2012-10-17 00:00:00
Account Value: 10040.36
    Buy Price: 13557.0
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2013-02-21 00:00:00
    Sell Price: 13880.62
    Updated Value: 10040.36

-------------------------

Buy Date: 
2013-04-01 00:00:00
Account Value: 10040.36
    Buy Price: 14572.85
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2013-12-24 00:00:00
    Sell Price: 16357.55
    Updated Value: 10040.36

-------------------------

Buy Date: 
2014-01-14 00:00:00
Account Value: 10040.36
    Buy Price: 16373.86
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2014-06-09 00:00:00
    Sell Price: 16943.1
    Updated Value: 10040.36

-------------------------

Buy Date: 
2014-06-26 00:00:00
Account Value: 10040.36
    Buy Price: 16846.13
    Num Shares: 0.0
    Remaining Value: 10040.36
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 10040.36


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 10040.36





-----------------------------------------------------------------------
DJIA Calculations, N = [100, 200]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-04-04 00:00:00
Account Value: 10000
    Buy Price: 10235.17
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-08-07 00:00:00
    Sell Price: 8456.15
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-07-09 00:00:00
Account Value: 10000.0
    Buy Price: 9156.21
    Num Shares: 1.0
    Remaining Value: 843.79
Sell Date: 
2004-08-24 00:00:00
    Sell Price: 10098.63
    Updated Value: 10942.42

-------------------------

Buy Date: 
2005-01-05 00:00:00
Account Value: 10942.42
    Buy Price: 10597.83
    Num Shares: 1.0
    Remaining Value: 344.59
Sell Date: 
2005-07-27 00:00:00
    Sell Price: 10637.09
    Updated Value: 10981.68

-------------------------

Buy Date: 
2005-11-22 00:00:00
Account Value: 10981.68
    Buy Price: 10871.43
    Num Shares: 1.0
    Remaining Value: 110.25
Sell Date: 
2008-02-12 00:00:00
    Sell Price: 12373.41
    Updated Value: 12483.66

-------------------------

Buy Date: 
2009-08-11 00:00:00
Account Value: 12483.66
    Buy Price: 9241.45
    Num Shares: 1.0
    Remaining Value: 3242.21
Sell Date: 
2010-09-03 00:00:00
    Sell Price: 10447.93
    Updated Value: 13690.14

-------------------------

Buy Date: 
2010-11-24 00:00:00
Account Value: 13690.14
    Buy Price: 11187.28
    Num Shares: 1.0
    Remaining Value: 2502.86
Sell Date: 
2011-09-30 00:00:00
    Sell Price: 10913.38
    Updated Value: 13416.24

-------------------------

Buy Date: 
2012-02-24 00:00:00
Account Value: 13416.24
    Buy Price: 12982.95
    Num Shares: 1.0
    Remaining Value: 433.29
Sell Date: 
2012-10-03 00:00:00
    Sell Price: 13494.61
    Updated Value: 13927.9

-------------------------

Buy Date: 
2012-10-10 00:00:00
Account Value: 13927.9
    Buy Price: 13344.97
    Num Shares: 1.0
    Remaining Value: 582.93
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 18640.58


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 18640.58





-----------------------------------------------------------------------
DJIA Calculations, N = [100, 250]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2002-05-24 00:00:00
Account Value: 10000
    Buy Price: 10104.26
    Num Shares: 0.0
    Remaining Value: 10000.0
Sell Date: 
2002-08-13 00:00:00
    Sell Price: 8482.39
    Updated Value: 10000.0

-------------------------

Buy Date: 
2003-07-15 00:00:00
Account Value: 10000.0
    Buy Price: 9128.97
    Num Shares: 1.0
    Remaining Value: 871.03
Sell Date: 
2004-09-30 00:00:00
    Sell Price: 10080.27
    Updated Value: 10951.3

-------------------------

Buy Date: 
2005-01-31 00:00:00
Account Value: 10951.3
    Buy Price: 10489.94
    Num Shares: 1.0
    Remaining Value: 461.36
Sell Date: 
2005-08-19 00:00:00
    Sell Price: 10559.23
    Updated Value: 11020.59

-------------------------

Buy Date: 
2005-09-12 00:00:00
Account Value: 11020.59
    Buy Price: 10682.94
    Num Shares: 1.0
    Remaining Value: 337.65
Sell Date: 
2005-10-20 00:00:00
    Sell Price: 10281.1
    Updated Value: 10618.75

-------------------------

Buy Date: 
2005-12-01 00:00:00
Account Value: 10618.75
    Buy Price: 10912.57
    Num Shares: 0.0
    Remaining Value: 10618.75
Sell Date: 
2005-12-09 00:00:00
    Sell Price: 10778.58
    Updated Value: 10618.75

-------------------------

Buy Date: 
2005-12-12 00:00:00
Account Value: 10618.75
    Buy Price: 10767.77
    Num Shares: 0.0
    Remaining Value: 10618.75
Sell Date: 
2008-03-05 00:00:00
    Sell Price: 12254.99
    Updated Value: 10618.75

-------------------------

Buy Date: 
2009-09-11 00:00:00
Account Value: 10618.75
    Buy Price: 9605.41
    Num Shares: 1.0
    Remaining Value: 1013.34
Sell Date: 
2010-09-22 00:00:00
    Sell Price: 10739.31
    Updated Value: 11752.65

-------------------------

Buy Date: 
2010-11-18 00:00:00
Account Value: 11752.65
    Buy Price: 11181.23
    Num Shares: 1.0
    Remaining Value: 571.42
Sell Date: 
2011-10-20 00:00:00
    Sell Price: 11541.78
    Updated Value: 12113.2

-------------------------

Buy Date: 
2012-03-01 00:00:00
Account Value: 12113.2
    Buy Price: 12980.3
    Num Shares: 0.0
    Remaining Value: 12113.2
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 12113.2


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 12113.2





-----------------------------------------------------------------------
DJIA Calculations, N = [100, 300]
-----------------------------------------------------------------------


-------------------------

Buy Date: 
2003-08-04 00:00:00
Account Value: 10000
    Buy Price: 9186.04
    Num Shares: 1.0
    Remaining Value: 813.96
Sell Date: 
2004-11-24 00:00:00
    Sell Price: 10520.31
    Updated Value: 11334.27

-------------------------

Buy Date: 
2005-01-03 00:00:00
Account Value: 11334.27
    Buy Price: 10729.43
    Num Shares: 1.0
    Remaining Value: 604.84
Sell Date: 
2008-03-14 00:00:00
    Sell Price: 11951.09
    Updated Value: 12555.93

-------------------------

Buy Date: 
2009-10-20 00:00:00
Account Value: 12555.93
    Buy Price: 10041.48
    Num Shares: 1.0
    Remaining Value: 2514.45
Sell Date: 
2011-11-23 00:00:00
    Sell Price: 11257.55
    Updated Value: 13772.0

-------------------------

Buy Date: 
2012-02-28 00:00:00
Account Value: 13772.0
    Buy Price: 13005.12
    Num Shares: 1.0
    Remaining Value: 766.88
Sell Date: 
2015-04-10 00:00:00
    Sell Price: 18057.65
    Updated Value: 18824.53


===============================

DJIA:
Final Value Basic: 0.0
Final Value Crossover: 18824.53




</pre>
</div>
</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<h4 id="dji-dow-jones-industrial-sorted-returns">DJI (Dow Jones Industrial) Sorted Returns</h4>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[143]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># sorting runs based on net_results</span>
<span class="n">dji_sorted</span> <span class="o">=</span> <span class="nb">sorted</span><span class="p">([(</span><span class="n">n</span><span class="p">,</span> <span class="n">dji_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;net_result&#39;</span><span class="p">],</span> <span class="n">dji_runs</span><span class="p">[</span><span class="n">n</span><span class="p">][</span><span class="s">&#39;N&#39;</span><span class="p">])</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">dji_runs</span><span class="p">],</span> <span class="n">key</span><span class="o">=</span><span class="k">lambda</span> <span class="n">x</span><span class="p">:</span><span class="n">x</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="n">reverse</span><span class="o">=</span><span class="bp">True</span><span class="p">)</span>
<span class="n">dji_sorted</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[143]:</div>


<div class="output_text output_subarea output_pyout">
<pre>
[(&apos;[30, 200]&apos;, 21209.480000000003, [30, 200]),
 (&apos;[60, 300]&apos;, 20951.739999999998, [60, 300]),
 (&apos;[10, 300]&apos;, 20621.18, [10, 300]),
 (&apos;[80, 300]&apos;, 20430.360000000004, [80, 300]),
 (&apos;[40, 200]&apos;, 20402.0, [40, 200]),
 (&apos;[40, 300]&apos;, 20159.459999999999, [40, 300]),
 (&apos;[50, 200]&apos;, 20126.110000000001, [50, 200]),
 (&apos;[50, 300]&apos;, 20094.959999999999, [50, 300]),
 (&apos;[15, 200]&apos;, 19653.130000000001, [15, 200]),
 (&apos;[20, 200]&apos;, 19589.549999999999, [20, 200]),
 (&apos;[50, 75]&apos;, 19569.540000000001, [50, 75]),
 (&apos;[40, 75]&apos;, 19425.789999999997, [40, 75]),
 (&apos;[50, 250]&apos;, 19332.150000000001, [50, 250]),
 (&apos;[80, 200]&apos;, 19327.059999999998, [80, 200]),
 (&apos;[10, 200]&apos;, 18874.750000000004, [10, 200]),
 (&apos;[100, 300]&apos;, 18824.529999999999, [100, 300]),
 (&apos;[100, 200]&apos;, 18640.580000000002, [100, 200]),
 (&apos;[15, 300]&apos;, 18435.900000000001, [15, 300]),
 (&apos;[30, 250]&apos;, 18378.619999999999, [30, 250]),
 (&apos;[40, 50]&apos;, 17362.259999999998, [40, 50]),
 (&apos;[60, 75]&apos;, 15729.979999999998, [60, 75]),
 (&apos;[10, 75]&apos;, 15639.259999999995, [10, 75]),
 (&apos;[15, 30]&apos;, 15442.179999999997, [15, 30]),
 (&apos;[40, 125]&apos;, 15297.139999999999, [40, 125]),
 (&apos;[10, 50]&apos;, 15174.750000000002, [10, 50]),
 (&apos;[20, 75]&apos;, 14841.409999999998, [20, 75]),
 (&apos;[30, 125]&apos;, 13328.269999999999, [30, 125]),
 (&apos;[30, 75]&apos;, 13267.909999999998, [30, 75]),
 (&apos;[40, 250]&apos;, 12472.51, [40, 250]),
 (&apos;[15, 75]&apos;, 12378.900000000001, [15, 75]),
 (&apos;[60, 200]&apos;, 12217.290000000001, [60, 200]),
 (&apos;[80, 250]&apos;, 12159.050000000001, [80, 250]),
 (&apos;[100, 250]&apos;, 12113.200000000001, [100, 250]),
 (&apos;[20, 300]&apos;, 12059.91, [20, 300]),
 (&apos;[10, 250]&apos;, 11903.389999999999, [10, 250]),
 (&apos;[30, 300]&apos;, 11885.82, [30, 300]),
 (&apos;[30, 50]&apos;, 11789.120000000001, [30, 50]),
 (&apos;[20, 250]&apos;, 11788.08, [20, 250]),
 (&apos;[20, 125]&apos;, 11752.479999999996, [20, 125]),
 (&apos;[60, 250]&apos;, 11668.109999999999, [60, 250]),
 (&apos;[15, 125]&apos;, 11514.33, [15, 125]),
 (&apos;[10, 125]&apos;, 11464.279999999997, [10, 125]),
 (&apos;[15, 250]&apos;, 11425.279999999999, [15, 250]),
 (&apos;[80, 125]&apos;, 11398.040000000001, [80, 125]),
 (&apos;[15, 50]&apos;, 11296.789999999995, [15, 50]),
 (&apos;[20, 30]&apos;, 11020.710000000001, [20, 30]),
 (&apos;[50, 125]&apos;, 10920.199999999999, [50, 125]),
 (&apos;[60, 125]&apos;, 10566.299999999999, [60, 125]),
 (&apos;[10, 30]&apos;, 10428.239999999996, [10, 30]),
 (&apos;[20, 50]&apos;, 10241.93, [20, 50]),
 (&apos;[100, 125]&apos;, 10040.360000000001, [100, 125])]
</pre>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h2 id="analysis">Analysis</h2>
<p>In order to look at the three lists and determine which crossover dates yield the best results, I have decided to sum the the indices in which each crossover pair occurs. The end result would mean that the crossover pair with the lowest total sum had the best outcome if you were to combine all three lists.</p>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[146]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># create dictionary with initial value of 0 for each entry</span>
<span class="n">idxSum_dict</span> <span class="o">=</span> <span class="nb">dict</span><span class="p">((</span><span class="n">el</span><span class="p">,</span><span class="mi">0</span><span class="p">)</span> <span class="k">for</span> <span class="n">el</span> <span class="ow">in</span> <span class="n">dji_runs</span><span class="o">.</span><span class="n">keys</span><span class="p">())</span>

<span class="c"># find how many keys exist</span>
<span class="c"># NOTE: same for all runs</span>
<span class="n">num_keys</span> <span class="o">=</span> <span class="nb">len</span><span class="p">(</span><span class="n">dji_runs</span><span class="o">.</span><span class="n">keys</span><span class="p">())</span>



<span class="c"># calculate for dji sorted idx</span>
<span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="n">num_keys</span><span class="p">):</span>
    <span class="n">idxSum_dict</span><span class="p">[</span><span class="n">dji_sorted</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="mi">0</span><span class="p">]]</span> <span class="o">+=</span> <span class="n">i</span>
    
<span class="c"># calculate for ixic sorted idx</span>
<span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="n">num_keys</span><span class="p">):</span>
    <span class="n">idxSum_dict</span><span class="p">[</span><span class="n">ixic_sorted</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="mi">0</span><span class="p">]]</span> <span class="o">+=</span> <span class="n">i</span>

<span class="c"># calculate for gspc sorted idx</span>
<span class="k">for</span> <span class="n">i</span> <span class="ow">in</span> <span class="nb">range</span><span class="p">(</span><span class="n">num_keys</span><span class="p">):</span>
    <span class="n">idxSum_dict</span><span class="p">[</span><span class="n">gspc_sorted</span><span class="p">[</span><span class="n">i</span><span class="p">][</span><span class="mi">0</span><span class="p">]]</span> <span class="o">+=</span> <span class="n">i</span>
    
    
    
    
<span class="c"># print out dictionary to look at sums</span>
<span class="n">idxSum_dict</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[146]:</div>


<div class="output_text output_subarea output_pyout">
<pre>
{&apos;[10, 125]&apos;: 123,
 &apos;[10, 200]&apos;: 38,
 &apos;[10, 250]&apos;: 52,
 &apos;[10, 300]&apos;: 12,
 &apos;[10, 30]&apos;: 127,
 &apos;[10, 50]&apos;: 77,
 &apos;[10, 75]&apos;: 46,
 &apos;[100, 125]&apos;: 98,
 &apos;[100, 200]&apos;: 77,
 &apos;[100, 250]&apos;: 86,
 &apos;[100, 300]&apos;: 72,
 &apos;[15, 125]&apos;: 120,
 &apos;[15, 200]&apos;: 17,
 &apos;[15, 250]&apos;: 63,
 &apos;[15, 300]&apos;: 61,
 &apos;[15, 30]&apos;: 96,
 &apos;[15, 50]&apos;: 91,
 &apos;[15, 75]&apos;: 89,
 &apos;[20, 125]&apos;: 119,
 &apos;[20, 200]&apos;: 28,
 &apos;[20, 250]&apos;: 82,
 &apos;[20, 300]&apos;: 65,
 &apos;[20, 30]&apos;: 99,
 &apos;[20, 50]&apos;: 125,
 &apos;[20, 75]&apos;: 99,
 &apos;[30, 125]&apos;: 66,
 &apos;[30, 200]&apos;: 44,
 &apos;[30, 250]&apos;: 33,
 &apos;[30, 300]&apos;: 85,
 &apos;[30, 50]&apos;: 111,
 &apos;[30, 75]&apos;: 105,
 &apos;[40, 125]&apos;: 48,
 &apos;[40, 200]&apos;: 29,
 &apos;[40, 250]&apos;: 67,
 &apos;[40, 300]&apos;: 44,
 &apos;[40, 50]&apos;: 112,
 &apos;[40, 75]&apos;: 88,
 &apos;[50, 125]&apos;: 69,
 &apos;[50, 200]&apos;: 21,
 &apos;[50, 250]&apos;: 48,
 &apos;[50, 300]&apos;: 64,
 &apos;[50, 75]&apos;: 75,
 &apos;[60, 125]&apos;: 109,
 &apos;[60, 200]&apos;: 61,
 &apos;[60, 250]&apos;: 112,
 &apos;[60, 300]&apos;: 47,
 &apos;[60, 75]&apos;: 53,
 &apos;[80, 125]&apos;: 128,
 &apos;[80, 200]&apos;: 72,
 &apos;[80, 250]&apos;: 115,
 &apos;[80, 300]&apos;: 57}
</pre>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[147]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># now lets order this dictionary</span>
<span class="c"># NOTE - smallest values mean best ranking in each of 3 previous ranked lists</span>
<span class="n">idxSum_sorted</span> <span class="o">=</span> <span class="nb">sorted</span><span class="p">([(</span><span class="n">n</span><span class="p">,</span> <span class="n">idxSum_dict</span><span class="p">[</span><span class="n">n</span><span class="p">])</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">idxSum_dict</span><span class="p">],</span> <span class="n">key</span><span class="o">=</span><span class="k">lambda</span> <span class="n">x</span><span class="p">:</span><span class="n">x</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="n">reverse</span><span class="o">=</span><span class="bp">False</span><span class="p">)</span>
<span class="n">idxSum_sorted</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[147]:</div>


<div class="output_text output_subarea output_pyout">
<pre>
[(&apos;[10, 300]&apos;, 12),
 (&apos;[15, 200]&apos;, 17),
 (&apos;[50, 200]&apos;, 21),
 (&apos;[20, 200]&apos;, 28),
 (&apos;[40, 200]&apos;, 29),
 (&apos;[30, 250]&apos;, 33),
 (&apos;[10, 200]&apos;, 38),
 (&apos;[40, 300]&apos;, 44),
 (&apos;[30, 200]&apos;, 44),
 (&apos;[10, 75]&apos;, 46),
 (&apos;[60, 300]&apos;, 47),
 (&apos;[40, 125]&apos;, 48),
 (&apos;[50, 250]&apos;, 48),
 (&apos;[10, 250]&apos;, 52),
 (&apos;[60, 75]&apos;, 53),
 (&apos;[80, 300]&apos;, 57),
 (&apos;[15, 300]&apos;, 61),
 (&apos;[60, 200]&apos;, 61),
 (&apos;[15, 250]&apos;, 63),
 (&apos;[50, 300]&apos;, 64),
 (&apos;[20, 300]&apos;, 65),
 (&apos;[30, 125]&apos;, 66),
 (&apos;[40, 250]&apos;, 67),
 (&apos;[50, 125]&apos;, 69),
 (&apos;[100, 300]&apos;, 72),
 (&apos;[80, 200]&apos;, 72),
 (&apos;[50, 75]&apos;, 75),
 (&apos;[100, 200]&apos;, 77),
 (&apos;[10, 50]&apos;, 77),
 (&apos;[20, 250]&apos;, 82),
 (&apos;[30, 300]&apos;, 85),
 (&apos;[100, 250]&apos;, 86),
 (&apos;[40, 75]&apos;, 88),
 (&apos;[15, 75]&apos;, 89),
 (&apos;[15, 50]&apos;, 91),
 (&apos;[15, 30]&apos;, 96),
 (&apos;[100, 125]&apos;, 98),
 (&apos;[20, 75]&apos;, 99),
 (&apos;[20, 30]&apos;, 99),
 (&apos;[30, 75]&apos;, 105),
 (&apos;[60, 125]&apos;, 109),
 (&apos;[30, 50]&apos;, 111),
 (&apos;[40, 50]&apos;, 112),
 (&apos;[60, 250]&apos;, 112),
 (&apos;[80, 250]&apos;, 115),
 (&apos;[20, 125]&apos;, 119),
 (&apos;[15, 125]&apos;, 120),
 (&apos;[10, 125]&apos;, 123),
 (&apos;[20, 50]&apos;, 125),
 (&apos;[10, 30]&apos;, 127),
 (&apos;[80, 125]&apos;, 128)]
</pre>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing text_cell rendered">
<div class="prompt input_prompt">
</div>
<div class="inner_cell">
<div class="text_cell_render border-box-sizing rendered_html">
<p><br></p>
<h2 id="plotting">Plotting</h2>
<p>It may be interesting to look at a three dimensional plot that would allow one to see both crossover points and their net result for each index.</p>
</div>
</div>
</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[180]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># create plot variables</span>

<span class="c"># x is short crossover</span>
<span class="c"># y is long crossover</span>
<span class="c"># z is net result - NORMALIZE THIS VALUE!</span>

<span class="c"># gspc</span>
<span class="n">gspc_x</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">0</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">gspc_sorted</span><span class="p">]</span>
<span class="n">gspc_y</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">gspc_sorted</span><span class="p">]</span>
<span class="n">gspc_z</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">gspc_sorted</span><span class="p">]</span>
<span class="n">gspc_z</span> <span class="o">=</span> <span class="n">gspc_z</span> <span class="o">/</span> <span class="n">np</span><span class="o">.</span><span class="n">max</span><span class="p">(</span><span class="n">gspc_z</span><span class="p">)</span>

<span class="c"># ixic</span>
<span class="n">ixic_x</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">0</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">ixic_sorted</span><span class="p">]</span>
<span class="n">ixic_y</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">ixic_sorted</span><span class="p">]</span>
<span class="n">ixic_z</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">ixic_sorted</span><span class="p">]</span>
<span class="n">ixic_z</span> <span class="o">=</span> <span class="n">ixic_z</span> <span class="o">/</span> <span class="n">np</span><span class="o">.</span><span class="n">max</span><span class="p">(</span><span class="n">ixic_z</span><span class="p">)</span>

<span class="c"># dji</span>
<span class="n">dji_x</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">0</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">dji_sorted</span><span class="p">]</span>
<span class="n">dji_y</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">2</span><span class="p">][</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">dji_sorted</span><span class="p">]</span>
<span class="n">dji_z</span> <span class="o">=</span> <span class="p">[</span><span class="n">n</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="k">for</span> <span class="n">n</span> <span class="ow">in</span> <span class="n">dji_sorted</span><span class="p">]</span>
<span class="n">dji_z</span> <span class="o">=</span> <span class="n">dji_z</span> <span class="o">/</span> <span class="n">np</span><span class="o">.</span><span class="n">max</span><span class="p">(</span><span class="n">dji_z</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[181]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre><span class="c"># PLOTLY 3D SCATTER PLOT</span>

<span class="n">trace1</span> <span class="o">=</span> <span class="n">Scatter3d</span><span class="p">(</span>
    <span class="n">x</span><span class="o">=</span><span class="n">gspc_x</span><span class="p">,</span>
    <span class="n">y</span><span class="o">=</span><span class="n">gspc_y</span><span class="p">,</span>
    <span class="n">z</span><span class="o">=</span><span class="n">gspc_z</span><span class="p">,</span>
    <span class="n">mode</span><span class="o">=</span><span class="s">&#39;markers&#39;</span><span class="p">,</span>
    <span class="n">marker</span><span class="o">=</span><span class="n">Marker</span><span class="p">(</span>
        <span class="n">size</span><span class="o">=</span><span class="mi">10</span><span class="p">,</span>
        <span class="n">opacity</span><span class="o">=</span><span class="mf">0.8</span>
    <span class="p">)</span>
<span class="p">)</span>

<span class="n">trace2</span> <span class="o">=</span> <span class="n">Scatter3d</span><span class="p">(</span>
    <span class="n">x</span><span class="o">=</span><span class="n">ixic_x</span><span class="p">,</span>
    <span class="n">y</span><span class="o">=</span><span class="n">ixic_y</span><span class="p">,</span>
    <span class="n">z</span><span class="o">=</span><span class="n">ixic_z</span><span class="p">,</span>
    <span class="n">mode</span><span class="o">=</span><span class="s">&#39;markers&#39;</span><span class="p">,</span>
    <span class="n">marker</span><span class="o">=</span><span class="n">Marker</span><span class="p">(</span>
        <span class="n">size</span><span class="o">=</span><span class="mi">10</span><span class="p">,</span>
        <span class="n">opacity</span><span class="o">=</span><span class="mf">0.8</span>
    <span class="p">)</span>
<span class="p">)</span>

<span class="n">trace3</span> <span class="o">=</span> <span class="n">Scatter3d</span><span class="p">(</span>
    <span class="n">x</span><span class="o">=</span><span class="n">dji_x</span><span class="p">,</span>
    <span class="n">y</span><span class="o">=</span><span class="n">dji_y</span><span class="p">,</span>
    <span class="n">z</span><span class="o">=</span><span class="n">dji_z</span><span class="p">,</span>
    <span class="n">mode</span><span class="o">=</span><span class="s">&#39;markers&#39;</span><span class="p">,</span>
    <span class="n">marker</span><span class="o">=</span><span class="n">Marker</span><span class="p">(</span>
        <span class="n">size</span><span class="o">=</span><span class="mi">10</span><span class="p">,</span>
        <span class="n">opacity</span><span class="o">=</span><span class="mf">0.8</span>
    <span class="p">)</span>
<span class="p">)</span>



<span class="n">data</span> <span class="o">=</span> <span class="n">Data</span><span class="p">([</span><span class="n">trace1</span><span class="p">,</span> <span class="n">trace2</span><span class="p">,</span> <span class="n">trace3</span><span class="p">])</span>


<span class="n">layout</span> <span class="o">=</span> <span class="n">Layout</span><span class="p">(</span>
    <span class="n">margin</span><span class="o">=</span><span class="n">Margin</span><span class="p">(</span>
        <span class="n">l</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span>
        <span class="n">r</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span>
        <span class="n">b</span><span class="o">=</span><span class="mi">0</span><span class="p">,</span>
        <span class="n">t</span><span class="o">=</span><span class="mi">0</span>
    <span class="p">)</span>
<span class="p">)</span>
<span class="n">fig</span> <span class="o">=</span> <span class="n">Figure</span><span class="p">(</span><span class="n">data</span><span class="o">=</span><span class="n">data</span><span class="p">,</span> <span class="n">layout</span><span class="o">=</span><span class="n">layout</span><span class="p">)</span>

<span class="n">plt</span><span class="o">.</span><span class="n">rcParams</span><span class="p">[</span><span class="s">&#39;figure.figsize&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="mi">20</span><span class="p">,</span> <span class="mi">20</span>  <span class="c"># that&#39;s default image size for this </span>


<span class="n">py</span><span class="o">.</span><span class="n">iplot</span><span class="p">(</span><span class="n">fig</span><span class="p">,</span> <span class="n">filename</span><span class="o">=</span><span class="s">&#39;simple-3d-scatter&#39;</span><span class="p">)</span>
</pre></div>

</div>
</div>
</div>

<div class="output_wrapper">
<div class="output">


<div class="output_area"><div class="prompt output_prompt">Out[181]:</div>

<div class="output_html rendered_html output_subarea output_pyout">
<iframe id="igraph" scrolling="no" style="border:none;"seamless="seamless" src="https://plot.ly/~pkray/293.embed" height="525" width="100%"></iframe>
</div>

</div>

</div>
</div>

</div>
<div class="cell border-box-sizing code_cell rendered">
<div class="input">
<div class="prompt input_prompt">In&nbsp;[&nbsp;]:</div>
<div class="inner_cell">
    <div class="input_area">
<div class="highlight"><pre> 
</pre></div>

</div>
</div>
</div>

</div>
    </div>
  </div>
</body>
</html>

