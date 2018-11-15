import del from 'del';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';
import tslint from 'gulp-tslint';

const directories = {
    release: './release',
    source: './src' 
};

gulp.task('clean-typescript', () => {
    return del(directories.release + '/**');
});

gulp.task('clean', ['clean-typescript']);

gulp.task('lint-typescript', () => {
    return gulp
        .src(directories.source + '/**/*.ts')
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report());
});

gulp.task('lint', ['lint-typescript']);

gulp.task('build-typescript', ['clean-typescript'], () => {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult =
        tsProject
            .src()
            .pipe(sourcemaps.init())
            .pipe(tsProject());

    return tsResult
        .js
        .pipe(
        sourcemaps.write(
            '../maps',
            {
                // NOTE: VS Code does not support inline content.
                includeContent: false,
                sourceRoot:
                function getSourceRoot() {
                    return __dirname;
                }
            }))
        .pipe(gulp.dest(directories.release));
});

gulp.task('build', ['build-typescript']);

gulp.task('default', ['lint', 'build']);
