/**
 * 그룹 DBMS 입출력할때 사용할 함수 집단..
 * 
 * 이남영
 */ 
 
// var test_string = '2,4,5,2,3';
// var test_cnt = 5;
// var rows = exports.getArray(test_string);
// console.log(rows);
// exports.add()
// var members = rows.reduce(function(a,b){
//                             exports.addMember(a,b.id);
//                         }, []);
                        
// console.log('return: '+ cleanArray(getArray(test_string)));
// console.log('return: '+ cleanArray(exports.getArray(test_string)));
// console.log('return: '+ addMember(getArray(test_string), '6'));
// var a = addMember(getArray(test_string), '6')
// console.log('return: '+ subMember(a, 6));
// 배열을 문자열로
exports.cleanArray = function cleanArray(array){
    // 동일 값 검사
    return array.slice() // 정렬하기 전에 복사본을 만든다.
    .sort(function(a,b){
    	return a - b;
    })
    .reduce(function(a,b){
    	if (a.slice(-1)[0] !== b) a.push(b); // slice(-1)[0] 을 통해 마지막 아이템을 가져온다.
    	return a;
    },[]); //a가 시작될 때를 위한 비어있는 배열
}

// 문자열을 배열로
exports.getArray = function getArray(mem_ids){
    return mem_ids.split(',').reduce(function(a,b){
        a.push(parseInt(b));
        return a;
    },[])
}
// exports.getArray = getArray;

exports.addMember = function addMember(array, id){
    array.push(id);
    return exports.cleanArray(array)
}

exports.subMember = function subMember(array, id){
    return array.reduce(function(a,b){
        if(b != id) a.push(b);
        return a;
    }, []);
}

