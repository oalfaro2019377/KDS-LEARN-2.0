import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchCourse'
})
export class SearchCoursePipe implements PipeTransform {

  transform(courses: any, search: any): any {
    if(search == undefined) return courses;
    else return courses.filter(course=>{
      return course.name.toLowerCase().includes(search.toLowerCase());
    })
  }

}
