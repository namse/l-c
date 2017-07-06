// 1."안녕" 로그를 출력하는 람다 함수 만들기

exports.handler = (event, context, callback) => {
  console.log('hello');
  callback();
};
