//ykaner 


function course_filter(){
	var all_regex = /^[א-ת\s]+[\d\s]+[אבק]\d*$/m;

	var names = [];
	var courses = document.getElementsByClassName('coursebox clearfix');
	var semester = [];

	for (var i = 0; i < courses.length; i++){
		var c = courses[i];
		var name_node = c.getElementsByClassName('coursename')[0];
		if (name_node == undefined){
			console.log('name not found');
			continue;
		}
		var name = name_node.innerText;

		names.push(name);
		if(!all_regex.test(name)){
			semester[i] = 'x';
			continue;
		}

		var last = name.split(' ').pop();
		if(/[אבק]\d{2}\s/.test(last)){
			semester[i] = {א:'a', ב:'b', ק:'c'}[last[0]];
		}
		else{
			semester[i] = 'x';
		}

		delete name;
	}

	show = {
		a: false,
		b: true,
		c: false,
		x: false
	}

	shown = 0;
	for (i = 0; i < courses.length; i++){
		c = courses[i];
		if(!show[semester[i]]){
			c.style.display = 'none';
		}
		else{
			c.style.display = '';
			if (shown % 2 == 0){
				c.classList.remove('even');
				c.classList.add('odd');
				
				if (shown == 0){
					c.classList.add('first');
				}
			}
			else{
				c.classList.remove('odd');
				c.classList.add('even');		
			}
			shown++;
		}
	}
}


window.addEventListener('load', course_filter);
