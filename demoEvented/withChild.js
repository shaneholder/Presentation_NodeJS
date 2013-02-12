function workReallyHard () {
	var count = 0;
	for(i = 0; i <= 1000000; i++)
	{
		count = count + 1;
	    console.log(count);
	    process.send(count);
	}
}

workReallyHard();
