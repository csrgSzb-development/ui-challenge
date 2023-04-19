import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ArticleData, ArticleRO } from 'src/app/models/article';
import { CreateArticle } from 'src/app/models/create-article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {

  updateArticleSlug?: string;
  titleMinChar?: number;
  titleMaxChar?: number;
  descriptionMinChar?: number;
  descriptionMaxChar?: number;
  tagMinChar?: number;
  tagMaxChar?: number;
  tagPattern?: RegExp;

  articleForm!: FormGroup;

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.titleMinChar= this.articleService.articleDataConfig.titleMinChar;
    this.titleMaxChar= this.articleService.articleDataConfig.titleMaxChar;
    this.descriptionMinChar= this.articleService.articleDataConfig.descriptionMinChar;
    this.descriptionMaxChar= this.articleService.articleDataConfig.descriptionMaxChar;
    this.tagMinChar= this.articleService.articleDataConfig.tagMinChar;
    this.tagMaxChar= this.articleService.articleDataConfig.tagMaxChar;
    this.tagPattern= this.articleService.articleDataConfig.tagPattern;
    this.articleForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(this.titleMinChar), Validators.maxLength(this.titleMaxChar)]),
      description: new FormControl('', [Validators.required, Validators.minLength(this.descriptionMinChar), Validators.maxLength(this.descriptionMaxChar)]),
      body: new FormControl('', [Validators.required]),
      tagList: new FormArray([
        new FormControl('', [Validators.minLength(this.tagMinChar), Validators.maxLength(this.tagMaxChar), Validators.pattern(this.tagPattern)]),
      ])
    });

    this.updateArticleSlug = this.activatedRoute.snapshot.params['slug'];
    if (this.updateArticleSlug) {
      this.articleService.getArticleBySlug(this.updateArticleSlug).subscribe({
        next: (data: ArticleRO) => {
          this.articleForm.patchValue(data.article);
          this.onDeleteTag(0);
          data.article.tagList.forEach(tag => this.onAddTag(tag));
        },
        error: (err) => this.toastr.error(`${err}`, 'Error during loading!'),
      })
    }
  }

  onSubmit(): void {

    const newArticle: CreateArticle = {
      ...this.articleForm.value,
    }

    if (this.updateArticleSlug) {
      this.articleService.updateArticle(newArticle, this.updateArticleSlug).subscribe({
        next: (data: ArticleRO) => {
          this.toastr.info(`The article with \"${data.article.title}\" title was updated.`, 'Success!')
          this.navigateToHome();
        },
        error: (err) => this.toastr.error(`${err}`, 'Error during save!')
      })
    } else {
      this.articleService.saveArticle(newArticle).subscribe({
        next: (data: ArticleData ) => {
          this.toastr.success(`Article with \"${data.title}\" title was saved.`, 'Success!')
          this.articleForm.reset();
          this.navigateToHome();
        },
        error: (err) => {
          this.toastr.error(`${err}`, 'Error during save!') }
      })
    }
  };

  onCancel(): void {
    this.navigateToHome();
  }

  onDelete() {
    if(confirm('Are you sure, that you want to delete this article?')) {
      this.articleService.deleteArticle(this.updateArticleSlug!).subscribe({
        next: data => this.toastr.success(`Article was succesfully deleted!`, 'OK'),
        complete: () => this.navigateToHome()
      })
    }
  }

  onAddTag(tag: string = '') {
    (this.tagList as FormArray).push(
      new FormControl(tag, [Validators.minLength(this.tagMinChar!), Validators.maxLength(this.tagMaxChar!), Validators.pattern(this.tagPattern!)]),
    );
  }

  onDeleteTag(index: number) {
    (<FormArray>this.articleForm.get('tagList')).removeAt(index);
  }

  private navigateToHome(): void {
    this.router.navigate(['']);
  }

  get title() { return this.articleForm.get('title') };
  get description() { return this.articleForm.get('description') };
  get body() { return this.articleForm.get('body') };
  get tagList() { return this.articleForm.get('tagList') as FormArray};
  get tagListFormArraycontrols() { return (this.tagList as FormArray).controls };

}
