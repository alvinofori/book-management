import { FormControl } from "@angular/forms";

export interface BookForm {
    id: FormControl<string>;
    title: FormControl<string>;
    author: FormControl<string>;
    year: FormControl<number>;
    description: FormControl<string>;
    image: FormControl<string>;
}
  