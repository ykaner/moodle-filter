//ykaner ©

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function add_controls(){
	var control_element = htmlToElement('<fieldset> <legend>בחר איזה קורסים להציג</legend> <div id="cbxs"> <div> <input type="checkbox" id="in-a" name="a" value="סמסטר א"> <label for="a">סמסטר א</label> </div> <div> <input type="checkbox" id="in-b" name="b" value="סמסטר ב" checked> <label for="b">סמסטר ב</label> </div> <div> <input type="checkbox" id="in-c" name="c" value="סמסטר קיץ"> <label for="c">סמסטר קיץ</label> </div> <div> <input type="checkbox" id="in-x" name="x" value="אחר"> <label for="x">כל דבר שהוא לא קורס - ספריה וכו</label> </div> </div> </fieldset>');

	var course_box = document.getElementsByClassName('courses frontpage-course-list-enrolled')[0];
	var frontpage = document.getElementById('frontpage-course-list');
	frontpage.insertBefore(control_element, course_box);

	var img = document.createElement('img');
	var open_img = 'https://image.flaticon.com/icons/svg/118/118738.svg';
	var close_img = 'https://image.flaticon.com/icons/svg/126/126492.svg';
	img.src = open_img;
	img.width = img.height = 16;
	img.setAttribute('shown', 1);
	control_element.insertBefore(img, control_element.firstChild);
	var cbxs = control_element.querySelector('#cbxs');
	img.onclick = function(){
		if(img.getAttribute('shown') == 1){
			cbxs.style.display = 'none';
			img.setAttribute('shown', 0);
			img.src = close_img;
		}
		else{
			cbxs.style.display = '';
			img.setAttribute('shown', 1);
			img.src = open_img;
		}
	}

	var default_show = {
		a: false,
		b: true,
		c: false,
		x: false
	};

	var show = default_show;

	var in_a = control_element.querySelector('#in-a');
	var in_b = control_element.querySelector('#in-b');
	var in_c = control_element.querySelector('#in-c');
	var in_x = control_element.querySelector('#in-x');

	chck_boxes = [in_a, in_b, in_c, in_x];

	for(var cb of chck_boxes){
		cb.checked = default_show[cb.name];
	}

	function changed(cb){
		show[cb.name] = cb.checked;
	}

	for(var cb of chck_boxes){
		cb.addEventListener('change', function(event){
			changed(event.target);
			course_filter(show);
		});
	}

	course_filter(show);

}


var courses;
var semester = [];

function classify_courses(){
	var all_regex = /^[א-ת\s!"#$%&'()*+,./:;<=>?@\^_`{|}~-]+[\d\s]+[אבק]\d*$/m;

	var names = [];
	courses = document.getElementsByClassName('coursebox clearfix');

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
}

function course_filter(show){

	var shown = 0;
	for (var i = 0; i < courses.length; i++){
		var c = courses[i];
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


window.addEventListener('load', classify_courses);
window.addEventListener('load', add_controls);
