<?php

$fileStr = file_get_contents(__DIR__ . '/interfaceDoc.md');
preg_match_all('/\#\#\#\#\s\d+、\s*(.*)\s*请求地址：(.*)\s*请求方式：(.*)\s/i', $fileStr, $match);
list($mt, $apiName, $apiUrl, $apiMethod) = $match;

function fileTer($str)
{
    $str = str_replace(' ', '', trim($str));
    $encode = mb_detect_encoding($str, array("ASCII", 'UTF-8', "GB2312", "GBK", 'BIG5'));
    $str_encode = mb_convert_encoding($str, 'UTF-8', $encode);
    return $str_encode;
}

$api = [];
$jsonStr = '';
foreach ($mt as $k => $v) {
    $name = fileTer($apiName[$k]);
    $url = fileTer($apiUrl[$k]);
    $method = fileTer($apiMethod[$k]);
    echo join('--', [$name, $url, $method]) . PHP_EOL;

    $key = join(array_map(function ($w) {
        return ucfirst(trim($w));
    }, array_filter(explode('/', $url), function ($item) {
        return !empty($item);
    })));

    $keyWord = lcfirst($key);
    $api[$keyWord] = [
        'title' => $name,
        'route' => $url,
        'method' => $method
    ];
    $jsonStr .= "{$keyWord}:{route:'{$url}',method:'{$method}',title:'{$name}'},\n";
}



$file = __DIR__ . '/BigNews/common/data/api.json';
$jsFile = __DIR__ . '/BigNews/common/data/apiUrl.js';
file_put_contents($file, json_encode($api));
file_put_contents($jsFile,"let api ={\n".$jsonStr."}");


echo 'COMPLETE !!!!';
